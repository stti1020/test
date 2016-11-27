using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace Flottenmanagement_WebApp.Services
{
    public class VehicleTypeDbService : IVehicleTypeDbService
    {
        internal ApplicationDbService ApplicationDbService;

        internal VehicleTypeDbService(ApplicationDbService appDbService)
        {
            ApplicationDbService = appDbService;
        }

        /// <summary>Methode, die eine Liste aller VehcilesTypes liefert.</summary>
        /// <returns>Liste vom Typ VehicleType, wenn in der Datenbank mindestens ein VehicleType gefunden wurde.</returns>
        public List<VehicleType> GetAllVehicleTypes()
        {
            return ApplicationDbService.Context.VehicleType.ToList();
        }
    }
}
