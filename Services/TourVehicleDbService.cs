using System.Collections.Generic;
using System.Linq;
using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Services
{
    public class TourVehicleDbService : ITourVehicleDbService
    {
        internal ApplicationDbService ApplicationDbService;

        internal TourVehicleDbService(ApplicationDbService appdbService)
        {
            ApplicationDbService = appdbService;
        }

        /// <summary>Gibt alle Fahrzeuge mehrerer Touren zurück</summary>
        /// <param name="tourList">Liste der Touren</param>
        /// <returns>Liste der Fahrzeuge der Touren</returns>
        public List<TourVehicle> GetAllTourVehiclesByMultipleTours(List<Tour> tourList)
        {
            var result = new List<TourVehicle>();
            foreach (var tour in tourList)
            {
                result.AddRange(ApplicationDbService.Context.TourVehicle.Where(tv => tv.TourId == tour.Id)
                                                                        .ToList());
            }

            return result;
        }

        /// <summary>Methode, die eine Liste aller TourVehciles zur zugehörigen tour Id liefert.</summary>
        /// <param name="id">tour Id vom Typ int</param>
        /// <returns>Liste von Vehicles, wenn in der Datenbank mindestens ein Vehicle gefunden wurde.</returns>
        public List<TourVehicle> GetAllTourVehiclesByTourId(int id)
        {
            return ApplicationDbService.Context.TourVehicle.Where(tv => tv.TourId == id)
                                                           .Select(tv => new TourVehicle
                                                                         {
                                                                             Id = tv.Id,
                                                                             TourId = tv.TourId,
                                                                             Vehicle = new Vehicle
                                                                             {
                                                                                 Id = tv.Vehicle.Id,
                                                                                 VehicleTypeId = tv.Vehicle.VehicleTypeId,
                                                                                 RegistrationNumber = tv.Vehicle.RegistrationNumber,
                                                                                 VehicleType = tv.Vehicle.VehicleType
                                                                             },
                                                                             VehicleId = tv.VehicleId
                                                                         })
                                                           .ToList();
        }

        /// <summary>Gibt das Fahrzeug einer Tour anhand der TourId zurück</summary>
        /// <param name="tourId">Id der Tour</param>
        /// <returns>Fahrzeug der Tour</returns>
        public TourVehicle GetTourVehicleByTourId(int tourId)
        {
            return ApplicationDbService.Context.TourVehicle.FirstOrDefault(tv => tv.TourId == tourId);
        }

        /// <summary>Erstellt ein neues Fahrzeug für eine Tour</summary>
        /// <param name="tourId">Id der Tour</param>
        /// <param name="vehicleIds">Ids der Fahrzeuge die zur Tour hinzugefügt werden sollen</param>
        /// <returns>Ob Erstellen erfolgreich war</returns>
        public bool CreateTourVehicle(int tourId, List<int> vehicleIds)
        {
            var success = true;    

            try
            {
                foreach (var v in vehicleIds)
                {
                    var createTourVehicle = new TourVehicle
                    {
                        TourId = tourId,
                        VehicleId = v
                    };
                    ApplicationDbService.Context.TourVehicle.Add(createTourVehicle);
                    ApplicationDbService.Context.SaveChanges();
                }
            }
            catch
            {
                success = false;
            }

            return success;
        }
    }
}
