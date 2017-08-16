rockFishing.controllers.controller('CheckinSignupController', function ($scope, $ionicHistory, $state, $cordovaDialogs, SessionService, AuthenticationService) {
    var vm = $scope;

    vm.authenticationService = AuthenticationService;
    vm.backToPrevious = backToPrevious;
    vm.goToDuration = goToDuration;
    vm.user = {
        name: "",
        mobileNumber: ""
    };

    //     getUser();
    // 
    //     function getUser() {
    //         var result = vm.authenticationService.getUser();
    //         if (result) {
    //             vm.user.name = result.name;
    //             vm.user.mobileNumber = result.mobileNumber;
    //         }
    //     }

    function backToPrevious() {
        $ionicHistory.goBack();
    }

    function goToDuration() {
        if (validateUser()) {
            $state.go("checkin-signup-term", {
                name: vm.user.name,
                mobileNumber: vm.user.mobileNumber
            });
        }
    }

    function validateUser() {
        if (isNullOrWhiteSpace(vm.user.name) || isNullOrWhiteSpace(vm.user.mobileNumber)) {
            $cordovaDialogs.alert("Name and Mobile Number field is required", "Warning", "OK")
            return false;
        } else {
            if (!isNumber(vm.user.mobileNumber)) {
                $cordovaDialogs.alert("Mobile Number should only contain a number", "Warning", "OK")
                return false
            }
            
            return true;
        }
    }

    function isNullOrWhiteSpace(str) {
        return (!str || str.length === 0 || /^\s*$/.test(str))
    }
    
    function isNumber(str) {
        var pattern = /^\d+$/;
        return pattern.test(str);
    }
});