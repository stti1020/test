using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface ITourVehicleDbService
    {
        List<TourVehicle>GetAllTourVehiclesByTourId(int id);

        bool CreateTourVehicle(int tourId, List<int> vehicleIds);

        TourVehicle GetTourVehicleByTourId(int tourId);

        List<TourVehicle> GetAllTourVehiclesByMultipleTours(List<Tour> tourList);
    }
}
