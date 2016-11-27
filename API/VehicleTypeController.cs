using Microsoft.AspNet.Mvc;
using Flottenmanagement_WebApp.Services;
using Microsoft.AspNet.Authorization;

namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class VehicleTypeController : Controller
    {
        private readonly ApplicationDbService _applicationDbService;

        //public VehicleTypeController(IApplicationDbService applicationDbService)
        //{
        //    _applicationDbService = applicationDbService;
        //}

        // !!Wichtig bei Production verwenden wir diesen Kontruktor, der Kontruktor mit Parametern wird auskommentiert!!
        public VehicleTypeController()
        {
            _applicationDbService = new ApplicationDbService();
        }

        // GET: /api/vehicleType/GetAllVehicleTypes
        /// <summary>REST-Schnittstelle, die eine Liste aller VehcilesTypes liefert.</summary>
        /// <returns>HttpNotFoundObjectResult, wenn kein VehicleType in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit einer Liste vom Typ VehicleType, wenn in der Datenbank mindestens ein VehicleType gefunden wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllVehicleTypes()
        {
            var result = _applicationDbService.VehicleTypeDbService.GetAllVehicleTypes();

            if (result == null)
            {
                return HttpNotFound();
            }

            return Ok(result);
        }
    }
}
