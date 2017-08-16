rockFishing.services.factory('FishingLocationService', function ($http, $q, $ionicLoading, PortalApi) {
    var fishingLocations = null;
    var selectedLocation = null;

    return {
        getFishingLocations: function () {
            if (fishingLocations == null) {
                $ionicLoading.show({
                    template: "Fetching fishing spots..."
                });

                var deferred = $q.defer();
                var locationUrl = PortalApi.url + "/fishingSpot";

                $http.get(locationUrl).then(function (data) {
                    $ionicLoading.hide();
                    deferred.resolve(fishingLocations = data.data.response.fishingSpots)
                }, function (error) {
                    $ionicLoading.show({
                        template: "Error while fetching fishing spots",
                        duration: 1500
                    });
                    console.log("Error while fetching fishing spots : " + JSON.stringify(error));
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            return $q.when(fishingLocations);
        },
        
        getById: function(id) {
            if(fishingLocations != null && fishingLocations.length > 0) {
                var index, len;
                for (index = 0, len = fishingLocations.length; index < len; ++index) {
                    var currentLocation = fishingLocations[index];
                    if(id == currentLocation.id) {
                        selectedLocation = currentLocation;
                        break;
                    }
                }
            }
            
            return selectedLocation;
        }
    };
});