(function () {
    'use strict';

    angular
        .module('app')
        .factory('MapGoogleAbstractService', MapGoogleAbstractService);

    MapGoogleAbstractService.$inject = [];

    function MapGoogleAbstractService() {
        var map;
        var directionService;
        var markerInfoWindow, clusterInfoWindow, directionInfoWindow;
        var markerClusterer;
        var colors;
        $.getJSON("app/components/map/colors.json", function (value) {
            colors = value;
        });        

        var markerIsClicked = false;

        var service = {
            setMap: setMap,
            setMarkerInfoWindow: setMarkerInfoWindow,
            setMarkerInfoWindowToMap: setMarkerInfoWindowToMap,
            setClusterInfoWindow: setClusterInfoWindow,
            setDirectionInfoWindow: setDirectionInfoWindow,
            setMarkerClusterer: setMarkerClusterer,
            setMarker: setMarker,
            setMouseoverListenerForMarkerClusterer: setMouseoverListenerForMarkerClusterer,
            setMouseOutListenerForMarkerClusterer: setMouseOutListenerForMarkerClusterer,
            setClickListenerForMarkerClusterer: setClickListenerForMarkerClusterer,
            setMouseoverListenerForMarker: setMouseoverListenerForMarker,
            setZoomChangedListenerForMap: setZoomChangedListenerForMap,
            setMouseoutListenerForMarker: setMouseoutListenerForMarker,
            setClickListenerForMaker: setClickListenerForMaker,
            getMarkerIsClicked: getMarkerIsClicked,
            setMarkerIsClicked: setMarkerIsClicked,
            setBound: setBound,
            setDirectionService: setDirectionService,
            setMapCenter: setMapCenter,
            setDirectionForMapController: setDirectionForMapController,
            resizeMap: resizeMap,
            setCenterOfPolylines: setCenterOfPolylines

        };

        return service;

        // Methode, um die Map zu initialisieren.
        function setMap(mapId) {
            map = null;
            map = new google.maps.Map(mapId,
            {
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                zoom: 13
            });

            $(mapId).animate({ width: "auto" }, function () {
                google.maps.event.trigger(map, 'resize');
            });
        };

        // Methode, um InfoWindows für die Marker und für die Cluster zu initialisieren.
        function setMarkerInfoWindow(x, y) {
            markerInfoWindow = new google.maps.InfoWindow(
            {
                // Verändert die Position um x Pixel sodass die Infbox über dem Icon ist
                pixelOffset: new google.maps.Size(x, y)
            });
        };

        //Mehtode, die den Tooltip auf einen Marker setzt
        function setMarkerInfoWindowToMap(content, position) {
            markerInfoWindow.setContent(content);
            markerInfoWindow.setPosition(position);
            markerInfoWindow.open(map);
        };

        //Mehtode, die einen Toolip für die Cluster initialisiert, jedoch noch nicht einem Cluster zuordnet
        function setClusterInfoWindow(x, y) {
            //InfoWindow für die Markers und für die Clusters werden iniziiert
            clusterInfoWindow = new google.maps.InfoWindow(
            {
                //Verändert die Position um x Pixel sodass die Infbox über dem Icon ist
                pixelOffset: new google.maps.Size(x, y)
            });
        };
        
        //Mehtode, die einen Toolip für die Routen initialisiert, jedoch noch nicht auf eine Route zugeordnet wird
        function setDirectionInfoWindow() {
            //InfoWindow für die Markers und für die Clusters werden iniziiert
            directionInfoWindow = new google.maps.InfoWindow();
        };

        //Methode, die den Clusterer auf die Map setzt
        function setMarkerClusterer() {
            markerClusterer = new MarkerClusterer(map);
            return markerClusterer;
        };

        //Methode, die die einen Marker iniziiert
        function setMarker(lat, lng, title) {
            var marker = new google.maps.Marker({
                position: {
                    lat: lat,
                    lng: lng
                },
                map: map,
                title: title,
                icon: 'images/TruckIcon.png'
            });
            return marker;
        };

        //Methode, die einen Mouseover Listener auf den Clusterer setzt. Bei Mouseover soll der Tooltip erscheinen
        function setMouseoverListenerForMarkerClusterer() {
            google.maps.event.addListener(markerClusterer,'mouseover',function (cluster) {
               clusterInfoWindow.setPosition(cluster.getCenter());
               var content = "";
               angular.forEach(cluster.getMarkers(),
                   function (value) {
                       content = content + "<div>" + value.title + "</div> ";
                   });
               clusterInfoWindow.setContent(content);
               clusterInfoWindow.open(map);
           });
        };

        //Methode, die einen Mouseout Listener auf den Clusterer setzt. Beim Mousout soll der Tooltip verschwinden.
        function setMouseOutListenerForMarkerClusterer() {
            google.maps.event.addListener(markerClusterer, 'mouseout', function () {
                clusterInfoWindow.close(map);
            });
        };

        //Methode, die einen Click Listener auf den Clusterer setzt. Bei Klick soll den Tooltip geschlossen werden.
        function setClickListenerForMarkerClusterer() {
            google.maps.event.addListener(markerClusterer, 'click', function () {
                clusterInfoWindow.close(map);
            });
        };

        //Methode, die einen Mouseover Listener auf den Marker setzt. Bei Mouseover soll der Tooltip erscheinen
        function setMouseoverListenerForMarker(markerParam, content) {
            google.maps.event.addListener(markerParam, 'mouseover', function () {
                markerInfoWindow.setPosition(markerParam.getPosition());
                markerInfoWindow.setContent(content);
                markerInfoWindow.open(map);
            });
        };

        //Methode, die einen Mouseout Listener auf den Marker setzt. Beim Mousout soll der Tooltip verschwinden.
        function setMouseoutListenerForMarker(markerParam) {
            google.maps.event.addListener(markerParam, 'mouseout', function () {
                if (!markerIsClicked) {
                    markerInfoWindow.close(map);
                }
            });
        };

        //Methode, die einen Click Listener auf den Clusterer setzt. Bei Klick soll den Tooltip bei Mouseout bestehen bleiben.
        function setClickListenerForMaker(markerParam) {
            google.maps.event.addListener(markerParam, 'click', function () {
                markerIsClicked = !markerIsClicked;
            });
        };

        //Methode, die einen ZoomChanged Listener auf die Map setzt. Wenn sich das Zoomlevel ändert soll der Tooltip über den Markern verschwinden.
        function setZoomChangedListenerForMap() {
            google.maps.event.addListener(map,'zoom_changed',function () {
               markerInfoWindow.close(map);
               markerIsClicked = false;
           });
        };

        //Methode, die zurückgibt ob einb Marker angeklickt wurde oder nicht.
        function getMarkerIsClicked() {
            return markerIsClicked();
        };

        //Mehtode, die setzt ob ein Marker angeklickt wurde oder nicht.
        function setMarkerIsClicked(bool) {
            markerIsClicked = bool;
        };

        //Methode, die  von allen Geodaten den Center und die optimale Zoomstufe setzt.
        function setBound(geopositions) {
            var bound = new google.maps.LatLngBounds();

            //Berechnet die Mitte von allen Markern
            angular.forEach(geopositions, function (geoposition) {
                bound.extend(new google.maps.LatLng(geoposition.latitude, geoposition.longitude));
            });

            map.setCenter(bound.getCenter());

            //Setzt das Zoomlevel sodass alle Fahrzeuge angezeigt werden
            map.fitBounds(bound);
            if (map.getZoom() > 16) {
                map.setZoom(16);
            }

        };

        //Methode, die den DirectionServer setzt.
        function setDirectionService() {
            directionService = new google.maps.DirectionsService();
        };

        //Methode, die die Routen berechnet. Route wird jedoch nicht auf die Karte gezeichnet, da
        //sonst die Farben nicht geändert werden können.
        function setDirectionForMapController(selectedTours, tour, registrationNumber, vehicleId) {

            //BuildRouteObject
            var waypoints = [];

            angular.forEach(tour.Waypoints,function(waypoint) {
                waypoints.push({ 'location': waypoint.Name });
            });
            var routeObject = {
                origin: tour.StartName,
                destination: tour.DestinationName,
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: waypoints
            }
        
            directionService.route(routeObject, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {

                    var directionsDisplays = new google.maps.DirectionsRenderer();
                    
                    directionsDisplays.setDirections(response);

                    var newPoly = createColorPoly(response.routes[0].legs, selectedTours, registrationNumber);

                    selectedTours.push(
                   {
                       vehicleId: vehicleId,
                       directionsDisplays: directionsDisplays,
                       data: routeObject,
                       poly: newPoly
                   });

                    setCenterOfPolylines(selectedTours);
                }
            });
            return selectedTours;
        };

        //Methode, die die Routen auf die Karte zeichnet. Jede Route hat dabei eine andere Farbe, sodass diese
        //unterschieden werden können. Zusätzlich werden noch Mouseover und Mouseout Listener auf die Route gesetzt.
        function createColorPoly(legs, selectedTours, registrationNumber) {
            var path = Array();
            for (var leg = 0;leg < legs.length;leg++) {
                for (var step = 0; step < legs[leg].steps.length; step++) {
                    for (var stepP = 0; stepP < legs[leg].steps[step].path.length; stepP++) {
                        
                        path.push(legs[leg].steps[step].path[stepP]);
                        
                    }
                }
            }
            var color = colors.colors[0];
            colors.colors.push(colors.colors.shift());
           
            var polySelected = { 'strokeWeight': '7', 'strokeColor': color };
            var polyUnselected = { 'strokeWeight': '5', 'strokeColor': color };
    
            var newPoly = new google.maps.Polyline(polyUnselected);
            newPoly.setPath(path);
            newPoly.setMap(map);
            google.maps.event.addListener(newPoly, 'mouseover', function(event) {
                newPoly.setOptions(polySelected);
                directionInfoWindow.setPosition(event.latLng.toJSON());
                directionInfoWindow
                    .setContent("<div>Kennzeichen: " + registrationNumber + "</div>");
                directionInfoWindow.open(map);
                
            });
            google.maps.event.addListener(newPoly, 'mouseout', function() {
                newPoly.setOptions(polyUnselected);
                directionInfoWindow.close(map);
            });

            return newPoly;

        }

        //Methode, die den Center der Routen berechnet und setzt.
        function setCenterOfPolylines(selectedTours) {
            var bound = new google.maps.LatLngBounds();

            //Berechnet die Mitte von allen Markern
            angular.forEach(selectedTours, function (tour) {
                angular.forEach(tour.directionsDisplays.directions.routes[0].legs, function (leg) {
                    bound.extend(new google.maps.LatLng(leg.start_location.lat(), leg.start_location.lng()));
                });
            });
            
            map.setCenter(bound.getCenter());
            //Setzt das Zoomlevel sodass alle Fahrzeuge angezeigt werden
            map.fitBounds(bound);
            if (map.getZoom() > 16) {
                map.setZoom(16);
            }
        }

        //Methode, die den Center der Map setzt.
        function setMapCenter(latlng) {
            map.setCenter(latlng);
        };

        //Methode, die einen Event Trigger auf die Karte setzt. Sobald sich die Kartengröße ändert, wie
        //die Karte refreshed.
        function resizeMap() {
            google.maps.event.trigger(map, 'resize');
        }
    }
})();