rockFishing.controllers.controller('CheckinDurationController', function ($scope, $ionicHistory, $state, $log, $ionicLoading, GeolocationService, SessionService) {
    var vm = $scope;

    vm.duration = 2;
    vm.backToPrevious = backToPrevious;
    vm.goToLocation = goToLocation;
    vm.addDuration = addDuration;
    vm.reduceDuration = reduceDuration;
    vm.getDuration = getDuration;
    vm.getCheckOutTime = getCheckOutTime;

    Number.prototype.padLeft = function (base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1;
        return len > 0 ? new Array(len).join(chr || '0') + this : this;
    }

    function addDuration() {
        if (vm.duration < 12) {
            vm.duration = vm.duration + 1;
        }
    }

    function reduceDuration() {
        if (vm.duration > 1) {
            vm.duration = vm.duration - 1;
        }
    }

    function getDuration() {
        return vm.duration;
    }

    function getCheckOutTime() {
        var dateToday = new Date();
        var checkOutDate = new Date(dateToday.setHours(dateToday.getHours() + vm.duration));
        var hours = checkOutDate.getHours();
        var minutes = checkOutDate.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
        //return new Date(dateToday.setHours(dateToday.getHours() + vm.duration)).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
    }

    function getCheckInUtc() {
        var dateToday = new Date();
        var newDateFormat = [dateToday.getFullYear(),
            (dateToday.getMonth() + 1).padLeft(),
            dateToday.getDate().padLeft()].join('-') + ' ' +
            [dateToday.getHours().padLeft(),
                dateToday.getMinutes().padLeft(),
                dateToday.getSeconds().padLeft()].join(':');

        console.log("check-in date: " + newDateFormat);
        return newDateFormat;
    }

    function getCheckOutUtc() {
        var dateToday = new Date();
        var checkOutDate = new Date(dateToday.setHours(dateToday.getHours() + vm.duration));
        var newDateFormat = [checkOutDate.getFullYear(),
            (checkOutDate.getMonth() + 1).padLeft(),
            checkOutDate.getDate().padLeft()].join('-') + ' ' +
            [checkOutDate.getHours().padLeft(),
                checkOutDate.getMinutes().padLeft(),
                checkOutDate.getSeconds().padLeft()].join(':');

        console.log("check-out date: " + newDateFormat);
        return newDateFormat;
    }

    function backToPrevious() {
        $ionicHistory.goBack();
    }

    function goToLocation() {
        SessionService.updateData({
            checkIn: getCheckInUtc(),
            checkOut: getCheckOutUtc()
        });

        SessionService.setDuration(vm.duration);

        GeolocationService.getCurrentPosition()
            .then(function (position) {
                $log.info("Current position found", position);

                $state.go("checkin-location", {
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
});