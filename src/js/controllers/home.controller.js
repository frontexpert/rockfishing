rockFishing.controllers.controller('HomeController', function ($ionicPlatform, $scope, $state, $log, $ionicLoading, GeolocationService, SessionService, GeofenceService, WeatherService) {
    var vm = $scope;

    vm.goToCheckin = goToCheckin;
    vm.goToSafety = goToSafety;
    vm.goToEmergency = goToEmergency;
    vm.goToWeather = goToWeather;
    vm.goToMap = goToMap;
    vm.goToExtendDuration = goToExtendDuration;
    vm.hasAlert = false;

    var sessionState = {
        checkedOut: 0,
        checkedIn: 1,
        emergency: 2,
        durationAlmostEnd: 3,
        durationEnd: 4,
        locationChanged: 5
    }

    vm.sessionService = SessionService;
    vm.sessionData = null;
    vm.getCheckInTime = GetCheckInTime;
    vm.getCheckOutTime = GetCheckOutTime;
    vm.doCheckOut = DoCheckOut;
    vm.updateLocation = updateLocation;

    SessionService.loadFromLocalStorage().then(function (data) {
        if (data) {
            vm.sessionData = data;
        }
    });

    // find if has any alert
    $ionicPlatform.ready(function () {
    GeolocationService.getCurrentPosition()
        .then(function (position) {
            $log.info("Current position found", position);

            WeatherService.getWeather(position.coords.latitude, position.coords.longitude, false).then(setIsAlert);

            function setIsAlert(result) {
                if (result.data.status == "success") {
                    vm.weatherRegion = result.data.response.weather_regions[0];
                    if (vm.weatherRegion != null) {
                        if (vm.weatherRegion.weather_alerts.length > 0) {
                            vm.hasAlert = true;
                        }
                    }
                }
            }
        }, function (reason) {
            $log.error("Cannot obtain current location", reason);
        });
        
    });

    function GetCheckInTime() {
        if (vm.sessionData) {
            var checkInTime = vm.sessionData.checkIn.split(' ')[1];
            var splittedTime = checkInTime.split(":");
            var hours = splittedTime[0];
            var minutes = splittedTime[1];
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        } else {
            return "";
        }
    }

    function GetCheckOutTime() {
        if (vm.sessionData) {
            var checkInTime = vm.sessionData.checkOut.split(' ')[1];
            var splittedTime = checkInTime.split(":");
            var hours = splittedTime[0];
            var minutes = splittedTime[1];
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        } else {
            return "";
        }
    }

    function GetCheckOutTimeNow() {
        var dateToday = new Date();
        var newDateFormat = [dateToday.getFullYear(),
            (dateToday.getMonth() + 1).padLeft(),
            dateToday.getDate().padLeft()].join('-') + ' ' +
            [dateToday.getHours().padLeft(),
                dateToday.getMinutes().padLeft(),
                dateToday.getSeconds().padLeft()].join(':');

        return newDateFormat;
    }

    function DoCheckOut() {
        // update session status
        SessionService.updateStatus(0).then(removeSession);

        function removeSession() {
            SessionService.removeFromLocalStorage();
            SessionService.setCurrentState(sessionState.checkedOut);
            // remove all geofence
            GeofenceService.removeAll();
        }
    }

    function updateLocation() {
        GeolocationService.getCurrentPosition()
            .then(function (position) {
                $log.info("Current position found", position);

                $state.go("checkin-location-new", {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, function (reason) {
                $log.error("Cannot obtain current location", reason);
                $ionicLoading.show({
                    template: "Cannot obtain current location",
                    duration: 1500
                });
            });
    }

    function goToCheckin() {
        SessionService.create();
        $state.go('checkin-disclaimer');
    }

    function goToSafety() {
        $state.go('safety');
    }

    function goToEmergency() {
        GeolocationService.getCurrentPosition()
            .then(function (position) {
                $log.info("Current position found", position);

                $state.go("emergency", {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, function (reason) {
                $log.error("Cannot obtain current location", reason);
                $ionicLoading.show({
                    template: "Cannot obtain current location",
                    duration: 1500
                });
            });
    }

    function goToWeather() {
        GeolocationService.getCurrentPosition()
            .then(function (position) {
                $log.info("Current position found", position);

                $state.go("weather", {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, function (reason) {
                $log.error("Cannot obtain current location", reason);
                $ionicLoading.show({
                    template: "Cannot obtain current location",
                    duration: 1500
                });
            });
    }

    function goToMap() {
        GeolocationService.getCurrentPosition()
            .then(function (position) {
                $log.info("Current position found", position);

                $state.go("map", {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, function (reason) {
                $log.error("Cannot obtain current location", reason);
                $ionicLoading.show({
                    template: "Cannot obtain current location",
                    duration: 1500
                });
            });
    }

    function goToExtendDuration() {
        $state.go("checkin-duration-extend");
    }
});