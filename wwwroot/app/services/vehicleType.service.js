(function() {
    'use strict';

    angular.module('app')
        .factory("VehicleTypeService", VehicleTypeService);

    VehicleTypeService.$inject = ['Restangular'];

    function VehicleTypeService(Restangular) {

        // Alle Funktionen, die der VehicleTypeService bereitstellt.
        var service = {
            fetchAllVehicleTypes: fetchAllVehicleTypes
        };

        return service;

        // Methode, die mit der REST-Schnittstelle /api/VehicleType/getAllVehicleTypes des Back-Ends kommuniziert.
        // Lädt alle Fahrzeugtypen aus der Datenbank.
        function fetchAllVehicleTypes() {
            return Restangular.all('/api/VehicleType/getAllVehicleTypes').getList();
        }
    }
})();


