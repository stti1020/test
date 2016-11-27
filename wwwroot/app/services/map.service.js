(function () {
    'use strict';

    angular.module('app')
        .factory("MapService", MapService);

    MapService.$inject = ['Restangular', 'poller'];

    function MapService(Restangular, poller) {
        var allRegistrationNumbersWithGeoposition;

        var service = {
            GetLatestGeopositionByRegistrationNumber: getLatestGeopositionByRegistrationNumber,
            GetAllLatestGeopositions: getAllLatestGeopositions,
            GetLatestGeopositionByRegistrationNumbers: getLatestGeopositionByRegistrationNumbers,
            GetAllRegistrationNumbersWithGeoposition: getAllRegistrationNumbersWithGeoposition,
            GetAllGeopositionsByRegistrationNumber: getAllGeopositionsByRegistrationNumber,
            GetGeopositionsForSimulationByRegistrationNumber: getGeopositionsForSimulationByRegistrationNumber
        };
        return service;

        // Holt die letzte Position eines bestimmten Fahrzeuges.
        function getLatestGeopositionByRegistrationNumber(registrationNumber) {
            var geoposition = poller.get('/api/map/GetLatestGeopositionByRegistrationNumber', {
                delay: 6000,
                action: 'jsonp',
                argumentsArray: [
                    {           
                         registrationNumber: registrationNumber                      
                    }
                ]
            });
            return geoposition;
        };

        // Holt alle 6 Sekunden die letzten Positionen aller Fahrzeuge.
        function getAllLatestGeopositions() {
            var geoposition = poller.get('/api/map/GetAllLatestGeopositions', {
                delay: 6000
            });
            return geoposition;
        };

        // Holt alle 6 Sekunden die letzten Positionen aller Fahrzeuge anhand des Kennzeichens.
        function getLatestGeopositionByRegistrationNumbers(regNumbersArray) {
            var registrationNumbers = "";
            if (regNumbersArray.length !== 0) {
                registrationNumbers = JSON.stringify(regNumbersArray);
            }
            var myPoller = poller.get(Restangular.one('/api/map/GetLatestGeopositionByRegistrationNumbers'), {
                action: 'get',
                delay: 6000,
                argumentsArray: [
                    {
                        registrationNumbers: registrationNumbers
                    }
                ]
            });
            return myPoller;
        };

        // Holt alle Kennzeichen mit deren Positionen.
        function getAllRegistrationNumbersWithGeoposition() {
            return Restangular.all('/api/map/GetAllRegistrationNumbersWithGeoposition').getList().then(function (allRegistrationNumbersResponse) {
                return allRegistrationNumbersWithGeoposition = allRegistrationNumbersResponse;
            });
        }

        // Holt alle Positionen eines Fahrzeugs anhand seines Kennzeichens.
        function getAllGeopositionsByRegistrationNumber(registrationNumber) {
            return Restangular.all('/api/map').customGET("GetAllGeopositionsByRegistrationNumber", { registrationNumber: registrationNumber });
        }

        // Holt alle Positionen eines Fahzeuges anhand seines Kennzeichens für die Simulation.
        function getGeopositionsForSimulationByRegistrationNumber(registrationNumber) {
            return Restangular.all('/api/map').customGET("GetGeopositionsForSimulationByRegistrationNumber", { registrationNumber: registrationNumber });
        }

    }
})();


