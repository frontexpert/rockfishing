// rockFishing.controllers.controller('CheckinLocationController', function ($scope, $ionicHistory, $state, $compile, $cordovaGeolocation, $ionicLoading) {
rockFishing.controllers.controller('CheckinLocationController', function ($scope, $ionicHistory, $state, $ionicLoading, $cordovaDialogs, geofence, GeofenceService, SessionService, leafletData) {
    var vm = $scope;
    var southWest = {
        lat: -34.190953,
        lng: 151.041288
    }
    var northEast = {
        lat: -33.888989,
        lng: 151.289672
    }

    $scope.geofence = geofence;
    $scope.TransitionType = TransitionType;

    $scope.center = {
        lat: geofence.latitude,
        lng: geofence.longitude,
        zoom: 10
    };
    $scope.markers = {
        marker: {
            draggable: false,
            message: "latitude:" + geofence.lat + "<br/>longitude:" + geofence.lng,
            lat: geofence.latitude,
            lng: geofence.longitude,
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

    $scope.events = {};
    $scope.defaults = {
        zoomControl: false
    }

    // leafletData.getMap("checkinMap").then(function (map) {
    //     map.setView([$scope.markers.marker.lat, $scope.markers.marker.lng], 16, { animate: true });
    // });

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
    vm.goToLocationTracking = goToLocationTracking;

    function backToPrevious() {
        $ionicHistory.goBack();
    }

    function goToLocationTracking() {
        $scope.geofence.transitionType = TransitionType.EXIT;
        $scope.geofence.radius = parseInt($scope.paths.circle.radius);
        $scope.geofence.latitude = $scope.markers.marker.lat;
        $scope.geofence.longitude = $scope.markers.marker.lng;
        $scope.geofence.notification.data = angular.copy($scope.geofence);

        GeofenceService.saveGeofenceCacheToLocalStorage($scope.geofence);

        if (($scope.markers.marker.lat <= northEast.lat && $scope.markers.marker.lat >= southWest.lat) &&
            ($scope.markers.marker.lng >= southWest.lng && $scope.markers.marker.lng <= northEast.lng)) {

            SessionService.updateData({
                latitude: $scope.markers.marker.lat,
                longitude: $scope.markers.marker.lng
            });

            $state.go('checkin-locationtracking');
        } else {
            $cordovaDialogs.alert("You are outside of our monitoring area. Please select another fishing spot.", "Location Not Available", "Ok");
        }
    }
});