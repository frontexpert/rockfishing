rockFishing.controllers.controller('CheckinLocationTrackingController', function ($scope, $ionicHistory, $state, SessionService) {
    var vm = $scope;

    vm.backToPrevious = backToPrevious;
    vm.trackMe = trackMe;
    vm.goToEmergency = goToEmergency;

    function trackMe() {
        SessionService.updateData({
            locationTracking: true
        });
        
         $state.go('checkin-emergency');
    }

    function backToPrevious() {
        $ionicHistory.goBack();
    }

    function goToEmergency() {
        $state.go('checkin-emergency');
    }
});