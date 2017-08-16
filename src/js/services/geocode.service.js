rockFishing.services.factory('GeocodeService', function ($http, $q, $ionicLoading, GoogleApi) {

    return {
        getLocations: function (address) {
            var deferred = $q.defer();
            $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    components: "country:AU",
                    sensor: false

                }
            }).then(onSuccess, onFail);

            function onSuccess(data) {
                deferred.resolve(data.data.results);
            }

            function onFail(error) {
                deferred.reject(error.data);
            }

            return deferred.promise;
        }
    }
});