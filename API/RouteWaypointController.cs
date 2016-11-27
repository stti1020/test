using Flottenmanagement_WebApp.Services;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;

namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class RouteWaypointController : Controller
    {
        private readonly ApplicationDbService _applicationDbService;

        //public RouteWaypointController(IApplicationDbService applicationDbService)
        //{
        //    _applicationDbService = applicationDbService;
        //}

        // !!Wichtig bei Production verwenden wir diesen Kontruktor, der Kontruktor mit Parametern wird auskommentiert!!
        public RouteWaypointController()
        {
            _applicationDbService = new ApplicationDbService();
        }

        /// <summary>Schnittstelle, die alle Routen zurückgibt </summary>
        /// <returns>Liste mit allen Routen</returns>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllRoutes()
        {
            var routeList = _applicationDbService.RouteDbService.GetAllRoutes();

            if (routeList == null)
            {
                return HttpNotFound();
            }

            return Ok(routeList);
        }

        /// <summary>Schnittstelle die alle Wegpunkte zurückgibt</summary>
        /// <returns>Liste aller Wegpunkte</returns>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllRouteWaypoints()
        {
            var routeList = _applicationDbService.RouteWaypointDbService.GetAllRouteWaypoints();

            if (routeList == null)
            {
                return HttpNotFound();
            }

            return Ok(routeList);
        }

        /// <summary>Schnittstelle, die alle Wegpunkte einer bestimmten Route zurückgibt</summary>
        /// <param name="id">Id der Route</param>
        /// <returns>Liste mit Wegpunkten der Route</returns>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllRouteWaypointsByRouteId(int id)
        {
            var routeList = _applicationDbService.RouteWaypointDbService.GetAllRouteWaypointsByRouteId(id);

            if (routeList == null)
            {
                return HttpNotFound();
            }

            return Ok(routeList);
        }
    }
}