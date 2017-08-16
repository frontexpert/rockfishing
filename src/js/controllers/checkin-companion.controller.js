rockFishing.controllers.controller('CheckinCompanionController', function ($scope, $ionicHistory, $state, SessionService, TimerService) {
    var vm = $scope;

    vm.companion = 2;
    vm.backToPrevious = backToPrevious;
    vm.goToCompanionDetails = goToCompanionDetails;
    vm.addCompanion = addCompanion;
    vm.reduceCompanion = reduceCompanion;
    vm.getCompanion = getCompanion;

    function addCompanion() {
        if (vm.companion < 9) {
            vm.companion = vm.companion + 1;
        }
    }

    function reduceCompanion() {
        if (vm.companion > 0) {
            vm.companion = vm.companion - 1;
        }
    }

    function getCompanion() {
        return vm.companion;
    }

    function backToPrevious() {
        $ionicHistory.goBack();
    }

    function goToCompanionDetails() {
        if (vm.companion > 0) {
            SessionService.updateData({
                companionCount: vm.companion
            });

            $state.go('checkin-companiondetails');
        } else {
            SessionService.checkIn().then(setLocalStorage);
        }

        function setLocalStorage(result) {
            if (result.status && result.status == "success") {
                SessionService.updateData({
                    sessionId: result.response.sessionId
                });

                SessionService.saveToLocalStorage();
                SessionService.setCurrentState(1);
                
                TimerService.startTimer();
                
                $state.go("home");
            } else {
                console.log("failed Check in :" + JSON.stringify(result));
            }
        }
    }
});