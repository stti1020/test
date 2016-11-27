(function () {
    'use strict';

    angular
        .module('app')
        .controller('ShowAllRoutesController', ShowAllRoutesController);

    ShowAllRoutesController.$inject = ['$location', 'RouteService', '$cookies', 'allRoutes', 'TourAndRouteGoogleAbstractService'];

    function ShowAllRoutesController($location, RouteService, $cookies, allRoutes, TourAndRouteGoogleAbstractService) {

        var vm = this;

        // Holt das View Element anhand der angegebenen Id und speichert dieses in die lokale Variable mapObject.
        var mapObject = document.getElementById('selectedRouteMap');
        var draggable = false;

        // Initialisiert die Map.
        TourAndRouteGoogleAbstractService.setMap(mapObject);
        TourAndRouteGoogleAbstractService.setDirectionService(draggable);        

        vm.allRoutes = allRoutes;
        vm.deleteRouteById = deleteRouteById;
        vm.orderFieldBy = 'StartName';
        vm.reverseSort = false;
        vm.route = undefined;
        vm.selected = undefined;
        vm.selectRoute = selectRoute;
        vm.updateRoute = updateRoute;
        
        // Methode um eine Route zu löschen, gibt die Id der aktuell ausgewählten Route an die deleteRouteById Methode des Route Services weiter.
        function deleteRouteById() {
            swal({
                title: "Soll diese Route wirklich gelöscht werden?",
                text: "Die Route kann nicht wiederhergestellt werden",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Abbrechen",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Löschen",
                closeOnConfirm: false
            }, function () {
                return RouteService.deleteRouteById(vm.route.Id).then(function (success) {
                    if (success === true) {
                        vm.allRoutes = _.remove(vm.allRoutes, function (route) {
                            if (route !== vm.route) {
                                return route;
                            }
                        });
                        vm.route = undefined;
                        swal({
                            title: "Erfolgreich gelöscht!",
                            type: "success",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });
                    } else {
                        swal("Interner Serverfehler!", "", "error");
                    }
                }, function (error) {
                    if (error.status === 404) {
                        swal("Route ist noch einer Tour zugeordnet!", "", "error");
                    } else {
                        swal("Route konnte nicht gelöscht werden!", "", "error");
                    }

                });
            });
        }


        // Methode um die in der Tabelle ausgewählte Route zu setzen und diese in die Karte einzuzeichnen.
        function selectRoute(route, index) {
            vm.selected = index;
            vm.route = route;
            RouteService.setRoute(route);
            $cookies.putObject('selectedRoute', route);

            var routeWaypoints = route.Waypoints;
            var waypoints = [];
            angular.forEach(routeWaypoints,
                function (rw) {
                    waypoints.push({ 'location': rw.Name });
                }
            );

            TourAndRouteGoogleAbstractService.buildRouteObject(route.StartName, route.DestinationName, waypoints);
            TourAndRouteGoogleAbstractService.setDirectionsWithoutCallback();
        };

        // Methode um auf createOrUpdateRoute.html zu gelangen, als RouteParameter wird true übergeben damit dem System klar ist dass es sich um ein Update handelt.
        function updateRoute() {
            if (vm.route) {
                $location.path('/RouteManagement/createAndUpdateRoute/true');
            };
        };

    }
})();
