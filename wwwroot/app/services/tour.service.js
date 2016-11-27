(function () {
    'use strict';

    angular.module('app')
        .factory("TourService", TourService);

    TourService.$inject = ['Restangular', '$cookies', '$http', '$location'];

    function TourService(Restangular, $cookies, $http, $location) {
        var allToursByRange;
        var tour;

        var service = {
            fetchAllToursByDateRange: fetchAllToursByDateRange,
            createAndUpdateTour: createAndUpdateTour,
            setTour: setTour,
            getTour: getTour,
            convertGermanDateStringToDate: convertGermanDateStringToDate,
            convertDateToGermanDateString: convertDateToGermanDateString,
            getCurrentTourByVehicleId: getCurrentTourByVehicleId,
            deleteTourById: deleteTourById,
            deleteTourSeriesById: deleteTourSeriesById

        };

        return service;

        // Methode, um eine Tour anhand seiner Id aus der Datenbank zu löschen.
        // Erwartet eine Id als Parameter.
        function deleteTourById(id) {
            return Restangular.all('api/tour').customDELETE("DeleteTourById", { id: id });
        }

        // Methode, um eine Tourserie aus der Datenbank zu löschen.
        // Erwartet eine Id als Parameter.
        function deleteTourSeriesById(id) {
            return Restangular.all('api/tourSeries').customDELETE("DeleteTourSeriesById", { id: id });         
        }

        // Methode, um alle Touren innerhalb der angegebenen Zeitpsanne aus der Datenbank zu laden.
        // Erwartet ein Startdatum und ein Enddatum als Parameter.
        function fetchAllToursByDateRange(dateFrom, dateTo) {
            return Restangular.all('/api/tour').customGET("GetAllToursByDateRange", { rangeFrom: dateFrom, rangeTo: dateTo });
        }

        // Methode, um eine Tour in der Datenbank abzuspeichern oder eine bestehende Tour zu ändern.
        function createAndUpdateTour(tour, tourSeries, tourVehicles) {
            var parameter = JSON.stringify({ Tour: tour, TourSeries: tourSeries, VehicleIds: tourVehicles });
            return Restangular.all('/api/tour').customPOST({ name: "" }, "CreateAndUpdateTour", { json: parameter }).then(
                function (success) {
                    if (success === true) {
                        swal("Erfolgreich gespeichert!", "", "success");
                        $location.path('/TourManagement');
                    } else {
                        swal("Interner Serverfehler!", "", "error");
                    }
                },
                function (error) {
                    swal("Interner Serverfehler!", "", "error");
                });
        }

        // Methode um die aktuelle lokal gepeicherte Tour aus dem Service zu erhalten.
        function getTour () {
            if (_.isEmpty(tour) || _.isUndefined(tour)) {
                tour = $cookies.getObject('selectedTour');
            }
            return tour;
        }

        // Methode um die aktuell im Service gespeicherte Tour zu ändern.
        function setTour(newTour) {
            tour = newTour;
        }

        // Methode, um ein Datum mit deutschem Datumsformat in ein Date-Objekt zu wandeln.
        function convertGermanDateStringToDate(dateString) {
            var date = String(dateString);
            var splittedDate = date.split('.');
            return splittedDate[2] + '-' + splittedDate[1] + '-' + splittedDate[0];
        }

        // Methode, um ein Date-Objekt in ein Datum mit deutschem Datumsformat zu wandeln.
        function convertDateToGermanDateString(date) {
            var dateObject = new Date(date);
            var germanDay = dateObject.getDate();
            var germanMonth = dateObject.getMonth() + 1;
            if (germanDay <= 9) {
                germanDay = '0' + germanDay;
            }
            if (germanMonth <= 9) {
                germanMonth = '0' + germanMonth;
            }
            var germanDate = germanDay + '.' + germanMonth + '.' + dateObject.getFullYear();
            return germanDate;
        }

        // Methode, um eine Tour anhand seiner Id aus der Datenbank zu laden.
        // Erwartet eine Id als Parameter.
        function getCurrentTourByVehicleId(id) {
            return Restangular.all('api/tour').customGET("GetCurrentTourByVehicleId", {vehicleId: id });
        }

    }
})();


