(function() {
    'use strict';

    angular.module('app')
        .controller('ShowVehicleController', ShowVehicleController);

    ShowVehicleController.$inject = ['VehicleService', '$location', '$cookies'];

    function ShowVehicleController(VehicleService, $location, $cookies) {

        var vm = this;
        
        // Modells
        vm.vehicle = VehicleService.getVehicle();    
        
        // Selektiertes Fahrzeug wird in Cookie gespeichert, falls das Template showVehicle.html neu geladen wird,
        $cookies.putObject('selectedVehicle', {Id: vm.vehicle.Id, VehicleTypeId: vm.vehicle.VehicleTypeId, RegistrationNumber: vm.vehicle.RegistrationNumber, VehicleType: vm.vehicle.VehicleType, Properties: vm.vehicle.Properties});
       
        // Registrieren der Vehicle Funktionen
        vm.editVehicle = editVehicle;
        vm.deleteVehicleById = deleteVehicleById;

        // VehcileTypeId des zum Editieren selektierten Fahrzeuges wird im VehicleService gesetzt.
        // Anschließend wird das Template updateVehicle.html geladen.
        function editVehicle() {
            VehicleService.setVehicleTypeId(vm.vehicle.VehicleTypeId);
            $location.path('/VehicleManagement/updateVehicle');
        }

        // Id wird zum Löschen an den vehicleService übergeben.
        // Nach erfolgreichem Löschen in der Datenbank, wird das vehicle im vehicleService gelöscht und das Template showAllVehicles.html geladen. 
        function deleteVehicleById() {
            //return VehicleService.deleteVehicleById(vm.vehicle.Id).then(function () {
            //    //VehicleService.setVehicle({});
            //    //$location.path('/VehicleManagement');
            //});
            return VehicleService.deleteVehicleById(vm.vehicle.Id);
        }
    }
})();



    


    




