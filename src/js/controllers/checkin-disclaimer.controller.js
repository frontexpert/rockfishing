rockFishing.controllers.controller('CheckinDisclaimerController', function ($scope, $ionicHistory, $state, AuthenticationService, SessionService) {
    var vm = $scope;

    vm.backToPrevious = backToPrevious;
    vm.goToProfile = goToProfile;

    function backToPrevious() {
        $ionicHistory.goBack();
    }

    function goToProfile() {
        // check if he is authenticated
        //      if authenticated, try getting user profile to make sure token works
        //          if token works, skip sign up, save user id to session,  and go to checkin duration
        //          if token not works, go to sign up
        //      if not authenticated, go to sign up
        var isAuth = AuthenticationService.isAuthenticated();
        if (isAuth == true) {
            AuthenticationService.getUserProfile(false).then(setNextStep, goToSignUp);
        }
        else {
            $state.go('checkin-signup');
        }

        function setNextStep(result) {
            if (result.status && result.status == "success") {
                SessionService.updateData({
                    userId: result.response.userId
                });

                $state.go("checkin-duration");
            } else {
                $state.go("checkin-signup");
            }
        }

        function goToSignUp(error) {
            $state.go("checkin-signup");
        }
    }
});