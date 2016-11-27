using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using Microsoft.Data.Entity;
using System.Collections.Generic;
using System.Linq;

namespace Flottenmanagement_WebApp.Services
{
    public class VehiclePropertyDbService : IVehiclePropertyDbService
    {
        internal ApplicationDbService ApplicationDbService;

        internal VehiclePropertyDbService(ApplicationDbService appDbService)
        {
            ApplicationDbService = appDbService;
        }

        /// <summary>Methode, die alle VehicleProperties liefert.</summary>
        /// <returns>Liste von VehicleProperties.</returns>
        public List<VehicleProperty> GetAllVehicleProperties()
        {
            return ApplicationDbService.Context.VehicleProperty.Include(vp => vp.Property)
                                                               .ToList();
        }

        /// <summary>Methode, die alle VehicleProperties eines Vehicles, das anhand seiner Id gesucht wird, liefert.</summary>
        /// <param name="vehicleId">vehicle Id vom Typ int.</param>
        /// <returns>Liste von VehicleProperties des Vehicles, das anhand seiner Id gesucht wurde.</returns>
        public List<VehicleProperty> GetAllVehiclePropertiesByVehicleId(int vehicleId)
        {
            return ApplicationDbService.Context.VehicleProperty
                                               .Where(vp => vp.VehicleId == vehicleId)
                                               .Include(vp => vp.Property)
                                               .ToList();
        }
    }
}
