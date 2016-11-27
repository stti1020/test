using System;
using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface ITourDbService
    {
        List<Tour> GetAllTours();

        List<Tour> GetAllToursByDateRange(DateTime rangeFrom, DateTime rangeTo);

        Tour GetTourById(int id);
        bool CreateTour(Tour tour, List<int> vehicleIds, TourSeries tourSeries);

        bool UpdateTour(Tour tour, List<int> vehicleIds, TourSeries tourSeries);

        bool DeleteTourById(int id);

        CurrentTourWithVehicleId GetCurrentTourByVehicleId(int id);
    }
}
