using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IGeopositionDbService
    {
        List<Geoposition> GetAllGeopositionsByRegistrationNumber(string registrationNumber);

        List<Geoposition> GetAllGeopositions();

        List<Geoposition> GetAllLatestGeopositions();

        Geoposition GetLatestGeopositionByRegistrationNumber(string registrationNumber);

        List<Geoposition> GetLatestGeopositionByRegistrationNumbers(string registrationNumbers);

        List<string> GetAllRegistrationNumbersWithGeoposition();

        List<Geoposition> GetSimulationGeopositionsByRegistrationNumber(string registrationNumber);
    }
}
