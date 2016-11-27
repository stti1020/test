(function() {
    'use strict';

    angular.module('app')
        .controller('ShowAllToursController', ShowAllToursController);


    ShowAllToursController.$inject = ['$location', '$scope', 'TourService', 'allToursByDateRange', '$cookies', 'TourAndRouteGoogleAbstractService'];

    function ShowAllToursController($location, $scope, TourService, allToursByDateRange, $cookies, TourAndRouteGoogleAbstractService) {

        var vm = this;
        vm.allToursByDateRange = allToursByDateRange;
        vm.allTourSeriesByDateRange = [];

        var tourSeriesIds = [];
        var mapObject = document.getElementById('selectedTourMap');
        var draggable = false;

        // Initialisierung der Map.
        TourAndRouteGoogleAbstractService.setMap(mapObject);
        TourAndRouteGoogleAbstractService.setDirectionService(draggable);


        // Funktionen für Umwandlung der Anzeigewerte für Archiviert.
        vm.getCompletedValue = getCompletedValue;

        // Funktionen für Umwandlung der Anzeigewerte für Startdatum.
        vm.getDataValue = getDateValue;

        // Funktion zum Löschen einer Tour.
        vm.deleteTour = deleteTour;
        vm.getSelectedTour = getSelectedTour;

        // Filter
        vm.orderToursFieldBy = 'Name';
        vm.reverseSort = false;

        // Dropdown für Tour-Serie.
        vm.tourOrSeriesFilter = "Touren";
        vm.selectTourOrSeries = selectTourOrSeries;

        vm.selectedTour = undefined;
        vm.selectTour = selectTour;
        vm.dateFrom = TourService.convertDateToGermanDateString(new Date());
        vm.dateTo = TourService.convertDateToGermanDateString(new Date());

        vm.getIfSelected = getIfSelected;

        vm.filter = filter;
        vm.updateTour = updateTour;

        // Fahrzeuge der ausgewählten Tour.
        var vehicleCounter = 0;
        vm.currentVehicle = "Keine Tour ausgewählt!";
        vm.selectedTourPrevVehicle = selectedTourPrevVehicle;
        vm.selectedTourNextVehicle = selectedTourNextVehicle;

        // Methode, um das vorherige Fahrzeug der Liste TourVehicles der ausgewählten Tour auszuwählen.
        function selectedTourPrevVehicle() {
            if (vehicleCounter === 0) {
                vehicleCounter = vm.selectedTour.TourVehicles.length - 1;
            } else if (vehicleCounter > 0) {
                vehicleCounter--;
            }
            vm.currentVehicle = vm.selectedTour.TourVehicles[vehicleCounter].Vehicle.RegistrationNumber + " - " + vm.selectedTour.TourVehicles[vehicleCounter].Vehicle.VehicleType.Name;
        }

        // Methode, um das nächste Fahrzeug der Liste TourVehicles der ausgewählten Tour auszuwählen.
        function selectedTourNextVehicle() {
            if (vehicleCounter < vm.selectedTour.TourVehicles.length - 1) {
                vehicleCounter++;
            } else if (vehicleCounter === vm.selectedTour.TourVehicles.length -1) {
                vehicleCounter = 0;
            }
            vm.currentVehicle = vm.selectedTour.TourVehicles[vehicleCounter].Vehicle.RegistrationNumber + " - " + vm.selectedTour.TourVehicles[vehicleCounter].Vehicle.VehicleType.Name;
        }

        // Methode, um die ausgewählte Tour zu highlighten.
        function getIfSelected(id) {
            if (_.isUndefined(vm.selectedTour)) {
                return '';
            } else {
                if (id == vm.selectedTour.Id) {
                    return 'selected'
                }
            }
        }

        // Methode, um die momentan ausgewählte Tour aus dem tourService zu erhalten.
        function getSelectedTour() {
            return TourService.getTour();
        }

        // Löscht die ausgewählte Tour.
        function deleteTour() {
            // Hier bekommt man die aktuell ausgewählte Tour.
            // Wenn Tourseries id null ist, dann handelt es sich nicht um eine Tour einer Tourserie.
            if (_.isNull(getSelectedTour())) {
                return;
            } else if (vm.tourOrSeriesFilter == 'Touren') {
                swal({
                    title: "Soll diese Tour wirklich gelöscht werden?",
                    text: "Die Tour kann nicht wiederhergestellt werden.",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Abbrechen",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Löschen",
                    closeOnConfirm: false
                }, function () {
                    TourService.deleteTourById(getSelectedTour().Id).then(function(success) {
                        if (success === true) {
                            vm.allToursByDateRange = _.remove(vm.allToursByDateRange, function (tour) {
                                if (tour !== vm.selectedTour) {
                                    return tour;
                                }
                            });
                            vm.selectedTour = undefined;
                            swal({
                                title: "Erfolgreich gelöscht!",
                                type: "success",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                        } else {
                            swal("Interner Serverfehler!", "", "error");
                        }
                    }, function(error) {
                        swal("Interner Serverfehler!", "", "error");
                    });
                });
                
            } else {
                swal({
                    title: "Soll diese Tourserie wirklich gelöscht werden?",
                    text: "Die Tourserie kann nicht wiederhergestellt werden",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Abbrechen",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Löschen",
                    closeOnConfirm: false
                }, function () {
                    TourService.deleteTourSeriesById(getSelectedTour().TourSeriesId).then(function(success) {
                        vm.allTourSeriesByDateRange = _.remove(vm.allTourSeriesByDateRange, function (tourSerie) {
                            if (tourSerie !== vm.selectedTour) {
                                return tourSerie;
                            }
                        });
                        vm.selectedTour = undefined;
                        if (success === true) {
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
                        swal("Interner Serverfehler!", "", "error");
                    });
                });
            }
        }

        // Gibt das Startdatum in deutschem Format zurück.
        function getDateValue(startDate) {
            return TourService.convertDateToGermanDateString(startDate);
        }

        // Gibt "Ja" zurück wenn die Tour absolviert wurde und "Nein" wenn sie noch nicht absolviert wurde.
        function getCompletedValue(completedValue) {
            if (_.isUndefined(completedValue) || _.isNull(completedValue)) {
                return;
            } else if (completedValue == true) {
                return "Ja";
            } else if (completedValue == false) {
                return "Nein";
            }
        }

        // Listener für den Datepicker, wird aufgerufen sobald sich ein Datum im Datepicker ändert.
        // Lädt die Touren für den angegeben Zeitraum.
        function filter() {
            
            var convertedDateFrom = TourService.convertGermanDateStringToDate(vm.dateFrom);
            var convertedDateTo = TourService.convertGermanDateStringToDate(vm.dateTo);
            TourService.fetchAllToursByDateRange(convertedDateFrom, convertedDateTo).then(function(result) {
                vm.allToursByDateRange = result;
                angular.forEach(vm.allToursByDateRange, function(tour) {
                    if (tour.TourSeries !== null && tourSeriesIds.indexOf(tour.TourSeries.Id) < 0) {
                        vm.allTourSeriesByDateRange.push(tour);
                        tourSeriesIds.push(tour.TourSeries.Id);
                    }
                });
            });
                       
        }

        // Methode, um die ausgewählte Tour in der Karte einzuzeichnen und deren Fahrzeuge anzuzeigen.
        function selectTour(tour) {
            vm.selectedTour = tour;
            if (vm.selectedTour.TourVehicles.length === 0) {
                vm.currentVehicle = "Keine Fahrzeuge zugeordnet!";
            } else {
                vm.currentVehicle = vm.selectedTour.TourVehicles[0].Vehicle.RegistrationNumber + " - " + vm.selectedTour.TourVehicles[vehicleCounter].Vehicle.VehicleType.Name;
                vehicleCounter = 0;
            }
            var routeWaypoints = tour.Route.Waypoints;
            var waypoints = [];

            angular.forEach(routeWaypoints, function (rw) {
                waypoints.push({ 'location': rw.Name });
            });

            TourAndRouteGoogleAbstractService.buildRouteObject(tour.Route.StartName,tour.Route.DestinationName,waypoints);
            TourService.setTour(tour);
            $cookies.putObject('selectedTour', tour);
            TourAndRouteGoogleAbstractService.setDirectionsWithoutCallback();
        }

        // Methode, um die ausgewählte Tour zu bearbeiten.
        // Leitet den Benutzer auf createOrUpdateTour.html weiter.
        function updateTour() {
            if (vm.selectedTour) {
                $location.path('/TourManagement/createAndUpdateTour/true/' + vm.tourOrSeriesFilter);
            }
        }

        // Wird aufgerufen wenn sich der Wert in der Dropdown auf 'TourSeries' ändert.
        // Lädt alle Tourserien und zeigt diese in der Liste an.
        function selectTourOrSeries(value) {
            vm.tourOrSeriesFilter = value;
            angular.forEach(vm.allToursByDateRange, function (tour) {
                if (tour.TourSeries !== null && tourSeriesIds.indexOf(tour.TourSeries.Id) < 0) {
                    vm.allTourSeriesByDateRange.push(tour);
                    tourSeriesIds.push(tour.TourSeries.Id);
                }
            });
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
                language: "de",
                startDate: '01/01/2015',
                endDate: '+5y',
            };
            $('#datepickerFrom').datepicker(datepickerOptions).datepicker('setDate', new Date());
            $('#datepickerTo').datepicker(datepickerOptions).datepicker('setDate', new Date());

        });
    }
})();