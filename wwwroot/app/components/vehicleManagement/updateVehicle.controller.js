(function() {
    'use strict';

    angular.module('app')
        .controller('UpdateVehicleController', UpdateVehicleController);

    UpdateVehicleController.$inject = ['allVehicleTypes', 'VehicleService','$location'];

    function UpdateVehicleController(allVehicleTypes, VehicleService, $location) {

        var vm = this;
       
        // Filter        
        vm.filter = { id: '' };
        vm.orderByField = 'Kennzeichen';
        vm.reverseSort = false;
        
        // Modells
        vm.allVehicleTypes = allVehicleTypes;
        vm.vehicletypeProperties = {};
        vm.allProperties = {};
        vm.vehicle = VehicleService.getVehicle();
        vm.vehicleBeforeEdit = angular.copy(vm.vehicle);
        vm.selectedVehicleType = _.find(allVehicleTypes, { 'Id': vm.vehicle.VehicleTypeId });
        vm.vehicleAlreadyExists = false;

        // Registrieren der Vehicle Funktionen
        vm.deleteVehicleById = deleteVehicleById;
        vm.updateVehicle = updateVehicle;
        

        // Registrieren Picture Funktionen
        vm.createPicture = createPicture;
        vm.discardPicture = discardPicture;


        // Registrieren der Abbruch Funktion
        vm.discardUpdate = discardUpdate;
        
        // Registrieren der Kennzeichenabfrage
        vm.vehicleWithRegistrationNumberExists = vehicleWithRegistrationNumberExists;

        //Abfrage an DB ob Kennzeichen schon vergeben ist
        function vehicleWithRegistrationNumberExists(registrationNumber) {
            VehicleService.fetchVehicleWithRegistrationNumber(registrationNumber)
            .then(function () {

                var vehicleWithRegistrationNumber = VehicleService.getVehicleWithRegistrationNumber();

                vm.vehicleAlreadyExists = (_.isNull(vehicleWithRegistrationNumber) ||
                        _.isUndefined(vehicleWithRegistrationNumber) ||
                        vm.vehicle.Id == vehicleWithRegistrationNumber.Id)
                    ? false
                    : true;
            });
        }

        // Methode um das hochgeladene Bild in der lokalen Variable vehicle zu speichern.
        // Aufruf des vehicleServices um das Fahrzeug im Service und in der Datenbank abzuspeichern.
        // Verstecken des Canvas Elements der View.
        function createPicture(img) {
            vm.vehicle.Picture = img;
            return VehicleService.savePicture(vm.vehicle).then(function () {
                document.getElementById("canvasContainer").className = "hidden";
            })
        }

        // Hochgeladenes Bild des zu updatenden Fahrzeugs verwerfen. 
        function discardPicture() {
            vm.vehicle.Picture = undefined;
        }

        // Methode um die Änderungen am Fahrzeug zu verwerfen.
        function discardUpdate() {
            vm.vehicle = vm.vehicleBeforeEdit;
            $location.path('/VehicleManagement');
        }

        // Updaten des selektierten Fahrzeugs. Der selektierte Fahrzeugtyp, das Fahrzeug und dessen Eigenschaften werden im vehicleService gesetzt.
        // Nach erfolgreichem Updaten des Fahrzeugs in der Datenbank, wird das Template showVehicle.html geladen.
        function updateVehicle() {
            if (vm.vehicleAlreadyExists == true) {
                swal("Das aktuelle Kennzeichen ist bereits vergeben!", "", "error");
                return;
            }
            for (var i = 0; i < vm.vehicle.Properties.length; i++) {
                if (_.isEmpty(vm.vehicle.Properties[i].Value)) {
                    vm.vehicle.Properties[i].Value = 0;
                }
            }
            console.log(vm.vehicle);
            VehicleService.setVehicleTypeId(vm.selectedVehicleType.Id);
            VehicleService.updateVehicle(vm.vehicle).then(function (updatedVehicle) {
                if (updatedVehicle !== undefined || updatedVehicle !== null) {
                    var vp = vm.vehicle.Properties;
                    VehicleService.setVehicle(updatedVehicle);
                    VehicleService.setVehicleProperties(vp);
                    vm.vehicle = VehicleService.getVehicle();
                    swal("Erfolgreich gespeichert!", "", "success");
                    $location.path('/VehicleManagement/showVehicle');
                } else {
                    swal("Interner Serverfehler!", "", "error");
                }
            });
        }

        // Löschen eines Fahzeugs durch Übergabe der Id des Fahrzeugs an den vehicleService. 
        // Nach erfolgreichem Löschen des Fahrzeugs in der Datenbank, wird das Template showAllVehicles.html geladen.
        function deleteVehicleById() {
            return VehicleService.deleteVehicleById(vm.vehicle.Id).then(function () {
                    VehicleService.setVehicle({});
                });
            //swal({
            //    title: "Soll diese Tour wirklich gelöscht werden?",
            //    text: "Die Tour kann nicht wiederhergestellt werden",
            //    type: "warning",
            //    showCancelButton: true,
            //    cancelButtonText: "Abbrechen",
            //    confirmButtonColor: "#DD6B55",
            //    confirmButtonText: "Löschen",
            //    closeOnConfirm: false
            //}, function () {
                
            //});

        }
    }
})();



    


    




