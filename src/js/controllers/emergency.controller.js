rockFishing.controllers.controller('EmergencyController', function ($scope, $ionicHistory, $cordovaDialogs, SessionService, currentPosition) {
    var vm = $scope;

    vm.sessionData = null;

    vm.currentPosition = currentPosition;
    vm.decimalToDMS = decimalToDMS;
    vm.backToHome = backToHome;
    vm.callEmergency = callEmergency;

    SessionService.loadFromLocalStorage().then(function (data) {
        if (data) {
            vm.sessionData = data;
        }
    });

    function decimalToDMS(decimal, isLatitude) {
        var degree = Math.floor(decimal);
        var minfloat = (decimal - degree) * 60;
        var minute = Math.floor(minfloat);
        var secfloat = (minfloat - minute) * 60;
        var second = Math.floor(secfloat);
        var direction = "";
        if (isLatitude == true) {
            if (decimal >= 0) {
                direction = "N";
            } else {
                direction = "S";
            }
        } else {
            if (decimal >= 0) {
                direction = "E";
            } else {
                direction = "W";
            }
        }

        return degree + "&deg; " + minute + "." + second + " " + direction;
    }

    function callEmergency() {
        $cordovaDialogs.confirm('', 'Emergency Call 000', ['Cancel', 'Dial'])
            .then(function (buttonIndex) {
                // no button = 0, 'Cancel' = 1, 'Dial' = 2
                if (buttonIndex == 2) {
                    if (vm.sessionData != null) {
                        SessionService.updateStatus(2);
                    }

                    window.open('tel:000');
                }
            });
    }

    function backToHome() {
        $ionicHistory.goBack();
    }
});