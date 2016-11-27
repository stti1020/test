(function () {
    'use strict';

    angular.module('app')
        .factory("PropertyService", PropertyService);

    PropertyService.$inject = ['Restangular'];

    function PropertyService(Restangular) {

        // Alle Funktionen, die der PropertyService bereitstellt.
        var service = {
            getAllProperties: getAllProperties
        };

        return service;

        // Methode, die mit der REST´-Schnittstelle /api/property/GetAllProperties des Back-Ends kommuniziert.
        // Lädt alle Eigenschaften áus der Datenbank.
        function getAllProperties() {
            return Restangular.all('/api/property/GetAllProperties').getList();
        }
    }
})();


