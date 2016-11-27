using Flottenmanagement_WebApp.Services;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;


namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class TourVehicleController : Controller
    {
        private readonly ApplicationDbService _applicationDbService;

        //public TourVehicleController(IApplicationDbService applicationDbService)
        //{
        //    _applicationDbService = applicationDbService;
        //}

        //!!Wichtig bei Production verwenden wir diesen Kontruktor, der Kontruktor mit Parametern wird auskommentiert!!
        public TourVehicleController()
        {
            _applicationDbService = new ApplicationDbService();
        }

        // GET: /api/TourVehicle/GetVehiclesByTourId
        /// <summary>REST-Schnittstelle, die eine Liste von TourVehicles anhand der zugehörigen Tour Id liefert.</summary>
        /// <param name="id">Tour Id vom Typ int</param>
        /// <returns>HttpNotFoundObjectResult, wenn die Vehicles mit der tour Id nicht in der Datenbank gefunden wurden.</returns>
        /// <returns>HttpOkObjectResult mit der Liste vom Typ Vehicle, wenn in der Datenbank ein Vehicle mit der passenden tour Id gefunden wurde.</returns>
        /// <author>Kevin Steinhagen</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllTourVehiclesByTourId(int id)
        {
            var vehicleList = _applicationDbService.TourVehicleDbService.GetAllTourVehiclesByTourId(id);

            if (vehicleList == null )
            {
                return HttpNotFound(id);
            }

            return Ok(vehicleList);
        }
    }
}