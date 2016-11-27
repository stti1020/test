(function () {
    'use strict';

    angular.module('app')
        .factory("RouteService", RouteService);

    RouteService.$inject = ['Restangular', '$cookies', '$http', '$location'];

    function RouteService(Restangular, $cookies, $http, $location) {
        var allRoutes;
        var route;

        var service = {
            createRoute: createRoute,
            deleteRouteById: deleteRouteById,
            fetchAllRoutes: fetchAllRoutes,
            getRoute: getRoute,
            setRoute: setRoute,
        };

        return service;

        // Methode um eine Route in der Datenbank abzuspeichern, erwartet eine Route-Objekt als Argument.
        function createRoute(route, waypoints) {
            var parameter = JSON.stringify({Route: route, RouteWaypoints: waypoints});
            return Restangular.all('/api/route').customPOST({ name: "" }, "CreateOrUpdateRoute", { json: parameter }).then(function (success) {
                if (success === true) {
                    swal("Erfolgreich gespeichrt!", "", "success");
                    $location.path('/RouteManagement');
                } else {
                    swal("Interner Serverfehler!", "", "error");
                }
            },
            function (error) {
                swal("Interner Serverfehler!", "", "error");
            });
        };

        // Methode um eine Route anhand ihrer Id zu löschen, erwartet als Argument eine Id.
        function deleteRouteById(id) {
            return Restangular.all('api/route').customDELETE("DeleteRouteById", { id: id });        
        }

        // Methode um alle in der Datenbank gelisteten Routen als Array zu erhalten.
        function fetchAllRoutes() {
            return Restangular.all('/api/route/GetAllRoutes').getList().then(function(allRoutesResponse) {
                return allRoutes = allRoutesResponse;
            });
        };

        // Methode um die aktuelle lokal gepeicherte Route aus dem Service zu erhalten.
        function getRoute() {
            if (_.isEmpty(route) || _.isUndefined(route)) {
                route = $cookies.getObject('selectedRoute');
            }
            return route;
        };

        // Methode um die aktuell im Service gespeicherte Route zu ändern.
        function setRoute(newRoute) {
            route = newRoute;
        };
    }
})();




