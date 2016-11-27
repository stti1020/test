(function () {
    'use strict';

    angular
        .module('app')
        .factory('TourAndRouteGoogleAbstractService', TourAndRouteGoogleAbstractService);

    TourAndRouteGoogleAbstractService.$inject = [];

    function TourAndRouteGoogleAbstractService() {

        var map;
        var secondMap;
        var directionsDisplay;
        var secondDirectionDisplay;
        var directionsService;
        var secondDirectionService;
        var karlsruhe = new google.maps.LatLng(49.007862, 8.40366);
        var mapOptions = {
            zoom: 12,
            center: karlsruhe
        };
        var geocoder;
        var routeObject;


        var service = {
            setMap: setMap,
            setSecondMap: setSecondMap,
            setDirectionService: setDirectionService,
            setSecondDirectionService: setSecondDirectionService,
            setGeocode: setGeocode,
            setDirectionsWithCallback: setDirectionsWithCallback,
            setDirectionsWithoutCallback: setDirectionsWithoutCallback,
            setDirectionsForSecondMap: setDirectionsForSecondMap,
            buildRouteObject: buildRouteObject,
            getViaWaypoints: getViaWaypoints,
            getWaypointsToAdd: getWaypointsToAdd,
            setAutocompletion: setAutocompletion,
            useGeocoder: useGeocoder,
            setCenter: setCenter
        };

        return service;

        // Methode, um die Map zu initialisieren.
        function setMap(mapObject) {
            map = new google.maps.Map(mapObject, mapOptions);
            google.maps.event.addListener(map,'idle',function() {
                google.maps.event.trigger(map, 'resize');
            });
        }

        // Methode, um die zweite Map zu initialisieren.
        function setSecondMap(mapObject) {
            secondMap = new google.maps.Map(mapObject, mapOptions);
            google.maps.event.addListener(secondMap, 'idle', function () {
                google.maps.event.trigger(secondMap, 'resize');
            });
           
        }

        // Methode, um den DirectionsService von Google zu initialisieren.
        function setDirectionService(draggable) {
            directionsService = new google.maps.DirectionsService();
            if (draggable) {
                directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
            } else {
                directionsDisplay = new google.maps.DirectionsRenderer();
            }
            directionsDisplay.setMap(map);
        }

        // Methode, um den zweiten DirectionsService von Google zu initialisieren.
        function setSecondDirectionService(draggable) {
            secondDirectionService = new google.maps.DirectionsService();
            if (draggable) {
                secondDirectionDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
            } else {
                secondDirectionDisplay = new google.maps.DirectionsRenderer();
            }          
            secondDirectionDisplay.setMap(secondMap);
        }

        // Methode, um den Geocoder von Google zu initialisieren.
        function setGeocode() {
            geocoder = new google.maps.Geocoder;
        }

        // Methode, um eine Route einzuzeichnen.
        // Gibt den Reponse der Google APi zurück.
        function setDirectionsWithCallback(cb) {
            directionsService.route(routeObject, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    cb(response);
                }
            });
        }

        // Methode, um eine Route einzuzeichnen.
        function setDirectionsWithoutCallback() {
            directionsService.route(routeObject, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        }

        // Methode, um eine zweite Route einzuzeichnen.
        function setDirectionsForSecondMap(cb) {
            secondDirectionService.route(routeObject, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    secondDirectionDisplay.setDirections(response);
                    cb(response.routes[0].legs);                    
                }
            });
        }

        

        // Methode um die Auswahl ind der Karte in die Mitte zu setzen.
        function setCenter(legs, secondMapIsSelected) {
            var bound = new google.maps.LatLngBounds();

            angular.forEach(legs, function (leg) {
                var myLatLng = new google.maps.LatLng(leg.start_location.lat(), leg.start_location.lng());
                bound.extend(myLatLng);
            });

            var latLng = new google.maps.LatLng(bound.getCenter().lat(), bound.getCenter().lng());
            if (secondMapIsSelected) {
                secondMap.setCenter(latLng);
                google.maps.event.trigger(secondMap, 'resize');
            } else {
                map.setCenter(latLng);
                google.maps.event.trigger(map, 'resize');
            }
           
        };

        // Methode um ein Route Objekt nach der API Vorgabe von Google zu erstellen.
        function buildRouteObject(origin, destination, waypoints) {
            if (waypoints === 'undefined') {
                routeObject = {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                }
                return routeObject;
            } else {
                routeObject = {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                    waypoints: waypoints
                }
                return routeObject;
            }
        };

        // Methode, um die per Drag&Drop eingezeichneten Wegpunkte zu erhalten.
        function getViaWaypoints() {
             return directionsDisplay.directions.routes[0].legs[0].via_waypoints;
        };

        // Methode, um die Wegpunkte einer Route zu erhalten, die als Marker eingezeichnet wurden.
        function getWaypointsToAdd() {
            return directionsDisplay.directions.request.waypoints;
        };

        // Methode um die Autovervollständigung der Inputfelder durch Google zu initialisieren.
        function setAutocompletion(sourceInput, destinationInput, sourceAndDestiantionInput, waypointInput) {
            var autocompleteSourceInput = new google.maps.places.Autocomplete(sourceInput);
            var autocompleteDestinationInput = new google.maps.places.Autocomplete(destinationInput);
            var autocompleteSourceAndDestinationInput = new google.maps.places.Autocomplete(sourceAndDestiantionInput);
            var autocompleteWaypointInput = new google.maps.places.Autocomplete(waypointInput);
        };

        // Methode, die den Geocoder von Google anspricht, um Längen- und Breitenangaben in Adressen umzuwandeln.
        function useGeocoder(latLng, deferred, cb) {
            geocoder.geocode({ 'location': latLng }, function (result, status) {
                deferred.resolve(result[0].formatted_address);
                cb(deferred);
            });
        };

    }
})();