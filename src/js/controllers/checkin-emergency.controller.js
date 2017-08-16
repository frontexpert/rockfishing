rockFishing.controllers.controller('CheckinEmergencyController', function ($scope, $cordovaDialogs, $ionicHistory, $state, ContactsService, SessionService) {
    var vm = $scope;

    vm.emergencyContact = {
        name: "",
        mobileNumber: ""
    };
    vm.backToPrevious = backToPrevious;
    vm.skipEmergencyContact = skipEmergencyContact;
    vm.setEmergencyContact = setEmergencyContact;

    vm.pickContact = function () {
        ContactsService.pickContact().then(
            function (contact) {
                vm.emergencyContact.name = contact.displayName;

                if (contact.phones[0] != undefined) {
                    vm.emergencyContact.mobileNumber = getOnlyNumber(contact.phones[0].value);
                }
            },
            function (failure) {
                console.log("failed getting a contact" + failure);
            }
            );
    }

    function skipEmergencyContact() {
        $cordovaDialogs.confirm('You should always inform someone you are not fishing with of your location', 'Are you sure?', ['No Contact', 'Add Contact'])
            .then(function (buttonIndex) {
                // no button = 0, 'No Contact' = 1, 'Add Contact' = 2
                if (buttonIndex == 1) {
                    $state.go('checkin-companion');
                }
            });
    }

    function setEmergencyContact() {
        if (validateUser()) {
            SessionService.updateData({
                emergencyContactName: vm.emergencyContact.name,
                emergencyContactMobileNumber: vm.emergencyContact.mobileNumber
            });

            $state.go('checkin-companion');
        }
    }

    function validateUser() {
        if (isNullOrWhiteSpace(vm.emergencyContact.name) || isNullOrWhiteSpace(vm.emergencyContact.mobileNumber)) {
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

    function backToPrevious() {
        $ionicHistory.goBack();
    }
});