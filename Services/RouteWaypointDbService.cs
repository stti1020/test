using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace Flottenmanagement_WebApp.Services
{
    public class RouteWaypointDbService: IRouteWaypointDbService
    {
        internal ApplicationDbService ApplicationDbService;

        internal RouteWaypointDbService(ApplicationDbService appdbService)
        {
            ApplicationDbService = appdbService;
        }

        public List<RouteWaypoint> GetAllRouteWaypoints()
        {
            return ApplicationDbService.Context.RouteWaypoint.ToList();
        }

        public List<RouteWaypoint> GetAllRouteWaypointsByRouteId(int id)
        {
            return ApplicationDbService.Context.RouteWaypoint.Where(rw => rw.RouteId == id)
                                                             .Select(rw => new RouteWaypoint {Id = rw.Id, Name = rw.Name, Latitude = rw.Latitude, Longitude = rw.Longitude, RouteId = rw.RouteId})
                                                             .ToList();
        }
    }
}
