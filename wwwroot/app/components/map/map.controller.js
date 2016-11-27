(function() {
    'use strict';

    angular.module('app')
        .controller('MapController', MapController);

    MapController.$inject = ['$location', 'MapService', 'TourService', 'allVehicles', 'allRegistrationNumbersWithGeoposition', 'MapGoogleAbstractService'];


    function MapController($location, MapService, TourService, allVehicles, allRegistrationNumbersWithGeoposition, MapGoogleAbstractService) {

        var vm = this;
        var markers = [];
        var registrationNumbers = [];
        var selectedTours = [];
        var mapIsInitialized = false;
        var latestGeopositions = null;
        var vehicleHasNoTour = [];
        var mapId = document.getElementById('googleMap');

        // Karte wird iniziiert.
        MapGoogleAbstractService.setDirectionService();
        MapGoogleAbstractService.setMap(mapId);

        // InfoWindows werden iniziiert.
        MapGoogleAbstractService.setMarkerInfoWindow(0, -30);
        MapGoogleAbstractService.setClusterInfoWindow(0, -10);
        MapGoogleAbstractService.setDirectionInfoWindow();

        // MarkerClusterer wird iniziiert.
        var markerClusterer = MapGoogleAbstractService.setMarkerClusterer();
        var clusterStyles = [
            {
                textColor: 'white',
                textSize: 20,
                url: 'images/cluster1.png',
                height: 35,
                width: 35
            }
        ];

        // Speichert alle Fahrzeugdatensätze in die lokale Variable allVehicles und alle Kennzeichen mit Geopositionen in die lokale Variable allRegistrationNumbersWithGeoposition.
        vm.allVehicles = allVehicles;
        vm.allRegistrationNumbersWithGeoposition = allRegistrationNumbersWithGeoposition;

        // Größe Karte, Auswahlbox
        vm.showConfig = true;
        vm.mapWidth = "col-lg-8";
        vm.showConfigIcon = "Fahrzeugauswahl ausblenden";
        vm.resizeMapWidth = resizeMapWidth;

        // Auswahlbox: Filter, Sortieren
        vm.filter = { id: "" };
        vm.filterValue;
        vm.filterValueChanged = filterValueChanged;
        vm.orderByField = 'Kennzeichen';
        vm.reverseSort = false;

        // Checkbox
        vm.changeShowRegistrationNumber = changeShowRegistrationNumber;
        vm.checkedRegistrationNumber = checkedRegistrationNumber;
        vm.stateCheckbox = stateCheckbox;
        vm.selectRegistrationNumbersWithGeoposition = selectRegistrationNumbersWithGeoposition;
        vm.checkBoxCursor = checkBoxCursor;

        // Simulation
        vm.startSimulation = startSimulation;
        vm.simulationStarted = false;
        vm.simulationDropdown = "Kennzeichen auswählen";
        vm.selectSimulationRegistrationNumber = selectSimulationRegistrationNumber;

        // Touren
        vm.showTourOfSelectedVehicle = showTourOfSelectedVehicle;
        vm.checkIfVehicleIsSelected = checkIfVehicleIsSelected;
        vm.uncheckVehicleIfTourIsSelected = uncheckVehicleIfTourIsSelected;
        vm.checkIfVehicleHasNoTour = checkIfVehicleHasNoTour;
        vm.checkIfVehicleHasNoTourToDisableButton = checkIfVehicleHasNoTourToDisableButton;

        // Dropdown um das Kennzeichen für die Simulation auszuwählen.
        function selectSimulationRegistrationNumber(regNumber) {
            vm.simulationDropdown = regNumber;
        }

        // Methode, um die Simulation zu starten.
        function startSimulation() {
            vm.simulationStarted = true;

            if (vm.simulationDropdown !== "Kennzeichen auswählen") {
                LatestGeoposition.stop();
                removeMarkers();
                markerClusterer.clearMarkers();

                MapService.GetGeopositionsForSimulationByRegistrationNumber(vm.simulationDropdown).then((function (allGeopositionsResponse) {
                    allGeopositionsResponse.reverse();
                    var marker;
                    (function fn(n) {
                        if (n < allGeopositionsResponse.length) {
                            setTimeout(function() {
                                    removeMarkers();
                                    marker = MapGoogleAbstractService.setMarker(allGeopositionsResponse[n].latitude,allGeopositionsResponse[n].longitude,allGeopositionsResponse[n].registrationNumber);
                                    markers.push(marker);

                                    // Inhalt für Tooltip.
                                    var content = "<div> Kennzeichen: " + allGeopositionsResponse[n].registrationNumber + "</div>";
                                       
                                    angular.forEach(allGeopositionsResponse[n].obdPropertyList, function (property) {
                                        if (property.result === 'INVALID') {
                                            content = content + "<div>" + property.property + ": " + property.result + "</div>"
                                        } else {
                                            content = content + "<div>" + property.property + " " + property.result + " " + property.unit + "</div>"
                                        }
                                    });
                                        
                                    // Setzt Tooltip über den Marker.
                                    MapGoogleAbstractService.setMarkerInfoWindowToMap(content, marker.getPosition());

                                    // Setzt die Position der Karte.
                                    var myLatlng = { lat: allGeopositionsResponse[n].latitude, lng: allGeopositionsResponse[n].longitude };
                                    MapGoogleAbstractService.setMapCenter(myLatlng);
                                    fn(++n);
                                },
                                900);
                        } else if (n === allGeopositionsResponse.length) {
                            vm.simulationStarted = false;
                            LatestGeoposition = MapService.GetLatestGeopositionByRegistrationNumbers(registrationNumbers);
                            mapIsInitialized = false;
                        }
                    }(0));
                }), function (error) {
                    if (error.status === 404) {
                        swal("Simulation konnte nicht gestartet werden!", "Es sind keine Geodaten zu diesem Fahrzeug in der Datenbank enthalten.", "error");
                        vm.simulationStarted = false;
                    }
                });
            } else {
                swal("Simulation konnte nicht gestartet werden!", "Um die Simulation zu starten muss ein Fahrzeug ausgewählt werden.", "error");
                vm.simulationStarted = false;
            }
        }

        // setzt Cursor für die Checkboxen.
        function checkBoxCursor(registrationNumber) {
            if (vm.allRegistrationNumbersWithGeoposition.indexOf(registrationNumber) > -1 && !vm.simulationStarted) {
                return "pointer";
            } else {
                return "not-allowed";
            }
        }

        // Methode die den Filter bei Änderung auf den neuen Wert setzt.
        function filterValueChanged() {
            vm.filterValue = $('#vehicleFilter').val();
        }

        // wählt alle Kennzeichen, die eine Geoposition haben, aus bzw. ab.
        function selectRegistrationNumbersWithGeoposition() {
            if (!vm.simulationStarted) {
                // prüft ob in der Suchleiste nichts eingegeben wurde.
                if (vm.filterValue === "" || vm.filterValue === null || vm.filterValue === undefined) {
                    if (registrationNumbers.length < vm.allRegistrationNumbersWithGeoposition.length) {
                        registrationNumbers.splice(0, registrationNumbers.length);
                        registrationNumbers.push.apply(registrationNumbers, vm.allRegistrationNumbersWithGeoposition);
                    } else {
                        registrationNumbers.splice(0, registrationNumbers.length);
                    }
                } else {
                    for (var i = 0; i < vm.allVehicles.length; i++) {
                        if (vm.allVehicles[i].RegistrationNumber.toUpperCase().includes(vm.filterValue.toUpperCase()) ||
                            vm.allVehicles[i].VehicleType.Name.toUpperCase().includes(vm.filterValue.toUpperCase())) {
                            var isSelected = false;
                            var hasGeoposition = false;
                            for (var z = 0; z < registrationNumbers.length; z++) {
                                if (registrationNumbers[z] === vm.allVehicles[i].RegistrationNumber) {
                                    isSelected = true;
                                    break;
                                }
                            }
                            for (var n = 0; n < allRegistrationNumbersWithGeoposition.length; n++) {
                                if (allRegistrationNumbersWithGeoposition[n] === vm.allVehicles[i].RegistrationNumber) {
                                    hasGeoposition = true;
                                    break;
                                }
                            }
                            if (!isSelected && hasGeoposition) {
                                registrationNumbers.push(allVehicles[i].RegistrationNumber);
                            } else if (isSelected && hasGeoposition) {
                                registrationNumbers.splice(registrationNumbers.indexOf(allVehicles[i].RegistrationNumber), 1);
                            }
                        }
                    }
                }

                LatestGeoposition = MapService.GetLatestGeopositionByRegistrationNumbers(registrationNumbers);
                mapIsInitialized = false;
            }
        }

        // aktiviert bw. deaktiviert die Checkbox, je nachdem ob das Kennzeichen eine Geoposition hat.
        function stateCheckbox(registrationNumber) {
            if (vm.allRegistrationNumbersWithGeoposition.indexOf(registrationNumber) > -1) {
               
                return false;

            } else {

                return true;
            }
        }

        // Methode , um die Größe der Map bei Veränderung anzupassen
        function resizeMapWidth() {
            if (vm.showConfig === true) {
                $(mapId).animate({ width: "auto" }, function () {
                    MapGoogleAbstractService.resizeMap();
                            setCenter(latestGeopositions);
                });

                vm.showConfig = false;
                vm.mapWidth = "col-lg-12";
                vm.showConfigIcon = "Fahrzeugauswahl anzeigen";

            } else {
                vm.showConfig = true;
                vm.mapWidth = "col-lg-8";
                vm.showConfigIcon = "Fahrzeugauswahl ausblenden";
                $(mapId).animate({ width: "auto" },function() {
                    MapGoogleAbstractService.resizeMap();
                            setCenter(latestGeopositions);
                });
            }
        }

        // fügt dem Socket ein Kennzeichen hinzu, bzw. entfernt es
        function changeShowRegistrationNumber(registrationNumber) {
            if (registrationNumbers.indexOf(registrationNumber) > -1) {
                registrationNumbers.splice(registrationNumbers.indexOf(registrationNumber), 1);
            } else {
                registrationNumbers.push(registrationNumber);
            }
            LatestGeoposition = MapService.GetLatestGeopositionByRegistrationNumbers(registrationNumbers);
            mapIsInitialized = false;
        }

        // setzt den Haken, wenn ein Kennzeichen ausgewählt wurde bzw. abgewählt.
        function checkedRegistrationNumber(vehicleId, registrationNumber) {
            if (registrationNumbers.indexOf(registrationNumber) > -1 ||
                LatestGeoposition.length === vm.allRegistrationNumbersWithGeoposition.length) {               
                return true;
            } else {
              return false;
            }
        }

        // Mouseover-Listener für den MarkerClusterer wird gesetzt.
        MapGoogleAbstractService.setMouseoverListenerForMarkerClusterer();
        

        // Mouseout-Listener für den MarkerClusterer wird gesetzt.
        MapGoogleAbstractService.setMouseOutListenerForMarkerClusterer();

        // Click-Listener für den MarkerClusterer wird gesetzt.
        // Wenn das Cluster angeklickt wird soll das Tooltip geschlossen werden.
        MapGoogleAbstractService.setClickListenerForMarkerClusterer();

        // Löscht alle vorhandenen Marker.
        var removeMarkers = function(value) {
            while (markers.length) {
                markers.pop().setMap(null);
            }
        };

        // Listener wenn das Zoomlevel geändert wird.
        MapGoogleAbstractService.setZoomChangedListenerForMap();


        // Setzt alle Marker.
        var setMarkers = function (geopositions) {
            angular.forEach(geopositions, function (geoposition) {
                var marker = MapGoogleAbstractService.setMarker(geoposition.latitude,geoposition.longitude,geoposition.registrationNumber);

                MapGoogleAbstractService.setMarkerIsClicked(false);

                // Inhalt für Tooltip
                var content = "<div> Kennzeichen: " + geoposition.registrationNumber + "</div>";
                angular.forEach(geoposition.obdPropertyList, function (property) {
                    if (property.result === 'INVALID') {
                        content = content + "<div>" + property.property + ": " + property.result + "</div>"
                    } else {
                        content = content + "<div>" + property.property + " " + property.result + " " + property.unit + "</div>"
                    }
                });
                    
                // Wenn die Maus auf dem Marker liegt erscheint das Toolup.
                MapGoogleAbstractService.setMouseoverListenerForMarker(marker, content);

                // Wenn die Maus nicht mehr auf dem Marker liegt verschwindet das Toolup.
                MapGoogleAbstractService.setMouseoutListenerForMarker(marker);

                // Wenn der Marker angeklickt wird, bleibt das Toolup stehen.
                MapGoogleAbstractService.setClickListenerForMaker(marker);

                markers.push(marker);
            });
        };

        // Berechnet die Mitte aus allen Markern und setzt automatisch das Zoomlevel.
        var setCenter = function(geopositions) {

            MapGoogleAbstractService.setBound(geopositions);

            mapIsInitialized = true;
            latestGeopositions = geopositions;
        };

        // Hole Geodaten für alle Fahrzeuge.
        var LatestGeoposition = MapService.GetLatestGeopositionByRegistrationNumbers(vm.allRegistrationNumbersWithGeoposition);

        LatestGeoposition.promise.then(null, null, function(geopositions) {
            // Der Socket wird gestoppt wenn die URL nicht mehr übereinstimmt.
            if ($location.path() !== '/Map') {
                LatestGeoposition.remove();
            }

            removeMarkers();
            markerClusterer.clearMarkers();

            if (!mapIsInitialized) {
                setCenter(geopositions);
                markerClusterer.setOptions({
                    gridSize: 50,
                    styles: clusterStyles,
                    maxZoom: 19
                });
            }

            setMarkers(geopositions);
            markerClusterer.addMarkers(markers);
        });

        //Setzt die Tour auf die Karte. Ruft dabei den GoogleAbstractService auf.
        var setDirections = function (registrationNumber, vehicleId) {
            TourService.getCurrentTourByVehicleId(vehicleId).then(function (tour) {

                selectedTours = MapGoogleAbstractService.setDirectionForMapController(selectedTours, tour, registrationNumber, vehicleId);

            }, function (error) {
                if (error.status === 404) {
                    swal("Dem Fahrzeug ist heute keine Tour zugeordnet!", "" ,"error");
                    vehicleHasNoTour.push(vehicleId);
                }
            });
        }

        // Zeigt die Tour für ein bestimmtes Fahrzeug.
        function showTourOfSelectedVehicle(vehicleId, registrationNumber) {
            var tourIsInArray = false;
            if (selectedTours.length === 0) {
                setDirections(registrationNumber, vehicleId);
            } else {
                angular.forEach(selectedTours, function(tour, index) {
                    if (tour.vehicleId === vehicleId) {
                        tourIsInArray = true;
                        tour.directionsDisplays.setDirections({ routes: [] });
                        tour.poly.setMap(null);
                        selectedTours.splice(index, 1);
                        if (selectedTours.length != 0) {
                            MapGoogleAbstractService.setCenterOfPolylines(selectedTours);
                        }                        
                    }
                });
                if (!tourIsInArray) {
                    setDirections(registrationNumber, vehicleId);
                }
            }
        }

        // Prüft ob das Fahrzeug selektiert ist.
        function checkIfVehicleIsSelected(registrationNumber) {
            if (registrationNumbers.indexOf(registrationNumber) === -1) {
                return true;
            } else {
                return false;
            }
        };

        // Prüft ob das Fahrzeug noch selektiert ist, wenn nicht wird die dazugehörige Tour ausgeblendet.
        function uncheckVehicleIfTourIsSelected(registrationNumber, vehicleId) {
            if (registrationNumbers.indexOf(registrationNumber) === -1) {
                angular.forEach(selectedTours, function(tour, index) {
                    if (tour.vehicleId === vehicleId) {
                        tour.directionsDisplays.setDirections({ routes: [] });
                        tour.poly.setMap(null);
                        selectedTours.splice(index, 1);
                        if (selectedTours.length != 0) {
                            MapGoogleAbstractService.setCenterOfPolylines(selectedTours);
                        }
                        return false;
                    }
                });
            } else {
                return false;
            }
        };

        // Prüft ob einem Fahrzeug eine Tour zugeordnet ist.
        function checkIfVehicleHasNoTour(vehicleId) {
            if (vehicleHasNoTour.indexOf(vehicleId) === -1) {
                return false;
            } else {
                //return true;
            }
        }

        function checkIfVehicleHasNoTourToDisableButton(vehicleId) {
            if (vehicleHasNoTour.indexOf(vehicleId) === -1) {
                return false;
            } else {
                return true;
            }
        }
    }
})();