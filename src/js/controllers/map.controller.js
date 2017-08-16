rockFishing.controllers.controller('MapController', function ($scope, leafletData, $state, $ionicHistory, $ionicLoading, FishingLocationService, geofence, GeofenceService, GeocodeService) {
    var vm = $scope;

    vm.backToHome = backToHome;
    vm.searchText = {
        suburb: ""
    }
    vm.locationList = [];
    vm.updateList = updateList;
    vm.selectLocation = selectLocation;

    $scope.geofence = geofence;
    $scope.center = {
        lat: geofence.latitude,
        lng: geofence.longitude,
        zoom: 11
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
    // $scope.paths = {
    //     circle: {
    //         type: "circle",
    //         weight: 1,
    //         radius: 3000,
    //         latlngs: { lat: $scope.center.lat, lng: $scope.center.lng },
    //         clickable: false
    //     }
    // };
    $scope.paths = {};
    $scope.events = {};
    $scope.defaults = {
        zoomControl: false
    }

    FishingLocationService.getFishingLocations().then(setFishingLocations);

    function setFishingLocations(result) {
        console.log("fishing spot: " + JSON.stringify(result));
        var index, len;
        for (index = 0, len = result.length; index < len; ++index) {
            var currentLocation = result[index];
            var markerName = "marker" + currentLocation.id;
            $scope.markers[markerName] = {
                draggable: false,
                lat: parseFloat(currentLocation.latitude),
                lng: parseFloat(currentLocation.longitude),
                icon: {
                    iconUrl: 'img/fish-icon.svg'
                }
            }
        }
    }

    // keep this so it works on mouse-having devices
    $scope.$on('leafletDirectiveMarker.click', function (event, args) {
        //t.leafletEvent.latlng.lat
        goToDetails(args.markerName);
    });

    //notice touchend (basically a tap/click on a touch device)
    $scope.$on('leafletDirectiveMarker.touchend', function (event, args) {
        goToDetails(args.markerName);
    });

    $scope.$on('leafletDirectiveMap.move', function (event, args) {
        // Get the Leaflet map from the triggered event.
        var map = args.leafletEvent.target;
        var center = (map.getCenter());

        // Update the center.
        $scope.center.lat = center.lat;
        $scope.center.lng = center.lng;


        // $scope.paths = {
        //     circle: {
        //         type: "circle",
        //         weight: 1,
        //         radius: 3000,
        //         latlngs: { lat: center.lat, lng: center.lng },
        //         clickable: false
        //     }
        // };
        
        // You custom function that will set the Marker's center according to
        // the $scope.center
        // updateMarker();
    });

    function goToDetails(markerName) {
        // get Id from marker name
        var id = markerName.split('marker')[1];

        if (id != '') {
            $state.go("map-details", {
                id: id
            });
        }
    }

    function backToHome() {
        $ionicHistory.goBack();
    }

    function updateList() {
        vm.locationList = [];

        GeocodeService.getLocations(vm.searchText.suburb).then(setLocations);

        function setLocations(results) {
            var index, len;
            for (index = 0, len = results.length; index < len; ++index) {
                var currentResult = results[index];
                if (currentResult.formatted_address != "Australia") {
                    vm.locationList.push(currentResult);
                }
            }
        }
    }

    function selectLocation(location) {
        // zoom 13 equal to radius 3km
        console.log("selecting location lat: " + location.geometry.location.lat);
        console.log("selecting location lat: " + location.geometry.location.lng);
        vm.locationList = [];
        // $scope.center = {
        //     lat: location.geometry.location.lat,
        //     lng: location.geometry.location.lng,
        //     zoom: 13
        // };
        
        leafletData.getMap("fishingMap").then(function (map) {
            map.setView([location.geometry.location.lat, location.geometry.location.lng], 13, { animate: true });
        });
    }
});