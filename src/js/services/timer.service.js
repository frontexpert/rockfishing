rockFishing.services.factory('TimerService', function ($interval, $cordovaLocalNotification, $cordovaDialogs, SessionService, GeolocationService, GeofenceService) {
    var stop,
        // determine the amount of timer's delay
        delay = 1000,
        // a constant to calibrate the entered duration so that when we enter 1 hour duration the timer could be adjusted to not running on actual 1 hour (e.g. 60000 = 1 minute not 1 hour)
        duration_calibration_amount = 60000 * 60,
        // a constant to determine when the app should invoke function a within a period (duration_calibration_amount)
        subdelay_a = 15000 * 60,
        // a constant to determine when the app should invoke function b within a period (duration_calibration_amount)
        subdelay_b = 30000 * 60,
        // a constant to determine how many amount of time should be reduced from total duration to get the time for triggering function c 
        subsctracted_time_to_get_c = 10000 * 60,
        // A collection of times that determine when the function a should be invoked. 
        times_to_trigger_a = [],
        // A collection of times that determine when the function b should be invoked.
        times_to_trigger_b = [],
        // Determine when the function c should be invoked.
        time_to_trigger_c = [],
        checkin_timestamp,
        last_b,
        last_i = 0,
        totalDuration = 0,
        m = 0,
        trackLocation = false;

    return {
        startTimer: function () {
            var duration = SessionService.getDuration();
            trackLocation = SessionService.getData().locationTracking;
            console.log("track location retrieved" + trackLocation);
            console.log("duration retrieved" + duration);
            totalDuration = duration * duration_calibration_amount;

            checkin_timestamp = Date.now();
            times_to_trigger_a = [];
            times_to_trigger_b = [];
            time_to_trigger_c = [];
            
            // set how many times to trigger each function
            times_to_trigger_a = [checkin_timestamp + subdelay_a];
            if (trackLocation == true) {
                for (last_i = subdelay_b; last_i < totalDuration; last_i = last_i + subdelay_b) {
                    last_b = checkin_timestamp + last_i;
                    times_to_trigger_b.push(last_b);
                }
            }
            time_to_trigger_c = [checkin_timestamp + ((totalDuration) - subsctracted_time_to_get_c)];

            // start timer
            var k = 0, l = 0;
            m = 0;
            stop = $interval(function () {
                // get current time, get time difference between checkin's timestamp & current time
                var current_timestamp = Date.now();
                var diff = current_timestamp - checkin_timestamp;
                
                // invoke function a if the time_diff == subdelay
                if (times_to_trigger_a[k] < current_timestamp) {
                    // Invoke function a
                    console.log("[DEBUG] - Geofence is invoked at " + (new Date(times_to_trigger_a[k])).toISOString());
                    GeofenceService.activateGeofenceFromCache();
                    k++;
                }
                if (times_to_trigger_b[l] < current_timestamp) {
                    console.log("[DEBUG] - update location is invoked at " + (new Date(times_to_trigger_b[l])).toISOString());
                    // Invoke function b
                    GeolocationService.getCurrentPosition().then(function (position) {
                        SessionService.updateData({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });

                        SessionService.updateLocation();
                    });
                    l++;
                }                    
                // invoke function c
                if (time_to_trigger_c[m] < current_timestamp) {
                    console.log("[DEBUG] - session almost end is invoked at " + new Date(time_to_trigger_c[m]).toISOString());
                    SessionService.setCurrentState(3);

                    $cordovaLocalNotification.schedule({
                        id: 55,
                        title: 'Your session is about to end',
                        text: 'Please update your duration or check out',
                        icon: '../img/Rockfishin_Pin.png'
                    });

                    m++;
                }
                 
                // stop this timer when total duration has been elapsed
                if (diff >= totalDuration) {
                    $interval.cancel(stop);
                    stop = undefined;
                    console.log("[DEBUG] - session done at'" + new Date(current_timestamp).toISOString() + "'. Should invoke function d.");

                    SessionService.updateStatus(3).then(function (result) {
                        SessionService.setCurrentState(4);

                        // navigator.notification.alert(
                        //     "Please update your duration or check out", // the message
                        //     function () { },
                        //     "Your session has ended",     // a title
                        //     "Close" // text of the buttons
                        //     );

                        $cordovaLocalNotification.schedule({
                            id: 55,
                            title: 'Your session has ended',
                            text: 'Please update your duration or check out',
                            icon: '../img/Rockfishin_Pin.png'
                        });
                    });
                }
            }, delay);
        },

        extendDuration: function (extraDuration) {
            totalDuration = totalDuration + (extraDuration * duration_calibration_amount);

            if (trackLocation == true) {
                for (last_i; last_i < totalDuration; last_i = last_i + subdelay_b) {
                    last_b = checkin_timestamp + last_i;
                    times_to_trigger_b.push(last_b);
                }
            }

            time_to_trigger_c = [];
            time_to_trigger_c = [checkin_timestamp + ((totalDuration) - subsctracted_time_to_get_c)];
            m = 0;
        }
    }
});