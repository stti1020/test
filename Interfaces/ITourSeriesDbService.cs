using Flottenmanagement_WebApp.Models;
using System;
using System.Collections.Generic;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface ITourSeriesDbService
    {
        TourSeries CreateTourSeries(TourSeries tourSeries);

        TourSeries UpdateTourSeries(TourSeries tourSeries);

        List<TourSeries> GetAllTourSeriesByDateRange(DateTime rangeFrom, DateTime rangeTo);

        bool DeleteTourSeriesById(int id);
    }
}
