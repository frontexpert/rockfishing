rockFishing.app.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('home', {
            url: "/home",
            cache: false,
            templateUrl: "templates/home.html",
            controller: 'HomeController'
        })

        .state('weather', {
            url: "/weather/:longitude,:latitude",
            cache: false,
            templateUrl: "templates/weather.html",
            controller: 'WeatherController',
            resolve: {
                currentPosition: function ($stateParams) {
                    return {
                        longitude: parseFloat($stateParams.longitude),
                        latitude: parseFloat($stateParams.latitude)
                    };
                }
            }
        })
        .state('weather-alerts', {
            url: "/weather/alerts",
            templateUrl: "templates/weather-alerts.html",
            controller: 'WeatherAlertsController'
        })
        .state('weather-search', {
            url: "/weather/search",
            templateUrl: "templates/weather-search.html",
            controller: 'WeatherSearchController'
        })

        .state('map', {
            url: "/map/:longitude,:latitude",
            cache: false,
            templateUrl: "templates/map.html",
            controller: 'MapController',
            resolve: {
                geofence: function ($stateParams, GeofenceService) {
                    return GeofenceService.create({
                        longitude: parseFloat($stateParams.longitude),
                        latitude: parseFloat($stateParams.latitude)
                    });
                }
            }
        })
        .state('map-details', {
            url: "/map/details/:id",
            templateUrl: "templates/map-details.html",
            controller: 'MapDetailsController',
            resolve: {
                fishingSpot: function ($stateParams, FishingLocationService) {
                    return FishingLocationService.getById($stateParams.id);
                }
            }
        })

        .state('about', {
            url: "/about",
            templateUrl: "templates/about.html",
            controller: 'AboutController'
        })

        .state('profile', {
            url: "/profile",
            cache: false,
            templateUrl: "templates/profile.html",
            controller: 'ProfileController',
            resolve: {
                isAuthenticated: function (AuthenticationService) {
                    return AuthenticationService.isAuthenticated();
                }
            }
        })
        .state('profile-term', {
            url: "/profile/term/:name/:mobileNumber",
            cache: false,
            templateUrl: "templates/profile-term.html",
            controller: 'ProfileTermController',
            resolve: {
                user: function ($stateParams) {
                    return {
                        name: $stateParams.name,
                        mobileNumber: $stateParams.mobileNumber
                    };
                }
            }
        })

        .state('checkin-disclaimer', {
            url: "/checkin/disclaimer",
            controller: 'CheckinDisclaimerController',
            templateUrl: "templates/checkin-disclaimer.html"
        })
        .state('checkin-signup', {
            url: "/checkin/signup",
            controller: 'CheckinSignupController',
            templateUrl: "templates/checkin-signup.html"
        })
        .state('checkin-signup-term', {
            url: "/checkin/signup/term/:name/:mobileNumber",
            cache: false,
            templateUrl: "templates/checkin-signup-term.html",
            controller: 'CheckinSignupTermController',
            resolve: {
                user: function ($stateParams) {
                    return {
                        name: $stateParams.name,
                        mobileNumber: $stateParams.mobileNumber
                    };
                }
            }
        })
        .state('checkin-duration', {
            url: "/checkin/duration",
            controller: 'CheckinDurationController',
            templateUrl: "templates/checkin-duration.html"
        })
        .state('checkin-duration-extend', {
            url: "/checkin/duration/extend",
            cache: false,
            controller: 'CheckinDurationExtendController',
            templateUrl: "templates/checkin-duration-extend.html"
        })
        .state('checkin-location', {
            url: "/checkin/location/:longitude,:latitude",
            controller: 'CheckinLocationController',
            templateUrl: "templates/checkin-location.html",
            resolve: {
                geofence: function ($stateParams, GeofenceService) {
                    return GeofenceService.create({
                        longitude: parseFloat($stateParams.longitude),
                        latitude: parseFloat($stateParams.latitude)
                    });
                }
            }
        })
        .state('checkin-location-new', {
            url: "/checkin/location/new/:longitude,:latitude",
            controller: 'CheckinLocationNewController',
            templateUrl: "templates/checkin-location-new.html",
            resolve: {
                currentPosition: function ($stateParams) {
                    return {
                        longitude: parseFloat($stateParams.longitude),
                        latitude: parseFloat($stateParams.latitude)
                    };
                }
            }
        })
        .state('checkin-locationtracking', {
            url: "/checkin/locationtracking",
            controller: 'CheckinLocationTrackingController',
            templateUrl: "templates/checkin-locationtracking.html"
        })
        .state('checkin-emergency', {
            url: "/checkin/emergency",
            controller: 'CheckinEmergencyController',
            templateUrl: "templates/checkin-emergency.html"
        })
        .state('checkin-companion', {
            url: "/checkin/companion",
            controller: 'CheckinCompanionController',
            templateUrl: "templates/checkin-companion.html"
        })
        .state('checkin-companiondetails', {
            url: "/checkin/companiondetails",
            controller: 'CheckinCompanionDetailsController',
            templateUrl: "templates/checkin-companiondetails.html"
        })

        .state('safety', {
            url: "/safety",
            templateUrl: "templates/safety.html",
            controller: 'SafetyController'
        })

        .state('emergency', {
            url: "/emergency/:longitude,:latitude",
            templateUrl: "templates/emergency.html",
            controller: 'EmergencyController',
            resolve: {
                currentPosition: function ($stateParams) {
                    return {
                        longitude: parseFloat($stateParams.longitude),
                        latitude: parseFloat($stateParams.latitude)
                    };
                }
            }
        })
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');

});