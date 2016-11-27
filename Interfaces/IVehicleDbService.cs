using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IVehicleDbService
    {
        List<Vehicle> GetAllVehicles();

        Vehicle GetVehicleById(int id);

        bool DeleteVehicleById(int id);

        Vehicle UpdateVehicle(int id, string registrationNumber, int vehicleTypeId, string vehiclePropertiesJson);

        Vehicle CreateVehicle(string createVehicleJson);

        Vehicle UpdatePicture(Vehicle vehicle);

        Vehicle GetVehicleByRegistrationNumber(string registrationNumber);
    }
}
