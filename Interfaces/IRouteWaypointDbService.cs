using Flottenmanagement_WebApp.Models;
using System.Collections.Generic;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IRouteWaypointDbService
    {
        List<RouteWaypoint> GetAllRouteWaypoints();
        List<RouteWaypoint> GetAllRouteWaypointsByRouteId(int id);
    }
}
