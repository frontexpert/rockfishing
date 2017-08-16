rockFishing.controllers.controller('ProfileTermController', function ($scope, $state, $ionicHistory, $cordovaDialogs, $ionicLoading, AuthenticationService, user) {
    var vm = $scope;

    vm.user = user;
    vm.signUp = signUp;
    vm.backToPrevious = backToPrevious;

    function signUp() {
        console.log("vm.user:" + JSON.stringify(vm.user));
        AuthenticationService.signIn(vm.user).then(onSuccess, onFail);

        function onSuccess(result) {
            if (result.data.status == "success") {
                $state.go("profile");
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

    function backToPrevious(){
        $ionicHistory.goBack();
    }

});