using System.Collections.Generic;

namespace Flottenmanagement_WebApp.Models.JsonObjects
{
    public class CreateAndUpdateRouteJson
    {
        public Route Route { get; set; }
        public List<RouteWaypoint> RouteWaypoints { get; set; }
    }
}
