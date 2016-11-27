using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace Flottenmanagement_WebApp.Services
{
    public class GeopositionDbService : IGeopositionDbService
    {
        internal AppDbService AppDbService;

        internal GeopositionDbService(AppDbService appdbService)
        {
            AppDbService = appdbService;
        }

        /// <summary>Methode, die alle Geopositionen eines Fahrzeugs liefert.</summary>
        /// <param name="registrationNumber">Kennzeichen eines Fahrzeugs vom Typ string.</param>
        /// <returns>Liste von Geoposition.</returns>
        public List<Geoposition> GetAllGeopositionsByRegistrationNumber(string registrationNumber)
        {
            return AppDbService.Context.Geoposition.Where(v => v.registrationNumber == registrationNumber)
                                                   .ToList();
        }

        /// <summary>Methode, die alle Geopositionen als Liste liefert.</summary>
        /// <returns>Liste von Geoposition.</returns>
        public List<Geoposition> GetAllGeopositions()
        {
            return AppDbService.Context.Geoposition.ToList();
        }

        /// <summary>Methode, die die letzten Geoposition aller Fahrzeuge liefert.</summary>
        /// <returns>Liste der letzten Geoposition aller Fahrzeuge.</returns>
        public List<Geoposition> GetAllLatestGeopositions()
        {
            return AppDbService.Context.Geoposition.GroupBy(g => g.registrationNumber)
                                                   .Select(s => s.OrderByDescending(g => g.__createdAt)
                                                                 .FirstOrDefault())
                                                   .ToList();
        }

        /// <summary>Methode, die die letzte Geoposition eines Fahrzeugs liefert.</summary>
        /// <param name="registrationNumber">Kennzeichen eines Fahrzeugs vom Typ string.</param>
        /// <returns>Letzte Geoposition des geünschten Fahrzeugs.</returns>
        public Geoposition GetLatestGeopositionByRegistrationNumber(string registrationNumber)
        {
            return AppDbService.Context.Geoposition.Where(v => v.registrationNumber == registrationNumber)
                                                   .OrderByDescending(v => v.__createdAt)
                                                   .FirstOrDefault();
        }

        /// <summary>Methode, die die letzte Geoposition der geünschten Fahrzeuge liefert.</summary>
        /// <param name="registrationNumbers">Jsonobjekt, das die Kennzeichen der gewünschten Fahrzeuge enthält.</param>
        /// <returns>Liste von Geopositionen der gewünschten Fahrzeuge.</returns>
        public List<Geoposition> GetLatestGeopositionByRegistrationNumbers(string registrationNumbers)
        {
            var regNumbers = JsonConvert.DeserializeObject<List<string>>(registrationNumbers);
            return AppDbService.Context.Geoposition.Where(g => regNumbers.Contains(g.registrationNumber))
                                                   .GroupBy(g => g.registrationNumber)
                                                   .Select(s => s.OrderByDescending(g => g.__createdAt)
                                                                 .FirstOrDefault())
                                                   .ToList();
        }

        /// <summary>Methode, die Kennzeichen, die mindestens eine Geoposition haben liefert.</summary>
        /// <returns>Liste von Geopositionen von Fahrzeugen, die mindestens eine Geoposition haben.</returns>
        public List<string> GetAllRegistrationNumbersWithGeoposition()
        {
            return AppDbService.Context.Geoposition.Select(g => g.registrationNumber)
                                                   .Distinct()
                                                   .ToList();
        }

        /// <summary>Methode, die die 100 aktuelleste Geodaten für ein bestimmtes Kennzeichen liefert.</summary>
        /// <returns>Liste von Geopositionen eines Fahrzeuges.</returns>
        public List<Geoposition> GetSimulationGeopositionsByRegistrationNumber(string registrationNumber)
        {
            return AppDbService.Context.Geoposition.Where(g => g.registrationNumber == registrationNumber)
                                                   .OrderByDescending(g => g.__createdAt)
                                                   .Take(100)
                                                   .ToList();
        }
    }
}
