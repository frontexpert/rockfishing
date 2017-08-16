rockFishing.controllers.controller('CheckinLocationNewController', function ($scope, $ionicHistory, $state, $log, $ionicLoading, $cordovaDialogs, SessionService, TimerService, GeofenceService, currentPosition) {
    var vm = $scope;

    var southWest = {
        lat: -34.190953,
        lng: 151.041288
    }
    var northEast = {
        lat: -33.888989,
        lng: 151.289672
    }

    $scope.geofence = null;

    GeofenceService.getAll().then(setGeofence);

    function setGeofence(result) {
        console.log("Geofence retrieved: " + JSON.stringify(result));
        $scope.geofence = result[0];
    }

    $scope.TransitionType = TransitionType;

    $scope.center = {
        lat: currentPosition.latitude,
        lng: currentPosition.longitude,
        zoom: 10
    };
    $scope.markers = {
        marker: {
            draggable: false,
            message: "latitude:" + geofence.lat + "<br/>longitude:" + geofence.lng,
            lat: currentPosition.latitude,
            lng: currentPosition.longitude,
            icon: {
                iconUrl: 'img/Rockfishin_Pin.svg'
            }
        }
    };
    $scope.layers = {
        baselayers: {
            googleRoadmap: {
                name: 'Google Streets',
                layerType: 'ROADMAP',
                type: 'google'
            }
        }
    };
    $scope.paths = {
        circle: {
            type: "circle",
            weight: 1,
            radius: 100,
            latlngs: $scope.markers.marker,
            clickable: false
        },
        checkInArea: {
            type: "rectangle",
            weight: 1,
            latlngs: [northEast, southWest],
            draggable: true,
            color: "#000",
            fill: false
        }
    };

    $scope.$on('leafletDirectiveMap.move', function (event, args) {
        // Get the Leaflet map from the triggered event.
        var map = args.leafletEvent.target;
        var center = map.getCenter();

        // Update the marker.
        $scope.markers = {
            marker: {
                draggable: false,
                message: "latitude:" + center.lat + "<br/>longitude:" + center.lng,
                lat: center.lat,
                lng: center.lng,
                icon: {
                    iconUrl: 'img/Rockfishin_Pin.svg'
                }
            }
        };
        
        // Update radius        
        $scope.paths = {
            circle: {
                type: "circle",
                weight: 1,
                radius: 100,
                latlngs: $scope.markers.marker,
                clickable: false
            },
            checkInArea: {
                type: "rectangle",
                weight: 1,
                latlngs: [northEast, southWest],
                draggable: true,
                color: "#000",
                fill: false
            }
        };

    });

    vm.backToPrevious = backToPrevious;
    vm.updateLocation = updateLocation;

    function backToPrevious() {
        $ionicHistory.goBack();
    }

    function updateLocation() {
        $scope.geofence.transitionType = TransitionType.EXIT;
        $scope.geofence.radius = parseInt($scope.paths.circle.radius);
        $scope.geofence.latitude = $scope.markers.marker.lat;
        $scope.geofence.longitude = $scope.markers.marker.lng;
        $scope.geofence.notification.data = angular.copy($scope.geofence);

        GeofenceService.addOrUpdate($scope.geofence);

        if (($scope.markers.marker.lat <= northEast.lat && $scope.markers.marker.lat >= southWest.lat) &&
            ($scope.markers.marker.lng >= southWest.lng && $scope.markers.marker.lng <= northEast.lng)) {

            SessionService.updateData({
                latitude: $scope.markers.marker.lat,
                longitude: $scope.markers.marker.lng
            });

            SessionService.updateLocation();
            // update current state to check in
            SessionService.setCurrentState(1);
            $state.go('home');
        } else {
            $cordovaDialogs.alert("You are outside of our monitoring area. Please select another fishing spot.", "Location Not Available", "Ok");
        }
    }
});