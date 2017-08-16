// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var rockFishing = {
    controllers: angular.module('rockFishing.controllers', []),
    services: angular.module('rockFishing.services', []),
    directives: angular.module('rockFishing.directives', [])
};

rockFishing.app = angular.module('rockFishing', ['ionic', 'ngIOS9UIWebViewPatch', 'rockFishing.controllers', 'rockFishing.services', 'rockFishing.directives', 'ngCordova', 'leaflet-directive']);

rockFishing.app.run(function ($ionicPlatform, $rootScope, $log, GeofenceMockService, $ionicLoading, $httpBackend, $state, SessionService) {
    $rootScope.VERSION = window.VERSION;
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        // Geofence setting    
        if (window.geofence === undefined) {
            $log.warn("Geofence Plugin not found. Using mock instead.");
            window.geofence = GeofenceMockService;
            window.TransitionType = GeofenceMockService.TransitionType;
        }

        window.geofence.onTransitionReceived = function (geofences) {
            $log.log(geofences);
            if (geofences) {
                $rootScope.$apply(function () {
                    geofences.forEach(function (geo) {
                        geo.notification = geo.notification || {
                            title: "Geofence transition",
                            text: "Without notification"
                        };
                        $ionicLoading.show({
                            template: geo.notification.title + ": " + geo.notification.text,
                            noBackdrop: true,
                            duration: 2000
                        });
                        SessionService.setCurrentState(5);
                    });
                });
            }
        };

        window.geofence.onNotificationClicked = function (notificationData) {
            $log.log(notificationData);

            if (notificationData) {
                $rootScope.$apply(function () {
                    $state.go("home");
                });
            }
        };

        window.geofence.initialize(function () {
            $log.log("Geofence plugin initialized");
        });
    });
})
    .constant("AliveApi", {
        "url": "https://wapi-dev.alivemobile.com.au"
    })
// .constant("PortalApi", {
//     "url": "http://ec2-52-25-198-173.us-west-2.compute.amazonaws.com/api"
// })
    .constant("PortalApi", {
        "url": "http://test-rockfisherman-api.alivemobile.net/api"
    })
    .constant("GoogleApi", {
        "url": "https://maps.googleapis.com/maps/api/geocode/json"
    });