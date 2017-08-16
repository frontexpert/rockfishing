rockFishing.controllers.controller('CheckinDurationExtendController', function ($scope, $ionicHistory, $state, $log, $ionicLoading, $cordovaDialogs, SessionService, TimerService) {
    var vm = $scope;

    vm.duration = 0;
    vm.sessionData = null;

    vm.backToPrevious = backToPrevious;
    vm.update = update;
    vm.addDuration = addDuration;
    vm.reduceDuration = reduceDuration;
    vm.getDuration = getDuration;
    vm.getCheckOutTime = getCheckOutTime;

    SessionService.loadFromLocalStorage().then(function (data) {
        if (data) {
            vm.sessionData = data;
        }
    });

    function addDuration() {
        if (vm.duration < 12) {
            vm.duration = vm.duration + 1;
        }
    }

    function reduceDuration() {
        if (vm.duration > 0) {
            vm.duration = vm.duration - 1;
        }
    }

    function getDuration() {
        return vm.duration;
    }

    function getCheckOutTime() {
        var checkOutSplit = vm.sessionData.checkOut.split(' ');
        var splitDate = checkOutSplit[0].split("-");
        var splitTime = checkOutSplit[1].split(":");

        var currentCheckOutDate = new Date(splitDate[0], splitDate[1], splitDate[2], splitTime[0], splitTime[1], splitTime[2]);
        var checkOutDate = new Date(currentCheckOutDate.setHours(currentCheckOutDate.getHours() + vm.duration));
        var hours = checkOutDate.getHours();
        var minutes = checkOutDate.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    function getCheckOutUtc() {
        var checkOutSplit = vm.sessionData.checkOut.split(' ');
        var splitDate = checkOutSplit[0].split("-");
        var splitTime = checkOutSplit[1].split(":");

        var currentCheckOutDate = new Date(splitDate[0], splitDate[1], splitDate[2], splitTime[0], splitTime[1], splitTime[2]);
        var checkOutDate = new Date(currentCheckOutDate.setHours(currentCheckOutDate.getHours() + vm.duration));
        var newDateFormat = [checkOutDate.getFullYear(),
            (checkOutDate.getMonth() + 1).padLeft(),
            checkOutDate.getDate().padLeft()].join('-') + ' ' +
            [checkOutDate.getHours().padLeft(),
                checkOutDate.getMinutes().padLeft(),
                checkOutDate.getSeconds().padLeft()].join(':');

        console.log("check-out date: " + newDateFormat);
        return newDateFormat;
    }

    function update() {
        if (validateDuration() == true) {
            SessionService.updateData({
                checkOut: getCheckOutUtc()
            });
        
            // update current state to check in
            SessionService.setCurrentState(1);
        
            // update session checkout
            SessionService.updateCheckOut().then(goToHome);

            function goToHome() {
                SessionService.saveToLocalStorage();
                // Extend timer duration
                TimerService.extendDuration(vm.duration);
                $state.go("home");
            }
        }
    }

    function backToPrevious() {
        $ionicHistory.goBack();
    }

    function validateDuration() {
        var isValid = true;
        if (vm.duration < 1) {
            $cordovaDialogs.alert("Minimum duration is 1.", "Warning", "Ok");
            isValid = false;
        }
        return isValid;
    }

});