using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IRouteDbService
    {
        List<Route> GetAllRoutes();

        bool CreateRoute (Route route, List<RouteWaypoint> waypoints );

        bool UpdateRoute(Route route, List<RouteWaypoint> waypoints);

        bool DeleteRouteById(int id);

        Route GetRouteById(int id);
    }
}
