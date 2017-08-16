rockFishing.controllers.controller('WeatherSearchController', function ($scope, $state, $ionicHistory, $ionicLoading, $log, WeatherService, GeolocationService) {
    var vm = $scope;

    vm.searchText = "";
    vm.locationList = [];
    vm.backToHome = backToHome;
    vm.backToMyPositionWeather = backToMyPositionWeather;
    vm.backToCustomPositionWeather = backToCustomPositionWeather;

    WeatherService.getLocationList().then(setLocation);

    function setLocation(data) {
        var index, len;
        for (index = 0, len = data.mrb.length; index < len; ++index) {
            var currentLocationMrb = data.mrb[index];
            var locationMrb = {
                name: currentLocationMrb.name,
                latitude: currentLocationMrb.lat,
                longitude: currentLocationMrb.lng
            }

            vm.locationList.push(locationMrb);
        }

        for (index = 0, len = data.poi.length; index < len; ++index) {
            var currentLocationPoi = data.poi[index];
            var locationPoi = {
                name: currentLocationPoi.name,
                latitude: currentLocationPoi.lat,
                longitude: currentLocationPoi.lng
            }

            vm.locationList.push(locationPoi);
        }
    }

    function backToHome() {
        $state.go('home');
    }

    function backToMyPositionWeather() {
        GeolocationService.getCurrentPosition()
            .then(function (position) {
                $ionicHistory.backView().stateParams = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                $ionicHistory.goBack();
            },
                function (reason) {
                    $log.error("Cannot obtain current location", reason);
                    $ionicLoading.show({
                        template: "Cannot obtain current location",
                        duration: 1500
                    });
                });
    }

    function backToCustomPositionWeather(index) {
        $ionicHistory.backView().stateParams = {
            latitude: vm.locationList[index].latitude,
            longitude: vm.locationList[index].longitude
        };

        $ionicHistory.goBack();
    }
});