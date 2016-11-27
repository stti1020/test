(function () {
    'use strict';

    angular.module('app')
        .controller('CreateAndUpdateTourController', CreateAndUpdateTourController);


    CreateAndUpdateTourController.$inject = ['$location', 'TourService', 'allVehicles', 'allRoutes', '$cookies', '$routeParams', 'TourAndRouteGoogleAbstractService'];

    function CreateAndUpdateTourController($location, TourService, allVehicles, allRoutes, $cookies, $routeParams, TourAndRouteGoogleAbstractService) {
        var vm = this;
        vm.tour = TourService.getTour();

        // Pagination
        vm.selectedPage = "General";
        vm.showGeneralPage = true;
        vm.showRoutePage = false;
        vm.showVehiclesPage = false;
        vm.showSummaryPage = false;
        vm.selectPage = selectPage;
        vm.selectPrevPage = selectPrevPage;
        vm.selectNextPage = selectNextPage;

        // Allgemeines
        vm.selectedTourSeries = false;
        vm.selectTourSeries = selectTourSeries;
        vm.tourName = "";
        vm.tourStartDate = "";
        vm.tourSeriesStartDate = "";
        vm.tourSeriesEndDate = "";
        vm.tourSeriesInterval = "";
        vm.selectedDone = false;
        vm.selectDone = selectDone;

        // Routenauswahl
        var selectedRouteMapIsSelected = false;
        var summaryMapIsSelected = false;
        var draggable = false;
        var updatedRoute = false;       

        vm.allRoutes = allRoutes;
        vm.selectedRoute = undefined;
        vm.selectRoute = selectRoute;
        vm.selectedRouteIndex = undefined;
        vm.getIfSelected = getIfSelected;

        // Fahrzeugauswahl
        var tourVehicleIds = [];
        vm.tourVehicles = [];
        vm.allVehicles = allVehicles;
        vm.orderByField = 'Kennzeichen';
        vm.reverseSort = false;
        vm.checkVehicle = checkVehicle;
        vm.checkedVehicle = checkedVehicle;        

        // Zusammenfassung
        vm.saveTour = saveTour;
        vm.getCompletedValue = getCompletedValue;
        vm.selectedTourPrevVehicle = selectedTourPrevVehicle;
        vm.selectedTourNextVehicle = selectedTourNextVehicle;

        // Fahrzeuge der ausgewählten Tour.
        var vehicleCounter = 0;

        // Ermittlung des Titels für das Carousel des Fahrzeuges.
        function initializeCurrentVehicle() {
            if (vm.tourVehicles.length === 0) {
                vm.currentVehicle = "Keine Fahrzeuge ausgewählt!";
            } else {
                vm.currentVehicle = vm.tourVehicles[vehicleCounter].RegistrationNumber + " - " + vm.tourVehicles[vehicleCounter].VehicleType.Name;
            }
        }
        
        // Methode, um das vorherige Fahrzeug der Liste TourVehicles der ausgewählten Tour auszuwählen.
        function selectedTourPrevVehicle() {
            if (vehicleCounter === 0) {
                vehicleCounter = vm.tourVehicles.length - 1;
            } else if (vehicleCounter > 0) {
                vehicleCounter--;
            }
            vm.currentVehicle = vm.tourVehicles[vehicleCounter].RegistrationNumber + " - " + vm.tourVehicles[vehicleCounter].VehicleType.Name;
        }

        // Methode, um das nächste Fahrzeug der Liste TourVehicles der ausgewählten Tour auszuwählen.
        function selectedTourNextVehicle() {
            if (vehicleCounter < vm.tourVehicles.length - 1) {
                vehicleCounter++;
            } else if (vehicleCounter === vm.tourVehicles.length - 1) {
                vehicleCounter = 0;
            }
            vm.currentVehicle = vm.tourVehicles[vehicleCounter].RegistrationNumber + " - " + vm.tourVehicles[vehicleCounter].VehicleType.Name;
        }

        // Methode, um die ausgewählte Tour zu highlighten.
        function getIfSelected(id) {
            if (_.isUndefined(vm.selectedRoute)) {
                return '';
            } else {
                if (id === vm.selectedRoute.Id) {
                    return 'selected'
                }
            }
        }

        // Unterscheidung, ob es sich um eine Update einer Tour oder Tourserie handelt.
        if ($routeParams.update) {
            if ($routeParams.tourOrSeries === 'Touren' || $routeParams.tourOrSeries === 'Tourserien') {
                vm.tourName = vm.tour.Name;
                document.getElementById("tourSeriesCheckbox").disabled = true;
                if ($routeParams.tourOrSeries == 'Touren') {
                    vm.selectedTourSeries = false;
                    vm.tourStartDate = TourService.convertDateToGermanDateString(vm.tour.StartDate);
                    vm.selectedDone = vm.tour.Done;
                    $('#tourSeriesCheckbox').attr('disabled', true);                   
                } else {
                    vm.selectedTourSeries = true;
                    vm.tourSeriesStartDate = TourService.convertDateToGermanDateString(vm.tour.TourSeries.StartDate);
                    vm.tourSeriesEndDate = TourService.convertDateToGermanDateString(vm.tour.TourSeries.EndDate);
                    vm.tourSeriesInterval = vm.tour.TourSeries.DaysInterval;
                }

                selectRoute(vm.tour.Route);
                tourVehicleIds = [];
                vm.tourVehicles = [];

                angular.forEach(vm.tour.TourVehicles,function (tv) {
                    checkVehicle(tv.Vehicle);
                });

                initializeCurrentVehicle();
            }
        }

        // Methode um das Abgeschlossen-Attribut der Touren auf deutsche Werte zu wandeln.
        function getCompletedValue(completedValue) {
            if (_.isUndefined(completedValue) || _.isNull(completedValue)) {
                return;
            } else if (completedValue == true) {
                return "Ja";
            } else if (completedValue == false) {
                return "Nein";
            }
        }

        // Methode die auf ausgewählte Fahrzeuge prüft.
        function checkedVehicle(id) {
            var bool = true;
            if (tourVehicleIds.indexOf(id) < 0) {
                bool = false;
            }
            return bool;
        }

        // Methode, um Fahrzeuge auszuwählen.
        function checkVehicle(vehicle) {
            if (tourVehicleIds.indexOf(vehicle.Id) < 0) {
                tourVehicleIds.push(vehicle.Id);
                vm.tourVehicles.push(vehicle);
            } else {
                tourVehicleIds.splice(tourVehicleIds.indexOf(vehicle.Id), 1);
                vm.tourVehicles.splice(vm.tourVehicles.indexOf(vehicle), 1);
            }
            initializeCurrentVehicle();
        }    

        // Methode um eine Route auszuwählen.
        // Zeichnet die Route auf der Karte ein.
        function selectRoute(route) {
            vm.selectedRoute = route;
            var routeWaypoints = route.Waypoints;
            var waypoints = [];

            angular.forEach(routeWaypoints, function (rw) {
                waypoints.push({ 'location': rw.Name });
            });

            TourAndRouteGoogleAbstractService.buildRouteObject(route.StartName, route.DestinationName, waypoints);

            if (selectedRouteMapIsSelected && !$routeParams.update) {
                TourAndRouteGoogleAbstractService.setDirectionsWithoutCallback();
            }
            if (updatedRoute) {
                TourAndRouteGoogleAbstractService.setDirectionsWithoutCallback();
            }            
            if (summaryMapIsSelected) {
                summaryMapIsSelected = false;
            }
        }

        // Methode für die Checkbox 'Tourserie?' in der Zusammenfassung.
        // Gibt an ob es sich beim Erstellen einer Tour um eine Tour oder Tourserie handelt.
        function selectTourSeries() {
            vm.selectedTourSeries = !vm.selectedTourSeries;
        }

        // Methode für die Checkbox 'Abgeschlossen?' in der Zusammenfassung.
        // Gibt an ob die Tour bzw. Tourserie abgeschlossen ist.
        function selectDone() {
            vm.selectedDone = !vm.selectedDone;
        }

        // Auswahl-Methoden der Pagination.

        // Methode um die allgemeinen Einstellungen anzuzeigen.
        var selectGeneralPage = function () {
            vm.selectedPage = "General";
            vm.showGeneralPage = true;
            vm.showRoutePage = false;
            vm.showVehiclesPage = false;
            vm.showSummaryPage = false;
        };

        // Methode um die Route-Auswahl Seite anzuzeigen.
        var selectRoutePage = function () {
            vm.selectedPage = "Route";
            vm.showGeneralPage = false;
            vm.showRoutePage = true;
            vm.showVehiclesPage = false;
            vm.showSummaryPage = false;
        };

        // Methode um die Fahrzeug-Auswahl Seite anzuzeigen.
        var selectVehiclesPage = function () {
            vm.selectedPage = "Vehicles";
            vm.showGeneralPage = false;
            vm.showRoutePage = false;
            vm.showVehiclesPage = true;
            vm.showSummaryPage = false;
        };

        // Methode um die Zusammenfassungsseite anzuzeigen.
        var selectSummaryPage = function () {
            vm.selectedPage = "Summary";
            vm.showGeneralPage = false;
            vm.showRoutePage = false;
            vm.showVehiclesPage = false;
            vm.showSummaryPage = true;
        };

        // Methode, um zwischen den einzelnen Seiten der Pagination zu wechseln.
        // Erwartet einen String als Parameter.
        // Entscheidet anhand des Parameters welche Seite angezeigt wird.
        function selectPage(page) {
            if (page === "General") {
                selectGeneralPage();
            } else if (page === "Route") {
                if (!selectedRouteMapIsSelected && !$routeParams.update) {
                    var routeMapObject = document.getElementById('selectedRouteMap');
                    TourAndRouteGoogleAbstractService.setMap(routeMapObject);
                    TourAndRouteGoogleAbstractService.setDirectionService(draggable);
                    selectedRouteMapIsSelected = true;
                } else if (!selectedRouteMapIsSelected && $routeParams.update) {
                    var routeMapObject = document.getElementById('selectedRouteMap');
                    TourAndRouteGoogleAbstractService.setMap(routeMapObject);
                    TourAndRouteGoogleAbstractService.setDirectionService(draggable);
                    TourAndRouteGoogleAbstractService.setDirectionsWithCallback(function (response) {
                        TourAndRouteGoogleAbstractService.setCenter(response.routes[0].legs, false);
                    });
                    selectedRouteMapIsSelected = true;
                    updatedRoute = true;
                }                
                selectRoutePage();
            } else if (page === "Vehicles") {
                selectVehiclesPage();
            } else {
                selectSummaryPage();
                if (vm.selectedRoute === undefined && summaryMapIsSelected === false) {
                    var summaryMapObject = document.getElementById('selectedSummaryMap');
                    TourAndRouteGoogleAbstractService.setSecondMap(summaryMapObject);
                    summaryMapIsSelected = true;
                } else if (!summaryMapIsSelected) {
                    var summaryMapObject = document.getElementById('selectedSummaryMap');
                    TourAndRouteGoogleAbstractService.setSecondMap(summaryMapObject);
                    TourAndRouteGoogleAbstractService.setSecondDirectionService(draggable);
                    TourAndRouteGoogleAbstractService.setDirectionsForSecondMap(function (response) {
                        TourAndRouteGoogleAbstractService.setCenter(response, true);
                    });
                    summaryMapIsSelected = true;
                }                
            }
        }

        // Methode, um die vorherige Seite der Pagination zu laden.
        function selectPrevPage() {
            if (vm.selectedPage === "Summary") {
                vm.selectedPage = "Vehicles";
                selectVehiclesPage();           
            } else if (vm.selectedPage === "Vehicles") {
                if (!selectedRouteMapIsSelected && !$routeParams.update) {
                    var routeMapObject = document.getElementById('selectedRouteMap');
                    TourAndRouteGoogleAbstractService.setMap(routeMapObject);
                    TourAndRouteGoogleAbstractService.setDirectionService(draggable);
                    selectedRouteMapIsSelected = true;
                } else if (!selectedRouteMapIsSelected && $routeParams.update) {
                    var routeMapObject = document.getElementById('selectedRouteMap');
                    TourAndRouteGoogleAbstractService.setMap(routeMapObject);
                    TourAndRouteGoogleAbstractService.setDirectionService(draggable);
                    TourAndRouteGoogleAbstractService.setDirectionsWithCallback(function (response) {
                        TourAndRouteGoogleAbstractService.setCenter(response, false);
                    });
                    selectedRouteMapIsSelected = true;
                    updatedRoute = true;
                }
                vm.selectedPage = "Route";
                selectRoutePage();
            } else {
                vm.selectedPage = "General";
                selectGeneralPage();
            }
        }

        // Methode, um die nächste Seite der Pagination zu laden.
        function selectNextPage() {
            if (vm.selectedPage === "General") {
                if (!selectedRouteMapIsSelected && !$routeParams.update) {
                    var routeMapObject = document.getElementById('selectedRouteMap');
                    TourAndRouteGoogleAbstractService.setMap(routeMapObject);
                    TourAndRouteGoogleAbstractService.setDirectionService(draggable);
                    selectedRouteMapIsSelected = true;
                } else if (!selectedRouteMapIsSelected && $routeParams.update) {
                    var routeMapObject = document.getElementById('selectedRouteMap');
                    TourAndRouteGoogleAbstractService.setMap(routeMapObject);
                    TourAndRouteGoogleAbstractService.setDirectionService(draggable);
                    TourAndRouteGoogleAbstractService.setDirectionsWithCallback(function (response) {
                        TourAndRouteGoogleAbstractService.setCenter(response, false);
                    });
                    selectedRouteMapIsSelected = true;
                    updatedRoute = true;
                }
                vm.selectedPage = "Route";
                selectRoutePage();
            } else if (vm.selectedPage === "Route") {
                vm.selectedPage = "Vehicles";
                selectVehiclesPage();
            } else {
                if (vm.selectedRoute === undefined && summaryMapIsSelected === false) {
                    var summaryMapObject = document.getElementById('selectedSummaryMap');
                    TourAndRouteGoogleAbstractService.setSecondMap(summaryMapObject);
                    summaryMapIsSelected = true;
                } else if (summaryMapIsSelected === false) {
                    var summaryMapObject = document.getElementById('selectedSummaryMap');
                    TourAndRouteGoogleAbstractService.setSecondMap(summaryMapObject);
                    TourAndRouteGoogleAbstractService.setSecondDirectionService(draggable);
                    TourAndRouteGoogleAbstractService.setDirectionsForSecondMap(function (response) {
                        TourAndRouteGoogleAbstractService.setCenter(response, true);
                    });
                    summaryMapIsSelected = true;
                } 
                vm.selectedPage = "Summary";
                selectSummaryPage();
            }
        }

        // Methode, um den Namen einer Tour zu validieren.
        function validateTourName(name) {
            if (name === undefined || name.length < 1) {
                return false;
            } else {
                return true;
            }
        }

        // Methode, um ein Datum in deutschem Format zu validieren.
        function validateGermanDate(germanDate) {
            if (germanDate === undefined || germanDate === "") {
                return false;
            }

            var maxTageDerMonate = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            var datesplitted = germanDate.split(".");

            var day;
            if (datesplitted[0][0] == 0) {
                day = parseInt(datesplitted[1][1]);
            } else {
                day = parseInt(datesplitted[1]);
            }

            var month;
            if (datesplitted[1][0] == 0) {
                month = parseInt(datesplitted[1][1]);
            } else {
                month = parseInt(datesplitted[1]);
            }

            if (datesplitted.length === 3 &&
                datesplitted[0].length === 2 &&
                datesplitted[1].length === 2 &&
                datesplitted[2].length === 4) {
                if (day < 1 ||
                    day > maxTageDerMonate[month - 1] ||
                    month < 1 ||
                    month > 12) {
                    return false;
                }
                return true;
            } else {
                return false;
            }
        }

        // Methode, um ein Datumszeitraum zu validieren.
        function validateDateRange(germanStartDate, germanEndDate) {
            var startDate = germanStartDate.split(".");
            var endDate = germanEndDate.split(".");

            var dayStart;
            if (startDate[0][0] == 0) {
                dayStart = parseInt(startDate[0][1]);
            } else {
                dayStart = parseInt(startDate[0]);
            }

            var dayEnd;
            if (endDate[0][0] == 0) {
                dayEnd = parseInt(endDate[0][1]);
            } else {
                dayEnd = parseInt(endDate[0]);
            }

            var monthStart;
            if (startDate[1][0] == 0) {
                monthStart = parseInt(startDate[1][1]);
            } else {
                monthStart = parseInt(startDate[1]);
            }

            var monthEnd;
            if (endDate[1][0] == 0) {
                monthEnd = parseInt(endDate[1][1]);
            } else {
                monthEnd = parseInt(endDate[1]);
            }

            var yearStart = parseInt(startDate[2]);
            var yearEnd = parseInt(endDate[2]);

            if (yearStart > yearEnd) {
                return false;
            } else if (yearStart === yearEnd && monthStart > monthEnd) {
                return false;
            } else if (yearStart === yearEnd && monthStart === monthEnd && dayStart > dayEnd) {
                return false;
            } else {
                return true;
            }
        }

        // Methode, um die übergebene Route zu validieren.
        // Erwartet eine Routen Objekt als Parameter.
        function validateSelectedRoute(route) {
            if (vm.selectedRoute !== undefined) {
                return true;
            } else {
                return false;
            }
        }

        // Methode, um eine Tour zu validieren.
        function validateTour() {
            if (!validateTourName(vm.tourName) || !validateSelectedRoute(vm.selectedRoute)) {
                return false;
            }
           
            if (vm.selectedTourSeries) {
                if (!validateGermanDate(vm.tourSeriesStartDate)) {
                    return false;
                }  else if (!validateGermanDate(vm.tourSeriesEndDate)) {
                    return false;
                } else if (!validateDateRange(vm.tourSeriesStartDate, vm.tourSeriesEndDate)) {
                    return false;
                }
            } else {
                if (!validateGermanDate(vm.tourStartDate)) {
                    return false;
                }         
            }
            return true;
        }

        // Methode um eine Tour in der Datenbank zu speichern.
        function saveTour() {
            if (validateTour()) {
                if (vm.selectedTourSeries) {
                    if ($routeParams.update) {
                        var tourSeriesObject = {
                            Id: vm.tour.TourSeries.Id,
                            Name: vm.tourName,
                            StartDate: TourService.convertGermanDateStringToDate(vm.tourSeriesStartDate),
                            EndDate: TourService.convertGermanDateStringToDate(vm.tourSeriesEndDate),
                            DaysInterval: vm.tourSeriesInterval,
                            RouteId: vm.selectedRoute.Id
                        };
                        var tourObject = {
                            Id: vm.tour.Id,
                            Name: vm.tourName,
                            Done: vm.selectedDone,
                            RouteId: vm.selectedRoute.Id
                        };
                    } else {
                        var tourSeriesObject = {
                            Id: 0,
                            Name: vm.tourName,
                            StartDate: TourService.convertGermanDateStringToDate(vm.tourSeriesStartDate),
                            EndDate: TourService.convertGermanDateStringToDate(vm.tourSeriesEndDate),
                            DaysInterval: vm.tourSeriesInterval,
                            RouteId: vm.selectedRoute.Id
                        };
                        var tourObject = {
                            Id: 0,
                            Name: vm.tourName,
                            Done: vm.selectedDone,
                            RouteId: vm.selectedRoute.Id
                        };
                    }
                } else {
                    var tourSeriesObject = null;
                    
                    if ($routeParams.update) {
                        var tourObject = {
                            Id: vm.tour.Id,
                            Name: vm.tourName,
                            StartDate: TourService.convertGermanDateStringToDate(vm.tourStartDate),
                            Done: vm.selectedDone,
                            RouteId: vm.selectedRoute.Id
                        };
                    } else {
                        var tourObject = {
                            Id: 0,
                            Name: vm.tourName,
                            StartDate: TourService.convertGermanDateStringToDate(vm.tourStartDate),
                            Done: vm.selectedDone,
                            RouteId: vm.selectedRoute.Id
                        };
                    }                 
                }
                return TourService.createAndUpdateTour(tourObject, tourSeriesObject, tourVehicleIds);
            } else {              
                 swal("Konnte nicht gespeichert werden!", "Es müssen alle Eingabefelder ausgefüllt sein und eine Route ausgewählt sein.", "error");
            }
        }

        // Initialisierung des Datepickers.
        $(document).ready(function () {
            $.fn.datepicker.dates['de'] = {
                days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                daysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                daysMin: ["So", "Mo", "Di", "´Mi", "Do", "Fr", "Sa"],
                months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
                today: "Heute",
                clear: "Löschen",
                format: "dd.mm.yyyy",
                titleFormat: "MM yyyy",
                weekStart: 1
            };

            var datepickerOptions = {
                autoclose: true,
                clearBtn: true,
                language: "de"
            };

            $('#datepickerStartDate').datepicker(datepickerOptions).datepicker('setDate', new Date());
            $('#datepickerFrom').datepicker(datepickerOptions).datepicker('setDate', new Date());
            $('#datepickerTo').datepicker(datepickerOptions).datepicker('setDate', new Date());
        });

    }
})();
 