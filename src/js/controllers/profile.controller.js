rockFishing.controllers.controller('ProfileController', function ($scope, $state, $ionicHistory, $cordovaDialogs, $ionicLoading, AuthenticationService, isAuthenticated) {
    var vm = $scope;

    vm.user = {
        name: "",
        mobileNumber: ""
    };

    vm.isAuthenticated = isAuthenticated;
    vm.isSignUp = false;
    vm.backToHome = backToHome;
    vm.getProfileTitle = getProfileTitle;
    vm.signUp = signUp;
    vm.editProfile = editProfile;

    if (vm.isAuthenticated == true) {
        AuthenticationService.getUserProfile().then(setMyProfile, setErrorMessage);
    }
    else{
        vm.isSignUp = true;
    }

    function setMyProfile(result) {
        if (result.status == "success") {
            vm.isAuthenticated = true;
            vm.isSignUp = false;
            vm.user.name = result.response.name;
            vm.user.mobileNumber = result.response.mobileNumber;
        } else if (result.status == "failed") {
            vm.isAuthenticated = false;
             vm.isSignUp = true;
        }
    }

    function setErrorMessage(error) {
        if (error.error) {
            $ionicLoading.show({
                template: error.error + " Please Relogin.",
                duration: 1500
            });
        } else {
            $ionicLoading.show({
                template: "Error while fetching profile",
                duration: 1500
            });
        }
        
        vm.isSignUp = true;
        vm.isAuthenticated = false;
    }

    function getProfileTitle() {
        if (vm.isSignUp == true) {
            return "Sign Up";
        } else {
            return "Profile";
        }
    }

    function signUp() {
        if (validateUser()) {
            $state.go("profile-term", {
                name: vm.user.name,
                mobileNumber: vm.user.mobileNumber
            });
        }
    }

    function editProfile() {
        if (validateUser()) {
            // call signin to get token
            AuthenticationService.editUserProfile(vm.user).then(onSuccess, onFail);

            function onSuccess(result) {
                if (result.status == "success") {
                    vm.isAuthenticated = true;
                    vm.isSignUp = false;
                }
            }

            function onFail(error) {
                if (error.status == "failed") {
                    if (error.response.errorCode == 500) {
                        $cordovaDialogs.alert(error.response.errorMessage, "Error", "OK")
                    } else if (error.response.errorCode == 6) {
                        if (error.response.message.mobileNumber && error.response.message.mobileNumber.length > 0) {
                            $cordovaDialogs.alert(error.response.message.mobileNumber[0], "Error", "OK")
                        } else if (error.response.message.name && error.response.message.name.length > 0) {
                            $cordovaDialogs.alert(error.response.message.name[0], "Error", "OK")
                        }
                    }
                }
            }
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

    function backToHome() {
        $ionicHistory.goBack();
    }
});