rockFishing.services.factory('AuthenticationService', function ($http, $q, $ionicLoading, PortalApi) {
    var urlApi = PortalApi.url;
    //var userAuthenticated = false;
    //var currentUserId = null;

    return {
        signIn: function (user) {
            var deferred = $q.defer();
            var dataConvertToJson = JSON.stringify(user);

            $http.post(urlApi + '/signup', dataConvertToJson).then(onSuccess, onFail);

            function onSuccess(data) {
                console.log("success signing in");
                console.log("saving user id to local storage: " + data.data.response.userId);
                window.localStorage.setItem('AUTH_USER', data.data.response.userId);
                window.localStorage.setItem('IS_AUTHENTICATED', 'true');
                window.localStorage.setItem('AUTH_TOKEN', "Bearer" + data.data.response.token);
                //currentUserId = data.data.response.userId;
                //userAuthenticated = true;
                $http.defaults.headers.common['Authorization'] = "Bearer" + data.data.response.token;
                deferred.resolve(data);
            }

            function onFail(error) {
                console.log("failed signing in");
                deferred.reject(error);
            }

            return deferred.promise;
        },

        getUser: function () {
            return window.localStorage.getItem('AUTH_USER');
        },

        getUserProfile: function (loading) {
            var self = this;
            var userId = self.getUser();
            var showLoading = true;
            if (loading != undefined) {
                showLoading = loading;
            }

            if (userId) {
                if (showLoading == true) {
                    $ionicLoading.show({
                        template: "Fetching profile..."
                    });
                }

                var deferred = $q.defer();
                var profileUrl = PortalApi.url + "/mobileUser/" + userId;

                self.setToken();
                $http.get(profileUrl).then(function (data) {
                    if (showLoading == true) {
                        $ionicLoading.hide();
                    }
                    
                    deferred.resolve(data.data);
                }, function (error) {
                    if (showLoading == true) {
                        $ionicLoading.hide();
                    }
                    
                    console.log("Error while fetching profile : " + JSON.stringify(error));
                    
                    deferred.reject(error.data);
                });

                return deferred.promise;
            }
        },

        editUserProfile: function (user) {
            var self = this;
            var userId = self.getUser();

            if (userId) {
                $ionicLoading.show({
                    template: "Editing profile..."
                });

                var deferred = $q.defer();
                var profileUrl = PortalApi.url + "/mobileUser/" + userId;

                self.setToken();
                $http.put(profileUrl, angular.toJson(user)).then(function (data) {
                    $ionicLoading.hide();
                    deferred.resolve(data.data);
                }, function (error) {
                    $ionicLoading.show({
                        template: "Error while fetching profile",
                        duration: 1500
                    });
                    console.log("Error while fetching profile : " + JSON.stringify(error));
                    deferred.reject(error.data);
                });

                return deferred.promise;
            }
        },

        isAuthenticated: function () {
            //console.log("masuk isAuthenticated:" + userAuthenticated);
            //return userAuthenticated;
            var self = this;
            return window.localStorage.getItem('IS_AUTHENTICATED') === 'true' && self.getToken() != null ? true : false;
        },

        getToken: function () {
            return window.localStorage.getItem('AUTH_TOKEN');
        },

        setToken: function () {
            var self = this;
            var token = self.getToken();
            //console.log("token set: " + token);
            if (token != undefined && token != null) {
                $http.defaults.headers.common['Authorization'] = token;
            }
        }
    };
});