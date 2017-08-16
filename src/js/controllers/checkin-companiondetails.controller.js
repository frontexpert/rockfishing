rockFishing.controllers.controller('CheckinCompanionDetailsController', function ($scope, $ionicHistory, $cordovaDialogs, $state, ContactsService, SessionService, ClockService, TimerService) {
    var vm = $scope;

    vm.backToPrevious = backToPrevious;
    vm.doCheckIn = DoCheckIn;
    vm.skipCompanion = skipCompanion;

    vm.companion = {
        name: "",
        mobileNumber: ""
    };

    vm.pickContact = function () {
        ContactsService.pickContact().then(
            function (contact) {
                //vm.selectedContact = contact;
                vm.companion.name = contact.displayName;
                if (contact.phones[0] != undefined) {
                    vm.companion.mobileNumber = getOnlyNumber(contact.phones[0].value);
                }
            },
            function (failure) {
                console.log("failed getting a contact.." + failure);
            }
            );
    }

    function backToPrevious() {
        $ionicHistory.goBack();
    }

    function DoCheckIn() {
        // SessionService.checkIn().then(SetLocalStorage);
        // 
        // function SetLocalStorage(){
        // 	SessionService.saveToLocalStorage();
        // 	ClockService.clock(function(){
        // 		alert("10 seconds has passed");
        // 	});
        // 	$state.go("home");
        // }
        //SessionService.saveToLocalStorage();
        // ClockService.clock(function () {
        // 	alert("10 seconds has passed");
        // });
        
        if (validateUser()) {
            SessionService.updateData({
                companionName: vm.companion.name,
                companionMobileNumber: vm.companion.mobileNumber
            });

            SessionService.checkIn().then(setLocalStorage);
        }
    }

    function skipCompanion() {
        // resetting companion count to 0
        SessionService.updateData({
            companionCount: 0
        });

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

    function validateUser() {
        if (isNullOrWhiteSpace(vm.companion.name) || isNullOrWhiteSpace(vm.companion.mobileNumber)) {
            $cordovaDialogs.alert("Name and Mobile Number field is required", "Warning", "OK")
            return false;
        } else {
            return true;
        }
    }

    function isNullOrWhiteSpace(str) {
        return (!str || str.length === 0 || /^\s*$/.test(str))
    }

    function getOnlyNumber(str) {
        var result = str.match(/\d/g);
        result = result.join("");
        return result;
    }
});