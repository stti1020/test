using Microsoft.AspNet.Mvc;
using Flottenmanagement_WebApp.Services;
using Microsoft.AspNet.Authorization;

namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class PropertyController : Controller
    {
        private readonly ApplicationDbService _applicationDbService;

        //public PropertyController(IApplicationDbService applicationDbService)
        //{
        //    _applicationDbService = applicationDbService;
        //}

        // !!Wichtig bei Production verwenden wir diesen Kontruktor, der Kontruktor mit Parametern wird auskommentiert!!
        public PropertyController()
        {
            _applicationDbService = new ApplicationDbService();
        }

        // GET: /api/property/GetAllProperties
        /// <summary>REST-Schnittstelle, die alle Properties liefert.</summary>
        /// <returns>HttpNotFoundObjectResult, wenn keine Property in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit einer Liste von Properties, wenn in der Datenbank mindestens eine Property gefunden wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllProperties()
        {
            var result = _applicationDbService.PropertyDbService.GetAllProperties();

            if (result == null)
            {
                return HttpNotFound();
            }

            return Ok(result);
        }
    }
}
