rockFishing.services.factory('WeatherService', function ($http, $q, $ionicLoading, AliveApi) {
    var currentRegion = null;
    var locationList = null;

    return {
        getWeather: function (latitude, longitude, loading) {

            var showLoading = true;
            if (loading != undefined) {
                showLoading = loading;
            }

            if (showLoading == true) {
                $ionicLoading.show({
                    template: "Fetching weather data..."
                });
            }

            var deferred = $q.defer();
            console.log("lat:" + latitude);
            console.log("lng:" + longitude);
            var param = {
                "call": "weather",
                "parameters": {
                    "latitude": latitude,
                    "longitude": longitude,
                    "latitude_delta": 0.001,
                    "longitude_delta": 0.001,
                    "boundary_limit": 1
                }
            }

            $http.post(AliveApi.url + "/boatwiseapi", param).then(onSuccess, onFail);

            function onSuccess(data) {
                if (showLoading == true) {
                    $ionicLoading.hide();
                }
                deferred.resolve(data);
            }

            function onFail(error) {
                if (showLoading == true) {
                    $ionicLoading.hide();
                }
                
                console.log("Error while fetching weather data : " + error);
                deferred.reject(error);
            }

            return deferred.promise;
        },

        getCurrentRegion: function () {
            return currentRegion;
        },

        setCurrentRegion: function (region) {
            currentRegion = region;
        },

        getLocationList: function () {
            if (locationList == null) {
                $ionicLoading.show({
                    template: "Fetching locations..."
                });

                var deferred = $q.defer();
                var locationUrl = AliveApi.url + "/locations?distance=50&lat=-33.8650&long=151.2094";

                $http.get(locationUrl).then(function (data) {
                    $ionicLoading.hide();
                    deferred.resolve(locationList = data.data.locations)
                }, function (error) {
                    $ionicLoading.show({
                        template: "Error while fetching locations",
                        duration: 1500
                    });
                    console.log("Error while fetching locations : " + error);
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            return $q.when(locationList);
        }
    };
});