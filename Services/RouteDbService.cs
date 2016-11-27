using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace Flottenmanagement_WebApp.Services
{
    public class RouteDbService : IRouteDbService
    {
        internal ApplicationDbService ApplicationDbService;

        internal RouteDbService(ApplicationDbService appdbService)
        {
            ApplicationDbService = appdbService;
        }

        /// <summary>Methode, die eine Liste aller Routen liefert.</summary>
        /// <returns>Liste von Routen, wenn in der Datenbank mindestens eine Route gefunden wurde.</returns>
        public List<Route> GetAllRoutes()
        {
            var routes = ApplicationDbService.Context.Route.ToList();

            foreach (var r in routes)
            {
                r.Waypoints = ApplicationDbService.RouteWaypointDbService.GetAllRouteWaypointsByRouteId(r.Id);
            }

            return routes;
        }

        /// <summary>Methode, die eine Route mit einer Liste von Waypoints entgegen nimmt und in der Datenbank anlegt.</summary>
        /// <param name="route">route vom Typ Route</param>
        /// <param name="waypoints">Liste von waypoints vom Typ RouteWaypoints</param>
        /// <returns>true wenn die Route angelegt wurde, false wenn nicht</returns>
        public bool CreateRoute(Route route, List<RouteWaypoint> waypoints)
        {
            var success = true;

            try
            {
                var newRoute = new Route
                {
                    StartName = route.StartName,
                    StartLongitude = route.StartLongitude,
                    StartLatitude = route.StartLatitude,
                    DestinationName = route.DestinationName,
                    DestinationLongitude = route.DestinationLongitude,
                    DestinationLatitude = route.DestinationLatitude,
                    Distance = route.Distance,
                    EstimatedDuration = route.EstimatedDuration
                };

                ApplicationDbService.Context.Route.Add(newRoute);
                ApplicationDbService.Context.SaveChanges();

                foreach (var wp in waypoints)
                {
                    var addRouteWaypoint = new RouteWaypoint
                    {
                        Name = wp.Name,
                        Longitude = wp.Longitude,
                        Latitude = wp.Latitude,
                        RouteId = newRoute.Id
                    };

                    ApplicationDbService.Context.RouteWaypoint.Add(addRouteWaypoint);
                    ApplicationDbService.Context.SaveChanges();
                }
            }
            catch
            {
                success = false;
            }

            return success;
        }


        /// <summary>Methode, die eine Route mit einer Liste aus Waypoints entgegen nimmt, ändert und in der Datenbank speichert.</summary>
        /// <param name="route">route vom Typ Route</param>
        /// <param name="waypoints">Liste von waypoints vom Typ RouteWaypoints</param>
        /// <returns>true wenn die Route erfolgreich geupdated wurde, false wenn nicht</returns>
        public bool UpdateRoute (Route route, List<RouteWaypoint> waypoints)
        {
            var success = true;

            try
            { 
                var original = ApplicationDbService.Context.Route.FirstOrDefault(r => r.Id == route.Id);

                if (original != null)
                {
                    original.StartName = route.StartName;
                    original.StartLongitude = route.StartLongitude;
                    original.StartLatitude = route.StartLatitude;
                    original.DestinationName = route.DestinationName;
                    original.DestinationLongitude = route.DestinationLongitude;
                    original.DestinationLatitude = route.DestinationLatitude;
                        
                    var originalWaypoints = ApplicationDbService.Context.RouteWaypoint.Where(rw => rw.RouteId == route.Id).ToList();

                    ApplicationDbService.Context.RouteWaypoint.RemoveRange(originalWaypoints);
                    ApplicationDbService.Context.SaveChanges();

                    foreach (var wp in waypoints)
                    {
                        var addRouteWaypoint = new RouteWaypoint
                        {
                            Name = wp.Name,
                            Longitude = wp.Longitude,
                            Latitude = wp.Latitude,
                            RouteId = route.Id
                        };

                        ApplicationDbService.Context.RouteWaypoint.Add(addRouteWaypoint);
                        ApplicationDbService.Context.SaveChanges();
                    }
                }
            } 
            catch
            {
                success = false;
            }

            return success;
       }

        /// <summary>Methode, die eine Route anhand seiner Id löscht.</summary>
        /// <param name="id">Route id vom Typ int</param>
        /// <returns>True, wenn die Route erfolgreich gelöscht wurde. False, wenn die Route nicht gelöscht werden konnte.</returns>
        public bool DeleteRouteById(int id)
        {
            var success = true;

            try
            {
                var routeToRemove = ApplicationDbService.Context.Route.FirstOrDefault(r => r.Id == id);
                var waypointsToRemove = ApplicationDbService.RouteWaypointDbService.GetAllRouteWaypointsByRouteId(id);

                if (routeToRemove == null)
                {
                    success = false;
                }
                else
                {   
                    ApplicationDbService.Context.RouteWaypoint.RemoveRange(waypointsToRemove);
                    ApplicationDbService.Context.Route.Remove(routeToRemove);
                    ApplicationDbService.Context.SaveChanges();  
                }
            }
            catch
            {
                success = false;
            }

            return success;
        }

        /// <summary>Methode, die eine Route anhand seiner Id liefert.</summary>
        /// <param name="id">Route id vom Typ int</param>
        /// <returns>Route mit der gesuchten Id.</returns>
        public Route GetRouteById(int id)
        {
            return ApplicationDbService.Context.Route.FirstOrDefault(r => r.Id == id);
        }
    }
}