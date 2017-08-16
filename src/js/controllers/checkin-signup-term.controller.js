rockFishing.controllers.controller('CheckinSignupTermController', function ($scope, $state, $ionicHistory, $cordovaDialogs, $ionicLoading, AuthenticationService, SessionService, user) {
    var vm = $scope;

    vm.user = user;
    vm.signUp = signUp;
    vm.backToPrevious = backToPrevious;

    function signUp() {
        console.log("vm.user:" + JSON.stringify(vm.user));
        AuthenticationService.signIn(vm.user).then(onSuccess, onFail);

        function onSuccess(result) {
            if (result.data.status == "success") {
                console.log("new user id:" + result.data.response.userId);
                // save user id to session
                SessionService.updateData({
                    userId: result.data.response.userId
                });
                
                // go to checkin duration
                $state.go('checkin-duration');
            }
        }

        function onFail(error) {
            if (error.data.status == "failed") {
                if (error.data.response.errorCode == 500) {
                    $cordovaDialogs.alert(error.data.response.errorMessage, "Error", "OK")
                } else if (error.data.response.errorCode == 6) {
                    if (error.data.response.message.mobileNumber && error.data.response.message.mobileNumber.length > 0) {
                        $cordovaDialogs.alert(error.data.response.message.mobileNumber[0], "Error", "OK")
                    } else if (error.data.response.message.name && error.data.response.message.name.length > 0) {
                        $cordovaDialogs.alert(error.data.response.message.name[0], "Error", "OK")
                    }
                }
            }
        }
    }

    function backToPrevious() {
        $ionicHistory.goBack();
    }

});