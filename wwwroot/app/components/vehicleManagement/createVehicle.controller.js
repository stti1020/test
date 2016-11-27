(function() {
    'use strict';

    angular.module('app')
        .controller('CreateVehicleController', CreateVehicleController);

    CreateVehicleController.$inject = ['allVehicleTypes', 'VehicleService', 'VehicleTypeService', 'PropertyService', '$location', '$scope', '$templateCache'];

    function CreateVehicleController(allVehicleTypes, VehicleService, VehicleTypeService, PropertyService, $location, $scope, $templateCache) {

        var vm = this;
        
        // Modells
        vm.allVehicleTypes = allVehicleTypes;
        vm.selectedVehicleType = undefined;
        vm.allProperties = {};
        vm.vehicle = {};
        vm.vehicleAlreadyExists;

        // Registrieren der Vehicle Funktionen
        vm.createVehicle = createVehicle;

        // Registrieren der VehicleType Funktionen
        vm.getAllVehicleTypePropertiesByVehicleTypeId = getAllVehicleTypePropertiesByVehicleTypeId;

        // Registrieren der Properties Funktionen
        vm.getAllProperties = getAllProperties;
        
        // Registrieren der Picture Funktionen
        vm.createPicture = createPicture;
        vm.discardPicture = discardPicture;

        // Registrieren der Kennzeichenabfrage
        vm.vehicleWithRegistrationNumberExists = vehicleWithRegistrationNumberExists;

        //Abfrage an DB ob Kennzeichen schon vergeben ist
        function vehicleWithRegistrationNumberExists(registrationNumber) {
            VehicleService.fetchVehicleWithRegistrationNumber(registrationNumber)
            .then(function () {
                
                var vehicleWithRegistrationNumber = VehicleService.getVehicleWithRegistrationNumber();
                   
                vm.vehicleAlreadyExists = (_.isNull(vehicleWithRegistrationNumber) ||
                     _.isUndefined(vehicleWithRegistrationNumber))
                 ? false
                 : true;

                
            });
        }

        // Zu erstellendes Fahrzeug wird in Variable vehicleToCreate angelegt, an den vehicleService übergeben und in der Datenbank gespeichert. 
        // Anschließend wird das Template showAllVehicles.html geladen.
        function createVehicle() {

            var vehicleToCreate =
            {
                VehicleTypeId: vm.selectedVehicleType.Id,
                RegistrationNumber: vm.vehicle.RegistrationNumber,
                Properties:
                    vm.allProperties
            };

            VehicleService.fetchVehicleWithRegistrationNumber(vehicleToCreate.RegistrationNumber)
                .then(function () {

                    var vehicleWithRegistrationNumber = VehicleService.getVehicleWithRegistrationNumber();

                    vm.vehicleAlreadyExists = (_.isNull(vehicleWithRegistrationNumber) ||
                            _.isUndefined(vehicleWithRegistrationNumber))
                        ? false
                        : true;

                    if (vm.vehicleAlreadyExists == true || _.isUndefined(vm.vehicleAlreadyExists)) {
                        swal("Das aktuelle Kennzeichen ist bereits vergeben!", "", "error");
                        return;
                    } else if (vm.selectedVehicleType === undefined) {
                        swal("Der Fahrzeugtyp muss angegeben werden!", "", "error");
                        return;
                    } else if (vm.vehicle.RegistrationNumber === undefined) {
                        swal("Das Kennzeichen muss angegeben werden!", "", "error");
                        return;
                    }

                    VehicleService.createVehicle(vehicleToCreate).then(function (createdVehicle) {
                        if (createdVehicle !== undefined || createdVehicle !== null) {
                            var fe = vm.allProperties;
                            vm.vehicle = createdVehicle;
                            vm.vehicle.Properties = fe;
                            $templateCache.remove('/VehicleManagement/');
                            VehicleService.addVehicleToArray(vm.vehicle, function () {
                                $templateCache.remove('/VehicleManagement/');
                                swal("Erfolgreich gespeichert!", "", "success");
                                $location.path('/VehicleManagement/');
                            });
                           
                        } else {
                            swal("Interner Serverfehler!", "", "error");
                        }
                    });
                });
        }

        // Methode um das hochgeladene Bild in die lokale Variable vehicle zu speichern.
        // Erwartet ein Bild als Parameter.
        // Versteckt das Canvas Element der View.
        function createPicture(img) {
            vm.vehicle.Picture = img;
            document.getElementById("canvasContainer").className = "hidden";
        }

        // Methode um das hochgeladene Bild zu verwerfen.
        function discardPicture() {
            vm.vehicle.Picture = undefined;
        }

        // Methode um alle Eigenschaften aus der Datenbank zu laden.
        // Speichert das Ergebnis in die lokale Variable allProperties.
        function getAllProperties() {
            return PropertyService.getAllProperties().then(function (allProperties) {
                vm.allProperties = allProperties;
            });
        }

        // Laden aller Eigenschaften eines Fahrzeugtyps durch Angabe der Id des Fahrzeugtyps. 
        // Speichert das Ergbis in die lokale Variable vehicletypeProperties.
        function getAllVehicleTypePropertiesByVehicleTypeId(vehicleTypeId) {
            return VehicleTypeService.getAllVehicleTypePropertiesByVehicleTypeId(vehicleTypeId).then(function (vehicletypeProperties) {
                vm.vehicletypeProperties = vehicletypeProperties;
            });
        }
    }
})();



    


    




