using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using Flottenmanagement_WebApp.Models.JsonObjects;
using Microsoft.Data.Entity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Flottenmanagement_WebApp.Services
{
    public class VehicleDbService : IVehicleDbService
    {
        internal ApplicationDbService ApplicationDbService;

        internal VehicleDbService(ApplicationDbService appdbService)
        {
            ApplicationDbService = appdbService;
        }

        /// <summary>Methode, die ein Fahrzeug mit einem bestimmten Kennzeichen zurückgibt</summary>
        /// <param name="registrationNumber">Kennzeichen</param>
        /// <returns>Fahrzeug mit Kennzeichen</returns>
        public Vehicle GetVehicleByRegistrationNumber(string registrationNumber)
        {
            return ApplicationDbService.Context.Vehicle.Select(v => new Vehicle
                                                                    {
                                                                        Id = v.Id, VehicleTypeId = v.VehicleTypeId,
                                                                        RegistrationNumber = v.RegistrationNumber,
                                                                        VehicleType = v.VehicleType
                                                                    })
                                                       .FirstOrDefault(v => v.RegistrationNumber == registrationNumber);
        }

        /// <summary>Methode, die eine Liste aller Vehciles liefert.</summary>
        /// <returns>Liste von Vehicles, wenn in der Datenbank mindestens ein Vehicle gefunden wurde.</returns>
        public List<Vehicle> GetAllVehicles()
        {
            return
                ApplicationDbService.Context.Vehicle.Include(v => v.VehicleType)
                                                    .Select(v => new Vehicle
                                                                 {
                                                                     Id = v.Id,
                                                                     VehicleTypeId = v.VehicleTypeId,
                                                                     RegistrationNumber = v.RegistrationNumber,
                                                                     VehicleType = v.VehicleType
                                                                 })
                                                    .ToList();
        }

        /// <summary>Methode, die ein Vehicle anhand seiner Id liefert.</summary>
        /// <param name="id">vehicle Id vom Typ int</param>
        /// <returns>Vehicle mit der gesuchten Id.</returns>
        public Vehicle GetVehicleById(int id)
        {
            return ApplicationDbService.Context.Vehicle.Include(v => v.VehicleType)
                                                       .FirstOrDefault(v => v.Id == id);
        }

        /// <summary>Methode, die ein Vehicle anhand seiner Id löscht.</summary>
        /// <param name="id">vehicle Id vom Typ int</param>
        /// <returns>True, wenn das Vehicle erfolgreich gelöscht wurde. False, wenn das Vehicle nicht gelöscht werden konnte.</returns>
        public bool DeleteVehicleById(int id)
        {
            var success = true;

            try
            {
            var vehicle = ApplicationDbService.VehicleDbService.GetVehicleById(id);
                var vehicleProperties = ApplicationDbService.VehiclePropertyDbService.GetAllVehiclePropertiesByVehicleId(id);

                if (vehicle == null)
                {
                    success = false;
                }

                else
                {
                    ApplicationDbService.Context.VehicleProperty.RemoveRange(vehicleProperties);
                    ApplicationDbService.Context.SaveChanges();

                    ApplicationDbService.Context.Vehicle.Remove(vehicle);
                    ApplicationDbService.Context.SaveChanges();
                }
            }
            catch
            {
                success = false;
            }

            return success;
        }

        /// <summary>Methode, die registrationNumber, vehicleTypeId und vehicleProperties eines Vehicle anhand seiner Id updatet.</summary>
        /// <param name="id">vehicle Id vom Typ int</param>
        /// <param name="registrationNumber">registrationNumber vom Typ string</param>
        /// <param name="vehicleTypeId">vehicleTypeId vom Typ int</param>
        /// <param name="vehiclePropertiesJson">vehiclePropertiesJson vom Typ string</param>
        /// <returns>Geupdatetes Vehicle.</returns>
        public Vehicle UpdateVehicle(int id, string registrationNumber, int vehicleTypeId, string vehiclePropertiesJson)
        {
            var vpliste = JsonConvert.DeserializeObject<VehiclePropertiesJson>(vehiclePropertiesJson);
            var vehicle = ApplicationDbService.VehicleDbService.GetVehicleById(id);

            vehicle.RegistrationNumber = registrationNumber;
            vehicle.VehicleTypeId = vehicleTypeId;

            ApplicationDbService.Context.Entry(vehicle).State = EntityState.Modified;
            ApplicationDbService.Context.SaveChanges();

            var vps = ApplicationDbService.VehiclePropertyDbService.GetAllVehiclePropertiesByVehicleId(id);

            foreach (var vp in vps)
            {
                for (var i = 0; i < vpliste.PropertyIds.Length; i++)
                {
                    if (vp.PropertyId == Convert.ToInt32(vpliste.PropertyIds[i]))
                    {
                        vp.Value = Convert.ToDouble(vpliste.Values[i]);

                        ApplicationDbService.Context.Entry(vp).State = EntityState.Modified;
                        ApplicationDbService.Context.SaveChanges();
                    }
                }
            }

            return ApplicationDbService.VehicleDbService.GetVehicleById(id);
        }

        /// <summary>Methode, die ein Vehicle entgegen nimmt und in der Datenbank anlegt.</summary>
        /// <param name="createVehicleJson">createVehicleJson vom Typ string.</param>
        /// <returns>Angelegtes Vehicle.</returns>
        public Vehicle CreateVehicle(string createVehicleJson)
        {
            var createVehicle = JsonConvert.DeserializeObject<CreateVehicleJson>(createVehicleJson);
            var vehicle = new Vehicle { RegistrationNumber = createVehicle.RegistrationNumber, VehicleTypeId = Convert.ToInt32(createVehicle.VehicleTypeId) };

            ApplicationDbService.Context.Vehicle.Add(vehicle);
            ApplicationDbService.Context.SaveChanges();

            var createdVehicle = ApplicationDbService.Context.Vehicle.FirstOrDefault(v => v.RegistrationNumber == createVehicle.RegistrationNumber);

            for (var i = 0; i < createVehicle.PropertyIds.Length; i++)
            {
                var addVehicleProperty = new VehicleProperty
                {
                    VehicleId = createdVehicle.Id,
                    PropertyId = Convert.ToInt32(createVehicle.PropertyIds[i]),
                    Value = Convert.ToDouble(createVehicle.Values[i])
                };

                ApplicationDbService.Context.VehicleProperty.Add(addVehicleProperty);
                ApplicationDbService.Context.SaveChanges();
            }

            return ApplicationDbService.VehicleDbService.GetVehicleById(createdVehicle.Id);
        }

        /// <summary>Methode, die das Bild des übergbenen Vehicles updatet.</summary>
        /// <param name="vehicle">Objekt vom Typ Vehicle</param>
        /// <returns>Geupdatetes Vehicle.</returns>
        public Vehicle UpdatePicture(Vehicle vehicle)
        {
            var vehicletoUpdate = ApplicationDbService.VehicleDbService.GetVehicleById(vehicle.Id);
            vehicletoUpdate.Picture = vehicle.Picture;
            ApplicationDbService.Context.SaveChanges();
            vehicletoUpdate.Picture = vehicle.Picture;
            return vehicletoUpdate;
        }
    }
}
