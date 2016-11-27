(function() {
    'use strict';

    angular.module('app')
        .controller('ShowAllVehiclesController', ShowAllVehiclesController);

    ShowAllVehiclesController.$inject = ['VehicleService','$location', '$templateCache'];

    function ShowAllVehiclesController(VehicleService, $location, $templateCache) {

        var vm = this;
        $templateCache.remove('/VehicleManagement/');
        // Filter zur Sortierung der Fahrzeugliste       
        vm.filter = { id: '' };
        vm.orderByField = 'Kennzeichen';
        vm.reverseSort = false;
        
        // Aufruf um aus dem vehicleService alle lokal gespeicherten Fahrzeuge zu erhalten.
        // Speichern in lokale Variable allVehicles.
        vm.allVehicles = VehicleService.getAllVehicles();
 
        // Registrieren der Vehicle Funktionen
        vm.selectVehicle = selectVehicle;

        // Selektiertes Fahrzeug wird im vehicleService gesetzt, die zum Fahrzeug gehörigen Eigenschaften geladen und im vehicleService gesetzt. 
        // Anschließend wird das Template showVehicle.html geladen.  
        function selectVehicle(selectedVehicle) {
            VehicleService.setVehicle(selectedVehicle);
            VehicleService.fetchAllVehiclePropertiesByVehicleId(selectedVehicle.Id).then(function (allVehicleProperties) {
                VehicleService.setVehicleProperties(allVehicleProperties);
                $location.path('/VehicleManagement/showVehicle');
            });
        }
    }
})();



    


    




