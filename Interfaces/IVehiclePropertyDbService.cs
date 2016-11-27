using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IVehiclePropertyDbService
    {
        List<VehicleProperty> GetAllVehicleProperties();

        List<VehicleProperty> GetAllVehiclePropertiesByVehicleId(int vehicleId);
    }
}
