using System;
using System.Collections.Generic;
using System.Linq;
using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using Microsoft.Data.Entity;

namespace Flottenmanagement_WebApp.Services
{
    public class TourSeriesDbService : ITourSeriesDbService
    {
        internal ApplicationDbService ApplicationDbService;

        internal TourSeriesDbService(ApplicationDbService appdbService)
        {
            ApplicationDbService = appdbService;
        }

        /// <summary>Löscht eine Tourserie anhand ihrer Id mit den nicht abgeschlossenen Touren der Serie</summary>
        /// <param name="id">Id einer zu löschenden Tour</param>
        /// <returns>Ob Löschen funktioniert hat</returns>
        public bool DeleteTourSeriesById(int id)
        {
            var tourSeries = ApplicationDbService.Context.TourSeries.FirstOrDefault(ts => ts.Id == id);
            if (tourSeries == null)
            {
                return false;
            }

            var incompleteToursOfTourSeries = ApplicationDbService.Context.Tour.Where(t => t.TourSeriesId == id && t.Done == false).ToList();

            var completeToursOfTourSeries = ApplicationDbService.Context.Tour.Where(t => t.TourSeriesId == id && t.Done).ToList();

            var tourVehiclesOfincompleteToursOfTourSeries = ApplicationDbService.tourVehicleDbService.GetAllTourVehiclesByMultipleTours(incompleteToursOfTourSeries);

            ApplicationDbService.Context.TourVehicle.RemoveRange(tourVehiclesOfincompleteToursOfTourSeries);
            ApplicationDbService.Context.Tour.RemoveRange(incompleteToursOfTourSeries);
            ApplicationDbService.Context.SaveChanges();

            if (completeToursOfTourSeries.Count != 0)
            {
                foreach (var completeTour in completeToursOfTourSeries)
                {
                    completeTour.TourSeriesId = null;
                }
            }

            ApplicationDbService.Context.TourSeries.Remove(tourSeries);
            ApplicationDbService.Context.SaveChanges();

            return true;
        }

        /// <summary>Speichert eine Tourserie in die DB</summary>
        /// <param name="tourSeries">Die zu speichernde Tourserie</param>
        /// <returns>Ojekt der gespeicherten Tourserie</returns>
        public TourSeries CreateTourSeries(TourSeries tourSeries)
        {
            var createdTourSeries = new TourSeries
            {
                Name = tourSeries.Name,
                StartDate =  tourSeries.StartDate,
                EndDate = tourSeries.EndDate,
                DaysInterval = tourSeries.DaysInterval,
                RouteId = tourSeries.RouteId
            };
            try
            {
                ApplicationDbService.Context.TourSeries.Add(createdTourSeries);
                ApplicationDbService.Context.SaveChanges();
            }
            catch
            {
                createdTourSeries = null;
            }

            return createdTourSeries;
        }

        /// <summary>Aktualisiert eine TourSerie und speichert sie in der DB</summary>
        /// <param name="tourSeries">Zu ändernde Tourserie</param>
        /// <returns>Objekt der geänderten Tourserie</returns>
        public TourSeries UpdateTourSeries(TourSeries tourSeries)
        {
            var updatedTourSeries = ApplicationDbService.Context.TourSeries.FirstOrDefault(ts => ts.Id == tourSeries.Id);
            try
            {
                var currentTourSeries = ApplicationDbService.Context.TourSeries.FirstOrDefault(ts => ts.Id == tourSeries.Id);
                currentTourSeries.Name = tourSeries.Name;
                currentTourSeries.StartDate = tourSeries.StartDate;
                currentTourSeries.EndDate = tourSeries.EndDate;
                currentTourSeries.DaysInterval = tourSeries.DaysInterval;

                ApplicationDbService.Context.SaveChanges();
            }
            catch
            {
                updatedTourSeries = null;
            }

            return updatedTourSeries;
        }


        /// <summary>Gibt alle Touren zwischen zwei Daten (Startdatum und Enddatum) zurück</summary>
        /// <param name="rangeFrom">Startdatum</param>
        /// <param name="rangeTo">Enddatum</param>
        /// <returns>Liste aller Touren zwischen den beiden Daten</returns>
        public List<TourSeries> GetAllTourSeriesByDateRange(DateTime rangeFrom, DateTime rangeTo)
        {
            var tourSeries = ApplicationDbService.Context.TourSeries.Include(ts => ts.Route).ToList();

            foreach (var ts in tourSeries)
            {
                ts.Route.Waypoints = ApplicationDbService.RouteWaypointDbService.GetAllRouteWaypointsByRouteId(ts.RouteId);
            }

            return tourSeries;
        }
    }
}
