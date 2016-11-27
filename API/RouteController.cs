using Flottenmanagement_WebApp.Models.JsonObjects;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Flottenmanagement_WebApp.Services;
using Microsoft.AspNet.Authorization;

namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class RouteController : Controller
    {
        private readonly ApplicationDbService _applicationDbService;

        //public RouteController(IApplicationDbService applicationDbService)
        //{
        //    _applicationDbService = applicationDbService;
        //}

        // !!Wichtig bei Production verwenden wir diesen Kontruktor, der Kontruktor mit Parametern wird auskommentiert!!
        public RouteController()
        {
            _applicationDbService = new ApplicationDbService();
        }

        // GET: /api/Route/GetAllRoutes
        /// <summary>REST-Schnittstelle, die eine Liste aller Routen zurückgibt.</summary>
        /// <returns>HttpNotFoundObjectResult wenn keine Routen in der Datenbank gefunden wurden.</returns>
        /// <returns>HttpOkObjectResult mit einer Liste aller Routen.</returns>
        /// <author>Kevin Steinhagen</author>
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

        // GET: /api/Route/GetRouteById
        /// <summary>REST-Schnittstelle, die eine Route anhand der zugehörigen Id zurückgibt.</summary>
        /// <param name="id">id einer Route vom Typ int.</param>
        /// <returns>HttpNotFoundObjectResult mit der übergebenen id, wenn zu der id kein Eintrag in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpBadRequest wenn der übergebene Parameter id null ist.</returns>
        /// <returns>HttpOkObjectResult mit einer Route zur passenden id.</returns>
        /// <author>Kevin Steinhagen</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetRouteById(int id)
        {
            var route = _applicationDbService.RouteDbService.GetRouteById(id);

            if (route == null)
            {
                return HttpNotFound(id);
            }

            return Ok(route);
        }

        // POST: /api/Route/CreateOrUpdateRoute
        /// <summary>REST-Schnittstelle, die eine Route anlegt oder ändert.</summary>
        /// <param name="json">ein Routeobjekt im json Format, vom Typ string.</param>
        /// <returns>HttpBadRequest wenn die Variable createOrUpdateRouteJson.Route null ist.</returns>
        /// <returns>HttpOkObjectResult mit der Variable Success, diese enthält das erstellte Routeobjekt bzw. das geänderte Routeobjekt .</returns>
        /// <author>Duc Viet Pham Le</author>
        [HttpPost]
        [Route("[action]")]
        public IActionResult CreateOrUpdateRoute(string json)
        {
            var createOrUpdateRouteJson = JsonConvert.DeserializeObject<CreateAndUpdateRouteJson>(json);

            if (createOrUpdateRouteJson.Route == null || createOrUpdateRouteJson.RouteWaypoints == null)
            {
                return HttpBadRequest();
            }

            var success = (createOrUpdateRouteJson.Route.Id <= 0) ? 
                _applicationDbService.RouteDbService.CreateRoute(createOrUpdateRouteJson.Route, createOrUpdateRouteJson.RouteWaypoints) : 
                _applicationDbService.RouteDbService.UpdateRoute(createOrUpdateRouteJson.Route, createOrUpdateRouteJson.RouteWaypoints);

            return Ok(success);
        }

        // DELETE: /api/Route/DeleteRouteById
        /// <summary>REST-Schnittstelle, die eine Route anhand ihrer Id löscht.</summary>
        /// <param name="id">Route Id vom Typ int</param>
        /// <returns>HttpBadRequestResult, wenn eine nicht zulässige Route Id übergeben wurde.</returns>
        /// <returns>HttpOkObjectResult mit der id der gelöschten Route, wenn die Route in der Datenbank gelöscht wurde.</returns>
        /// <returns>HttpNotFoundObjectResult mit der Id der zu löschenden Route, wenn die Route mit dieser Id nicht in der Datenbank gefunden wurde.</returns>
        /// <author>Kevin Steinhagen</author>
        [HttpDelete]
        [Route("[action]")]
        public IActionResult DeleteRouteById(int id)
        {
            if (id < 0)
            {
                return HttpBadRequest();
            }

            var success = _applicationDbService.RouteDbService.DeleteRouteById(id);

            if (success)
            {
                return Ok(true);
            }
            else
            {
                return HttpNotFound(id);
            }
        }
    }
}
