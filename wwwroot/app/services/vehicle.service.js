(function() {
    'use strict';

    angular.module('app')
        .factory("VehicleService", VehicleService);

    VehicleService.$inject = ['Restangular', '$cookies','$location'];

    function VehicleService(Restangular, $cookies,$location) {

        // Modells
        var allVehicles;
        var vehicle;
        var vehicleWithRegistrationNumber;


        // Alle Funktionen, die der VehicleService bereitstellt.
        var service = {
            fetchAllVehicles: fetchAllVehicles,
            fetchVehicleById: fetchVehicleById,
            fetchAllVehiclePropertiesByVehicleId: fetchAllVehiclePropertiesByVehicleId,
            deleteVehicleById: deleteVehicleById,
            updateVehicle: updateVehicle,
            createVehicle: createVehicle,
            getAllVehicles: getAllVehicles,
            getVehicle: getVehicle,
            setVehicle: setVehicle,
            setVehicleProperties: setVehicleProperties,
            setVehicleTypeId: setVehicleTypeId,
            getVehicleWithRegistrationNumber: getVehicleWithRegistrationNumber,
            savePicture: savePicture,
            fetchVehicleWithRegistrationNumber: fetchVehicleWithRegistrationNumber
        };

        return service;

        // Gibt Fahrzeug mit überprüftem Kennzeichen zurück
        function getVehicleWithRegistrationNumber() {
            return vehicleWithRegistrationNumber;
        }

        // Setzt das Fahrzeug mit überprüftem Kennzeichen
        function setVehicleWithRegistrationNumber(value) {
            vehicleWithRegistrationNumber = value;
        }

        // Fragt an DB nach Fahrzeug mit bestimmtem Kennzeichen, ob es bereits vergeben ist und speichert es zwischen,
        // da es aufgrund des Scopes nicht direkt zurückgegeben kann
        function fetchVehicleWithRegistrationNumber(registrationNumber) {
            return Restangular.all('api/vehicle')
                .customGET("GetVehicleByRegistrationNumber", { registrationNumber: registrationNumber }).then(function (vehicle) {
                        setVehicleWithRegistrationNumber(vehicle);                 
                });
        }

        // Methode, die mit der REST-Schnittstele /api/vehicle/GetAllVehicles des Back-Ends kommuniziert, um alle Fahrzeuge aus der Datenbank zu laden.
        // Speichert das Ergebnis der Abfrage in der lokalen Variable allVehicles.
        function fetchAllVehicles() {
            return Restangular.all('/api/vehicle/GetAllVehicles').getList().then(function (allVehiclesResponse) {
                return allVehicles = allVehiclesResponse;
            });
        }

        // Getter-Methode um die lokale Variable allVehicles zurückzugeben.
        function getAllVehicles() {
                return allVehicles;
        }

        // Getter-Methode um die lokale Variable vehicle zurückzugeben.
        // Falls die lokale Variable leer ist wird das Objekt aus den Cookies geladen.
        function getVehicle() {
            if (_.isEmpty(vehicle) || _.isUndefined(vehicle)) {
                vehicle = $cookies.getObject('selectedVehicle');
            }
            return vehicle;
        }

        // Setter-Methode für die lokale Variable vehicle.
        function setVehicle(selectedVehicle) {
            vehicle = selectedVehicle;
        }

        // Setter-Methode für das Attribut properties der lokalen Variable vehicle.
        function setVehicleProperties(vehicleProperties) {
            vehicle.Properties = vehicleProperties;
        }

        // Setter-Methode für das Attribut vehicleId der lokale Variable vehicle.
        function setVehicleTypeId(vehicleTypeId) {
            vehicle.VehicleTypeId = vehicleTypeId;
        }

        // Methode, die mit der REST-Schnittstelle /api/vehicle/GetVehicleById kommuniziert.
        // Lädt ein Fahrzeug anhand der übergeben Id aus der Datenbank.
        // TODO
        function fetchVehicleById(id) {
            return Restangular.all('/api/vehicle').customGET("GetVehicleById", { id: id }).then(function (responseVehicle) {
                vehicle.Picture = responseVehicle.Picture;
            });
        };

        // Methode, die mit der REST-Schnittstelle /api/vehicle/UpdateVehicle des Back-Ends kommuniziert.
        // Übergibt ein Fahrzeug Objekt an das Back-End um dort die Änderungen in die Datenbank zu übernehmen.
        function updateVehicle(vehicle) {
            var pids = [];
            var vs = [];
            for (var i = 0; i < vehicle.Properties.length; i++) {
                pids.push(vehicle.Properties[i].PropertyId);
                vs.push(vehicle.Properties[i].Value);
            }

            var vehiclePropertiesJson = JSON.stringify({ PropertyIds: pids, Values: vs });

            return Restangular.all('/api/vehicle').customPUT({ name: "" },"UpdateVehicle",
                {
                    id: vehicle.Id,
                    registrationNumber: vehicle.RegistrationNumber,
                    vehicleTypeId: vehicle.VehicleTypeId,
                    vehiclePropertiesJson: vehiclePropertiesJson
                });
        }

        // Methode, die mit der REST-Schnittstelle /api/vehicle/CreateVehicle des Back-Ends kommuniziert.
        // Übergibt ein Fahrzeug Objekt an das Back-End um dieses in der Datenbank speichern.
        function createVehicle(vehicle) {

            var pids = [];
            var vs = [];
            for (var i = 0; i < vehicle.Properties.length; i++) {
                pids.push(vehicle.Properties[i].PropertyId);
                vs.push(vehicle.Properties[i].Value);
            }
            var vehiclePropertiesJson = JSON.stringify({
                RegistrationNumber: vehicle.RegistrationNumber,
                VehicleTypeId: vehicle.VehicleTypeId,
                PropertyIds: pids,
                Values: vs
            });

            return Restangular.all('/api/vehicle').customPOST({ name: "" }, "CreateVehicle", { createVehicleJson: vehiclePropertiesJson });
        };

        // Methode, die mit der REST_Schnittstelle /api/vehicle/GetAllVehiclePropertiesByVehicleId des Back-Ends kommuniziert.
        // Lädt alle Fahrzeugeigenschaften eines Farhezuges anhand der übergebenen Id.
        function fetchAllVehiclePropertiesByVehicleId(vehicleId) {
            return Restangular.all('/api/vehicle').customGET("GetAllVehiclePropertiesByVehicleId", { vehicleId: vehicleId });
        };
        
        // Methode, die mit der REST-Schnittstelle /api/behicle/DeleteVehicleById des Back-Ends kommuniziert.
        // Löscht ein Fahrzeug anhand der übergebenen Id aus der Datenbank.
        function deleteVehicleById(id) {
            swal({
                title: "Soll dieses Fahrzeug wirklich gelöscht werden?",
                text: "Das Fahrzeug kann nicht wiederhergestellt werden.",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Abbrechen",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Löschen",
                closeOnConfirm: false
            }, function () {
                return Restangular.all('api/vehicle').customDELETE("DeleteVehicleById", { id: id }).then(
                function(success) {
                    if (success === true) {
                        swal("Erfolgreich gelöscht!", "", "success");
                        $location.path('/VehicleManagement');
                    } else {
                        swal("Fahrzeug konnte nicht gelöscht werden!", "", "error");
                    }
                },
                    function(error) {
                        if (error.status === 404) {
                            swal("Fahrzeug ist noch einer Tour zugeordnet!", "", "error");
                        } else {
                            swal("Fahrzeug konnte nicht gelöscht werden!", "", "error");
                        }
                    }
                )
            });
            
        };

        // Methode, die mit der REST-Schnittstelle /api/vehicle/UpdatePicture des Back-Ends kommuniziert.
        // Speichert das Bild des übergebenen Fahrzeug Objekts in der Datenbank ab.
        function savePicture(vehicle) {
            return Restangular.all('api/vehicle/').customPUT({ Picture: vehicle.Picture }, "UpdatePicture", {id: vehicle.Id});            
        };
    }
})();


