rockFishing.services.factory('SessionService', function ($http, $q, $ionicLoading, PortalApi, AuthenticationService) {
    var urlApi = PortalApi.url;

    return {
        _sessionData: null,
        _currentState: 0,
        _duration: 0,

        create: function () {
            var self = this;
            self._sessionData = {
                sessionId: 1,
                userId: 1,
                checkIn: new Date(),
                checkOut: new Date(),
                latitude: "",
                longitude: "",
                locationTracking: false,
                emergencyContactName: "",
                emergencyContactMobileNumber: "",
                companionCount: 0,
                companionName: "",
                companionMobileNumber: ""
            }
        },

        loadFromLocalStorage: function () {
            var self = this;
            var result = localStorage["sessionData"];

            if (result) {
                try {
                    self._sessionData = angular.fromJson(result);
                } catch (ex) {

                }
            }

            return $q.when(self._sessionData);
        },

        saveToLocalStorage: function () {
            var self = this;
            localStorage["sessionData"] = angular.toJson(self._sessionData);
        },

        removeFromLocalStorage: function () {
            localStorage.removeItem("sessionData");
        },

        getData: function () {
            return this._sessionData;
        },

        updateData: function (attributes) {
            var self = this;
            angular.extend(self._sessionData, attributes);
        },

        saveTokenToLocalStorage: function (tokenId) {
            localStorage["sessionToken"] = tokenId;
        },

        getToken: function () {
            var result = localStorage["sessionToken"];
            return result;
        },

        removeToken: function () {
            // remove token from localstorage
            localStorage["sessionToken"].clear();
        },

        checkIn: function () {
            var self = this;
            var deferred = $q.defer();
            var backend_path = '/mobileSession';

            console.log("session data: " + angular.toJson(self._sessionData));

            $ionicLoading.show({
                template: "Checking In..."
            });

            //var dummyData = {"sessionId":1,"userId":1,"checkIn":"2015-12-14T07:54:08.574Z","checkOut":"2015-12-14T09:54:08.574Z","latitude":"","longitude":"","locationTracking":false,"emergencyContactName":"","emergencyContactMobileNumber":"","companionCount":1,"companionName":0,"companionMobileNumber":""};
            AuthenticationService.setToken();
            $http.post(urlApi + backend_path, angular.toJson(self._sessionData)).then(onSuccess, onFail);

            function onSuccess(data) {
                console.log("Check in success");
                $ionicLoading.hide();
                deferred.resolve(data.data);
            }

            function onFail(error) {
                $ionicLoading.show({
                    template: "Error while checking in",
                    duration: 1500
                });
                console.log("Error while checking in : " + JSON.stringify(error));
                deferred.reject(error.data);
            }

            return deferred.promise;
        },

        updateCheckIn: function () {
            var self = this;
            var deferred = $q.defer();
            var backend_path = '/updateCheckin';

            AuthenticationService.setToken();
            $http.post(urlApi + backend_path, angular.toJson(self._sessionData)).then(onSuccess, onFail);

            function onSuccess(data) {
                console.log("Check in success");
                deferred.resolve(data);
            }

            function onFail(error) {
                deferred.reject(error);
            }

            return deferred.promise;
        },

        updateCheckOut: function () {
            var self = this;
            var deferred = $q.defer();
            var backend_path = '/mobileSession/';

            var updateParam = {
                checkOut: self._sessionData.checkOut,
            }

            $ionicLoading.show({
                template: "Updating check out..."
            });

            AuthenticationService.setToken();
            $http.put(urlApi + backend_path + self._sessionData.sessionId, angular.toJson(updateParam)).then(onSuccess, onFail);

            function onSuccess(data) {
                $ionicLoading.hide();
                console.log("Update check out success");
                deferred.resolve(data.result);
            }

            function onFail(error) {
                $ionicLoading.show({
                    template: "Error while updating check out",
                    duration: 1500
                });
                console.log("Error while updating check out : " + JSON.stringify(error));
                deferred.reject(error.data);
            }

            return deferred.promise;
        },

        // Status Code:
        // 0->Checkout
        // 1->Checkin
        // 2->Emergency Call
        // 3->Checkout Failed
        updateStatus: function (status) {
            var self = this;
            var deferred = $q.defer();
            var backend_path = '/mobileSession/';

            var updateParam = {
                statusId: status.toString(),
            }

            $ionicLoading.show({
                template: "Updating status..."
            });

            AuthenticationService.setToken();
            $http.put(urlApi + backend_path + self._sessionData.sessionId, angular.toJson(updateParam)).then(onSuccess, onFail);

            function onSuccess(data) {
                $ionicLoading.hide();
                console.log("Update status success");
                deferred.resolve(data.result);
            }

            function onFail(error) {
                $ionicLoading.show({
                    template: "Error while updating status",
                    duration: 1500
                });
                console.log("Error while updating status : " + JSON.stringify(error));
                deferred.reject(error.data);
            }

            return deferred.promise;
        },

        updateLocation: function () {
            var self = this;
            var deferred = $q.defer();
            var backend_path = '/mobileSession/';

            var updateParam = {
                latitude: self._sessionData.latitude,
                longitude: self._sessionData.longitude
            }

            $ionicLoading.show({
                template: "Updating Location..."
            });

            AuthenticationService.setToken();
            $http.put(urlApi + backend_path + self._sessionData.sessionId, angular.toJson(updateParam)).then(onSuccess, onFail);

            function onSuccess(data) {
                $ionicLoading.hide();
                console.log("Update location success");
                deferred.resolve(data.result);
            }

            function onFail(error) {
                $ionicLoading.show({
                    template: "Error while updating location",
                    duration: 1500
                });
                console.log("Error while updating location : " + JSON.stringify(error));
                deferred.reject(error.data);
            }

            return deferred.promise;
        },

        getCurrentState: function () {
            var self = this;
            return self._currentState;
        },

        setCurrentState: function (state) {
            var self = this;
            self._currentState = state;
        },

        getDuration: function () {
            var self = this;
            return self._duration;
        },

        setDuration: function (duration) {
            var self = this;
            self._duration = duration;
        }
    }
});