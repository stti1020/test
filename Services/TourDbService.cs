using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using Microsoft.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Flottenmanagement_WebApp.Services
{
    public class TourDbService : ITourDbService
    {
        internal ApplicationDbService ApplicationDbService;

        internal TourDbService(ApplicationDbService appdbService)
        {
            ApplicationDbService = appdbService;
        }


        public bool DeleteTourById(int id)
        {
            try
            {           
                var tour = ApplicationDbService.TourDbService.GetTourById(id);

                if (tour == null)
                {
                    return false;
                }

                var tourVehicle = ApplicationDbService.tourVehicleDbService.GetAllTourVehiclesByTourId(tour.Id);

                if (tourVehicle == null)
                {
                    return false;
                }
                else
                {
                    ApplicationDbService.Context.Tour.Remove(tour);
                    ApplicationDbService.Context.TourVehicle.RemoveRange(tourVehicle);

                    ApplicationDbService.Context.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        /// <summary>Methode, die eine Liste aller Touren mit deren TourSeries liefert.</summary>
        /// <returns>Liste von Touren, wenn in der Datenbank mindestens eine Tour gefunden wurde.</returns>
        /// <author>Kevin Steinhagen</author>
        public List<Tour> GetAllTours()
        {
            var tours = ApplicationDbService.Context.Tour.Include(t => t.TourSeries).ToList();

            foreach (var tour in tours)
            {
                tour.TourVehicles = ApplicationDbService.TourVehicleDbService.GetAllTourVehiclesByTourId(tour.Id);
            }

            return tours;
        }

        /// <summary>Methode, die eine Tour anhand seiner Id liefert.</summary>
        /// <param name="id">tour Id vom Typ int</param>
        /// <returns>Tour mit der gesuchten Id.</returns>
        public Tour GetTourById(int id)
        {
            return ApplicationDbService.Context.Tour.Include(t => t.Route).Include(t => t.TourSeries).FirstOrDefault(t => t.Id == id);
        }

        /// <summary>Methode, die eine Liste aller Touren liefert deren Startzeit innerhalb des mitgegebenen Zeitraums liegt.</summary>
        /// <returns>Liste von Touren, wenn in der Datenbank mindestens eine Tour gefunden wurde.</returns>
        public List<Tour> GetAllToursByDateRange(DateTime rangeFrom, DateTime rangeTo)
        {
            var tours = ApplicationDbService.Context.Tour.Include(t => t.Route)
                                                         .Include(t => t.TourSeries)
                                                         .Where(t => t.StartDate >= rangeFrom && t.StartDate <= rangeTo)
                                                         .ToList();
           
            foreach (var tour in tours)
            {
                tour.Route.Waypoints = ApplicationDbService.RouteWaypointDbService.GetAllRouteWaypointsByRouteId(tour.RouteId);
                tour.TourVehicles = ApplicationDbService.Context.TourVehicle.Where(tv => tv.TourId == tour.Id)
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

            return tours;
        }
        /// <summary>Methode, die eine Tour mit einer Liste von vehicleIds und tourSeries entgegen nimmt und in der Datenbank anlegt.
        ///  Bei TourSeries werden alle Einzeltouren angelegt</summary>
        /// <param name="tour">tour vom Typ Tour</param>
        /// <param name="vehicleIds">Liste von vehicleIds vom Typ int</param>
        /// <param name="tourSeries">Liste von tourSeries vom Typ TourSeries</param>
        /// <returns>true wenn die Tour angelegt wurde, false wenn nicht</returns>
        public bool CreateTour(Tour tour, List<int> vehicleIds, TourSeries tourSeries)
        {
            var success = true;
           
            try
            {
                if (tourSeries != null)
                {
                    var createdTourSeries = ApplicationDbService.TourSeriesDbService.CreateTourSeries(tourSeries);
                    var startDate = createdTourSeries.StartDate;

                    while (startDate <= createdTourSeries.EndDate)
                    {
                        var createTour = new Tour
                        {
                            Name = createdTourSeries.Name,
                            StartDate = startDate,
                            Done = false,
                            RouteId = tour.RouteId,
                            TourSeriesId = createdTourSeries.Id
                        };

                        ApplicationDbService.Context.Tour.Add(createTour);
                        ApplicationDbService.Context.SaveChanges();

                        ApplicationDbService.tourVehicleDbService.CreateTourVehicle(createTour.Id, vehicleIds);

                        startDate = startDate.AddDays(createdTourSeries.DaysInterval);
                    }
                }
                else
                {
                    var createTour = new Tour
                    {
                        Name = tour.Name,
                        StartDate = tour.StartDate,
                        Done = tour.Done,
                        RouteId = tour.RouteId
                    };

                    ApplicationDbService.Context.Tour.Add(createTour);
                    ApplicationDbService.Context.SaveChanges();

                    ApplicationDbService.tourVehicleDbService.CreateTourVehicle(createTour.Id, vehicleIds);
                }
            }
            catch
            {
                success = false;
            }

            return success;
        }

        /// <summary>Methode, die eine Tour mit einer Liste von vehicleIds und tourSeries entgegen nimmt, ändert und in der Datenbank speichert.</summary>
        /// <param name="tour">tour vom Typ Tour</param>
        /// <param name="vehicleIds">Liste von vehicleIds vom Typ int</param>
        /// <param name="tourSeries">Liste von tourSeries vom Typ TourSeries</param>
        /// <returns>true wenn die Tour erfolgreich geändert wurde, false wenn nicht</returns>
        public bool UpdateTour(Tour tour, List<int> vehicleIds, TourSeries tourSeries)
        {
            var success = true;

            try
            {
                if (tourSeries != null)
                {
                    var removeTours = ApplicationDbService.Context.Tour.Where(t => t.TourSeriesId == tourSeries.Id && t.Done == false).ToList();
                    var removeTourIds = new List<int>();

                    removeTours.ForEach(rt => removeTourIds.Add(rt.Id));
                    
                    var removeTourVehicles = ApplicationDbService.Context.TourVehicle.Where(tv => removeTourIds.Contains(tv.TourId)).ToList();

                    ApplicationDbService.Context.TourVehicle.RemoveRange(removeTourVehicles);
                    ApplicationDbService.Context.Tour.RemoveRange(removeTours);
                    ApplicationDbService.Context.SaveChanges();

                    var updatedTourSeries = ApplicationDbService.TourSeriesDbService.UpdateTourSeries(tourSeries);
                    var startDate = updatedTourSeries.StartDate;

                    while (startDate <= updatedTourSeries.EndDate)
                    {
                        var createTour = new Tour
                        {
                            Name = updatedTourSeries.Name,
                            StartDate = startDate,
                            Done = false,
                            RouteId = tour.RouteId,
                            TourSeriesId = updatedTourSeries.Id
                        };

                        ApplicationDbService.Context.Tour.Add(createTour);
                        ApplicationDbService.Context.SaveChanges();

                        ApplicationDbService.tourVehicleDbService.CreateTourVehicle(createTour.Id, vehicleIds);

                        startDate = startDate.AddDays(updatedTourSeries.DaysInterval);
                    }
                }
                else
                {
                    var updateTour = ApplicationDbService.Context.Tour.FirstOrDefault(t => t.Id == tour.Id);

                    if (updateTour == null)
                    {
                        return false;
                    }
                   
                    updateTour.Name = tour.Name;
                    updateTour.StartDate = tour.StartDate;
                    updateTour.Done = tour.Done;
                    updateTour.RouteId = tour.RouteId;

                    var removeTourVehicles = ApplicationDbService.Context.TourVehicle.Where(tv => tv.TourId == tour.Id).ToList();
                    ApplicationDbService.Context.TourVehicle.RemoveRange(removeTourVehicles);

                    ApplicationDbService.tourVehicleDbService.CreateTourVehicle(tour.Id, vehicleIds);

                    ApplicationDbService.Context.SaveChanges();
                }
            }
            catch
            {
                success = false;
            }

            return success;
        }

        /// <summary>Gibt die aktuelle Tour eines Fahrzeugs anhand der Fahrzeugid zurück</summary>
        /// <param name="id">Id eines Fahrzeugs</param>
        /// <returns>Aktuelle Tour des Fahrzeugs</returns>
        public CurrentTourWithVehicleId GetCurrentTourByVehicleId(int id)
        {
            var from = DateTime.Today;
            var to = DateTime.Today.AddDays(1);

            var tourVehicle  = ApplicationDbService.Context.TourVehicle.Where(v=> v.Tour.StartDate >= from && v.Tour.StartDate <= to && v.Vehicle.Id == id)
                                                                       .Include(t => t.Tour)
                                                                       .Include(v => v.Vehicle)
                                                                       .Include(r => r.Tour.Route)
                                                                       .Select(v => new CurrentTourWithVehicleId
                                                                                    {
                                                                                        VehicleId = id, RegistrationNumber = v.Vehicle.RegistrationNumber, TourName = v.Tour.Name,  TourId = v.Tour.Route.Id,
                                                                                        StartName = v.Tour.Route.StartName, StartLatitude = v.Tour.Route.StartLatitude, DestinationName = v.Tour.Route.DestinationName,
                                                                                        DestinationLongitude = v.Tour.Route.DestinationLongitude,Distance = v.Tour.Route.Distance
                                                                                    })
                                                                       .FirstOrDefault();
            if (tourVehicle != null)
            {
                var waypoints =
                    ApplicationDbService.RouteWaypointDbService.GetAllRouteWaypointsByRouteId(tourVehicle.TourId);

                if (waypoints != null)
                {
                    tourVehicle.Waypoints = waypoints;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }

            return tourVehicle;
        }
    }
}
