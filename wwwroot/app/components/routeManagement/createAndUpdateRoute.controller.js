(function () {
    'use strict';

    angular.module('app')
        .controller('CreateAndUpdateRouteController', CreateAndUpdateRouteController);


    CreateAndUpdateRouteController.$inject = ['$location', 'RouteService', '$q', '$scope', '$routeParams', 'TourAndRouteGoogleAbstractService'];

    function CreateAndUpdateRouteController($location, RouteService, $q, $scope, $routeParams, TourAndRouteGoogleAbstractService) {

        var vm = this;
        
        vm.route = RouteService.getRoute();        
        vm.calculateRoute = calculateRoute;
        vm.destination = undefined;
        vm.saveRoute = saveRoute;
        vm.switchCreateMode = switchCreateMode;
        vm.createMode = undefined;
        vm.source = undefined;
        vm.sourceAndDestination = undefined;
        vm.update = false;
        vm.waypoint = undefined;

        // Holt das View Element anhand der angegebenen Id und speichert dieses in die lokale Variable mapObject.
        var mapObject = document.getElementById('routeMap');
        TourAndRouteGoogleAbstractService.setMap(mapObject);
        var draggable = true;
        TourAndRouteGoogleAbstractService.setDirectionService(draggable);
        TourAndRouteGoogleAbstractService.setGeocode();

        var geocoder = new google.maps.Geocoder;


        // Zeichnet die Route ein, falls in showAllRoutes auf bearbeiten geklickt wurde.
        if ($routeParams.update) {

            vm.update = true;

            if (vm.route.StartName === vm.route.DestinationName) {
                vm.createMode = 'same';
            } else {
                vm.createMode = 'different';
            }

            var routeWaypoints = vm.route.Waypoints;
            
            var waypoints = [];
            angular.forEach(routeWaypoints,function (rw) {
                    waypoints.push({ 'location': rw.Name });
                }
            );
            TourAndRouteGoogleAbstractService.buildRouteObject(vm.route.StartName, vm.route.DestinationName, waypoints);
            TourAndRouteGoogleAbstractService.setDirectionsWithoutCallback();
        }

        // Initialisiert die Autocompletion für die Inputfelder Startpunkt, Zielpunkt Start- und Zielpunkt und Wegpunkt.
        function initialize() {
            var sourceInput = document.getElementById('source');
            var destinationInput = document.getElementById('destination');
            var sourceAndDestiantionInput = document.getElementById('sourceAndDestination');
            var waypointInput = document.getElementById('waypoint');
            TourAndRouteGoogleAbstractService.setAutocompletion(sourceInput, destinationInput, sourceAndDestiantionInput, waypointInput);
        }

        initialize();
        
        // Methode zur Berechnung des kürzesten Weges zwischen dem angegeben Start- und Zielpunkt
        // directionService zeichnet die Strecke in die Karte ein.
        function calculateRoute() {
            $scope.$broadcast("autofill:update");

            if (vm.createMode === 'different') {
                TourAndRouteGoogleAbstractService.buildRouteObject(vm.source, vm.destination);

            } else {
                var waypoints = [];
                waypoints.push({ 'location': vm.waypoint });
                TourAndRouteGoogleAbstractService.buildRouteObject(vm.sourceAndDestination, vm.sourceAndDestination, waypoints);
            }
            TourAndRouteGoogleAbstractService.setDirectionsWithoutCallback();
        };

        // Methode um die Route zu speichern.
        // Unterscheidet zwischen einer Route mit gleichem Ziel und Start und einer Route mit unterschiedlichem Start und Ziel.
        // Liest alle Wegpunkte aus der Karte aus.
        // Erstellt zu diesen Wegpunkten Objekte mit Latidude und Longitude Attributen und lässt diese durch die Funktion decode umwandeln.
        // Zeichnet die Route erneut mit den Wegpunkten als Marker.
        function saveRoute() {

            if (vm.createMode === 'different') {
                
                var viaWaypoints = TourAndRouteGoogleAbstractService.getViaWaypoints();
                var waypointsToAdd = TourAndRouteGoogleAbstractService.getWaypointsToAdd();
                var promises = [];
                var waypoints = [];

                angular.forEach(waypointsToAdd, function(waypoint) {
                    if (_.isString(waypoint.location)) {
                        waypoints.push({ 'location': waypoint.location });
                    }
                });

                angular.forEach(viaWaypoints,
                    function (waypoint) {
                        var latlng = { lat: waypoint.lat(), lng: waypoint.lng() };
                        var promise = changeCoordsToAddress(latlng);
                        promises.push(promise);
                    });

                $q.all(promises).then(function (results) {
                    angular.forEach(results, function(value) {
                        waypoints.push({ 'location': value });
                    });

                    var distance = 0;
                    if (vm.update) {
                        var startName = undefined;
                        var destinationName = undefined;
                        if (_.isUndefined(vm.source) || _.isNull(vm.source)) {
                            startName = vm.route.StartName;

                        } else {
                            startName = vm.source;
                        }

                        if (_.isUndefined(vm.destination) || _.isNull(vm.destination)) {
                            destinationName = vm.route.DestinationName;
                        } else {
                            destinationName = vm.destination;
                        }
                        var request = TourAndRouteGoogleAbstractService.buildRouteObject(startName, destinationName, waypoints);

                    } else {
                        var request = TourAndRouteGoogleAbstractService.buildRouteObject(vm.source, vm.destination, waypoints);

                    }
                    TourAndRouteGoogleAbstractService.setDirectionsWithCallback(function (response) {
               
                        if (response !== null || response !== undefined) {
                            distance = calculateDistance(response.routes[0].legs);

                            var legs = response.routes[0].legs;
                            if (vm.update) {
                                var routeToServer = {
                                    Id: vm.route.Id,
                                    StartName: response.request.origin,
                                    StartLongitude: response.routes[0].legs[0].start_location.lng(),
                                    StartLatitude: response.routes[0].legs[0].start_location.lat(),
                                    DestinationName: response.request.destination,
                                    DestinationLongitude: response.routes[0].legs[legs.length - 1].end_location.lng(),
                                    DestinationLatitude: response.routes[0].legs[legs.length - 1].end_location.lat(),
                                    Distance: distance
                                };
                            } else {
                                var routeToServer = {
                                    StartName: vm.source,
                                    StartLongitude: response.routes[0].legs[0].start_location.lng(),
                                    StartLatitude: response.routes[0].legs[0].start_location.lat(),
                                    DestinationName: vm.destination,
                                    DestinationLongitude: response.routes[0].legs[legs.length - 1].end_location.lng(),
                                    DestinationLatitude: response.routes[0].legs[legs.length - 1].end_location.lat(),
                                    Distance: distance
                                };
                            }

                            var waypointsToServer = [];
                            for (var i = 0; i < legs.length - 1; i++) {
                                waypointsToServer.push({
                                    Name: legs[i].end_address,
                                    Longitude: legs[i].end_location.lng(),
                                    Latitude: legs[i].end_location.lat()
                                });
                            }
                            return RouteService.createRoute(routeToServer, waypointsToServer);
                        };
                    });                   
                    
                RouteService.setRoute(request);

            });
            } else {

                var viaWaypoints = TourAndRouteGoogleAbstractService.getWaypointsToAdd();
                var waypointsToAdd = TourAndRouteGoogleAbstractService.getWaypointsToAdd();
                var promises = [];
                var waypoints = [];
                var waypointLocation = undefined;

                angular.forEach(waypointsToAdd, function (waypoint) {
                    if (_.isString(waypoint.location)) {
                        waypoints.push({ 'location': waypoint.location });
                    }
                });

                for(var i = 0; i < viaWaypoints.length; i++)
                {
                    if (_.isString(viaWaypoints[i].location)) {
                        var promise = setWaypointName(viaWaypoints[i].location);
                    } else {
                        var latlng = { lat: viaWaypoints[i].location.lat(), lng: viaWaypoints[i].location.lng() };
                        var promise = changeCoordsToAddress(latlng);
                    }
                    promises.push(promise);
                }
                
                $q.all(promises).then(function (results) {
                    angular.forEach(results, function (value) {
                        waypoints.push({ 'location': value });
                });

                var distance = 0;
                if (vm.update) {
                    var startAndDestinationName = undefined;
                    if (_.isUndefined(vm.sourceAndDestination) || _.isNull(vm.sourceAndDestination)) {
                        startAndDestinationName = vm.route.StartName;

                    } else {
                        startAndDestinationName = vm.sourceAndDestination;
                    }
                    var request = TourAndRouteGoogleAbstractService.buildRouteObject(startAndDestinationName, startAndDestinationName, waypoints);

                } else {
                    var request = TourAndRouteGoogleAbstractService.buildRouteObject(vm.sourceAndDestination, vm.sourceAndDestination, waypoints);
                }
                TourAndRouteGoogleAbstractService.setDirectionsWithCallback(function (response) {
                   
                    if (response !== null || response !== 'undefined') {
                        distance = calculateDistance(response.routes[0].legs);
                        var legs = response.routes[0].legs;

                        if (vm.update) {
                            var routeToServer = {
                                Id: vm.route.Id,
                                StartName: response.request.origin,
                                StartLongitude: response.routes[0].legs[0].start_location.lng(),
                                StartLatitude: response.routes[0].legs[0].start_location.lat(),
                                DestinationName: response.request.destination,
                                DestinationLongitude: response.routes[0].legs[legs.length - 1].end_location.lng(),
                                DestinationLatitude: response.routes[0].legs[legs.length - 1].end_location.lat(),
                                Distance: distance
                            };
                        } else {
                            var routeToServer = {
                                StartName: vm.sourceAndDestination,
                                StartLongitude: response.routes[0].legs[0].start_location.lng(),
                                StartLatitude: response.routes[0].legs[0].start_location.lat(),
                                DestinationName: vm.sourceAndDestination,
                                DestinationLongitude: response.routes[0].legs[0].start_location.lng(),
                                DestinationLatitude: response.routes[0].legs[0].start_location.lat(),
                                Distance: distance
                            };
                        }

                        var waypointsToServer = [];

                        for (var i = 0; i < legs.length - 1; i++) {
                            waypointsToServer.push({
                                Name: legs[i].end_address,
                                Longitude: legs[i].end_location.lng(),
                                Latitude: legs[i].end_location.lat()
                            });
                        }

                        return RouteService.createRoute(routeToServer, waypointsToServer);
                    };
                });
                
                 RouteService.setRoute(request);

              });
            }
        };

        // Methode um zwischen dem Modus gleicher Start- und Zielpunkt und unterschiedlicher Start- und Zielpunkt zu wechseln.
        // Erwartet ein string als Parameter ('same' oder 'different')
        // Setzt die Variable vm.createMode auf diesen Wert.
        function switchCreateMode(value) {
            vm.createMode = value;
        };

        // Methode um die Distanz der Route zu berechnen.
        // Erwartet ein legs-Objekt eines Google Maps Directions API Responses.
        // Liefert die Distanz der Strecke in Metern (int) zurück.
        function calculateDistance(legs) {
            var distance = 0;
            for (var i = 0; i < legs.length; i++) {
                distance += legs[i].distance.value;
            }
            return distance;
        };

        // Methode um den angegeben Wegpunkt in die Liste der Wegpunkte zu speichern, nötig, da sonst die Reihenfolge der Wegpunkte durcheinander kommen würde.
        // Erwartet den Namen des Wegpunktes als Parameter.
        // Gibt einen Promise zurück.
        function setWaypointName(name) {
            var deferred = $q.defer();
            deferred.resolve(name);
            return deferred.promise;
        };

        // Methode um Objekte mit Latidude und Longitude Attribute mit Hilfe der Google API in Adressen im string Format umzuwandeln.
        // Erwartet ein Objekt mit LAtitude und Longitude in Dezimalzahlen.
        // Gibt die Adresse des Wegpunkts als string zurück.
        function changeCoordsToAddress(latlng) {
            var deferred = $q.defer();

            geocoder.geocode({ 'location': latlng }, function (result, status) {
                deferred.resolve(result[0].formatted_address);
            });
            return deferred.promise;
        };
    }
})();

