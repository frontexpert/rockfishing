rockFishing.controllers.controller('WeatherAlertsController', function ($scope, $state, $ionicHistory, $log, $ionicLoading, WeatherService, GeolocationService) {
    var vm = $scope;

    vm.currentAlerts = [];
    vm.weatherService = WeatherService;
    vm.backToHome = backToHome;

    getCurrentRegion();

    function getCurrentRegion() {
        var currentRegion = vm.weatherService.getCurrentRegion();
        console.log("currentRegion: " + JSON.stringify(currentRegion));
        if (currentRegion != null) {
            if (currentRegion.weather_alerts.length > 0) {
                var index, len;
                for (index = 0, len = currentRegion.weather_alerts.length; index < len; ++index) {
                    var region = currentRegion.weather_alerts[index];
                    vm.currentAlerts.push({
                        title: getTitle(region),
                        areas: getAreas(region),
                        startTime: getTime(region)
                    });
                }
            }
        }
    }

    function getTitle(region) {
        if (region.warning_areas != "") {
            return region.warning_title + " for the following areas:";
        } else {
            return region.warning_title.split(" for")[0] + " for the following areas:";
        }
    }

    function getAreas(region) {
        if (region.warning_areas != "") {
            return region.warning_areas;
        } else {
            return region.warning_title.split("for")[region.warning_title.split("for").length - 1];
        }
    }

    function getTime(region) {
        var timeSplit = region.time_start.split(" ")[1];
        var hours = timeSplit.split("-")[0];
        return parseInt(hours, 10);
    }

    function backToHome() {
        $state.go('home');
    }
});