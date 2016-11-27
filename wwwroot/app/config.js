(function() {
    'use strict';

    angular.module('app')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {

        $routeProvider
            .when('/',
            {
                templateUrl: 'app/components/landingPage/landingPage.html',
                controller: 'LandingPageController as landingPageCtrl'
            })
            .when('/Map',
            {
                templateUrl: 'app/components/map/map.html',
                controller: 'MapController as mapCtrl',
                resolve: {
                    allVehicles: [
                        'VehicleService', function (VehicleService) {
                            return VehicleService.fetchAllVehicles().then(function (allVehicles) {
                                return allVehicles;
                            })
                        }
                    ],
                    allRegistrationNumbersWithGeoposition: [
                        'MapService', function (MapService) {
                            return MapService.GetAllRegistrationNumbersWithGeoposition().then(function (allRegistrationNumbersWithGeoposition) {
                                return allRegistrationNumbersWithGeoposition;
                            })
                        }
                    ]
                }
            })
            .when('/Profile',
            {
                templateUrl: 'app/components/profile/profile.html',
                controller: 'ProfileController as profileCtrl',
                resolve: {
                    currentUser: [
                        'AuthenticationService', function (AuthenticationService) {
                            return AuthenticationService.getCurrentUser();
                        }
                    ]
                }
            })
            .when('/VehicleManagement/createVehicle',
            {
                    templateUrl: 'app/components/vehicleManagement/createVehicle.html',
                    controller: 'CreateVehicleController as createVehicleCtrl',
                    resolve: {
                        allVehicleTypes: [
                            'VehicleTypeService', function(VehicleTypeService) {
                                return VehicleTypeService.fetchAllVehicleTypes().then(function(allVehicleTypes) {
                                    return allVehicleTypes;
                                })
                            }
                        ]
                    }
            })
            .when('/VehicleManagement',
            {
                templateUrl: 'app/components/vehicleManagement/showAllVehicles.html',
                controller: 'ShowAllVehiclesController as showAllVehiclesCtrl',
                resolve: {
                    allVehicles: [
                        'VehicleService', function (VehicleService) {
                            return VehicleService.fetchAllVehicles();
                        }
                    ]
                }
            })
            .when('/VehicleManagement/showVehicle',
            {
                templateUrl: 'app/components/vehicleManagement/showVehicle.html',
                controller: 'ShowVehicleController as showVehicleCtrl',
                resolve: {
                    vehicleWithPicture: [
                        'VehicleService', function (VehicleService) {
                            return VehicleService.fetchVehicleById(VehicleService.getVehicle().Id);                           
                        }
                    ]
                }
            })
            .when('/VehicleManagement/updateVehicle',
            {
                templateUrl: 'app/components/vehicleManagement/updateVehicle.html',
                controller: 'UpdateVehicleController as updateVehicleCtrl',
                resolve: {
                    allVehicleTypes: [
                        'VehicleTypeService', 'VehicleService', function (VehicleTypeService, VehicleService) {
                            return VehicleTypeService.fetchAllVehicleTypes().then(function (allVehicleTypes) {
                                VehicleService.fetchVehicleById(VehicleService.getVehicle().Id);
                                return allVehicleTypes;
                            })
                        }
                    ]
                }
            })
            .when('/TourManagement',
            {
                templateUrl: 'app/components/tourManagement/showAllTours.html',
                controller: 'ShowAllToursController as showAllToursCtrl',
                resolve: {
                    allToursByDateRange: [
                        'TourService', function (TourService) {
                            var date = new Date();
                            var d = new Date("July 21, 1983 01:15:00");
                            var dateToday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate())
                            var dateTomorrow = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1);
                            return TourService.fetchAllToursByDateRange(dateToday, dateToday).then(function (allToursByDateRange) {
                                return allToursByDateRange;
                            })
                        }
                    ]
                }
            })
            .when('/TourManagement/createAndUpdateTour/:update?/:tourOrSeries?',
            {
                templateUrl: 'app/components/tourManagement/createAndUpdateTour.html',
                controller: 'CreateAndUpdateTourController as createAndUpdateTourCtrl',
                resolve: {
                    allVehicles: [
                        'VehicleService', function (VehicleService) {
                            return VehicleService.fetchAllVehicles().then(function (allVehicles) {
                                return allVehicles;
                            })
                        }
                    ],
                    allRoutes: [
                        'RouteService', function(RouteService) {
                            return RouteService.fetchAllRoutes().then(function(allRoutes) {
                                return allRoutes;
                            })
                        }
                    ]
                }
            })
            .when('/RouteManagement',
            {
                templateUrl: 'app/components/routeManagement/showAllRoutes.html',
                controller: 'ShowAllRoutesController as showAllRoutesCtrl',
                resolve: {
                    allRoutes: [
                        'RouteService', function(RouteService) {
                            return RouteService.fetchAllRoutes().then(function(allRoutes) {
                                return allRoutes;
                            })
                        }
                    ]
                }
            })
            .when('/RouteManagement/createAndUpdateRoute/:update?',
            {
                templateUrl: 'app/components/routeManagement/createAndUpdateRoute.html',
                controller: 'CreateAndUpdateRouteController as createAndUpdateRouteCtrl'
            })
            .when('/Profile',
            {
                templateUrl: 'app/components/profile/profile.html',
                controller: 'ProfileController as profileCtrl',
                resolve: {
                    currentUser: [
                        'AuthenticationService', function (AuthenticationService) {
                            return AuthenticationService.fetchCurrentUser().then(function(currentUser) {
                                return currentUser
                            })
                        }
                    ]
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();
