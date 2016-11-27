using Flottenmanagement_WebApp.Services;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;

namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class MapController : Controller
    {
        private readonly AppDbService _appDbService;
        private readonly MapService _mapService;

        //public MapController(IAppDbService appDbService)
        //{
        //    _appDbService = appDbService;
        //    _mapService = new MapService();

        //}

        public MapController()
        {
            _appDbService = new AppDbService();
            _mapService = new MapService();

        }

        // GET: /api/Map/GetAllGeopositions
        /// <summary>REST-Schnittstelle, die alle Geopositionen als Liste liefert.</summary>
        /// <returns>HttpNotFoundResult wenn keine Geoposition in der Datenbank zu finden ist.</returns>
        /// <returns>HttpOkObjectResult mit Liste aller Geopositionen.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllGeopositions()
        {
            var result = _appDbService.GeopositionDbService.GetAllGeopositions();

            if (result == null)
            {
                return HttpNotFound();
            }

            return Ok(result);
        }

        // GET: /api/Map/GetAllGeopositionsByRegistrationNumber
        /// <summary>REST-Schnittstelle, die alle Geopositionen eines Fahrzeugs liefert.</summary>
        /// <param name="registrationNumber">Kennzeichen eines Fahrzeugs vom Typ string.</param>
        /// <returns>HttpBadRequest wenn der Parameter registrationNumber null ist.</returns>
        /// <returns>HttpNotFoundObjectResult mit der übergebenen registrationNumber, wenn zu der registrationNumber kein Eintrag in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit Liste von Geopositionen.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllGeopositionsByRegistrationNumber(string registrationNumber)
        {
            if (string.IsNullOrEmpty(registrationNumber))
            {
                return HttpBadRequest();
            }

            var result = _appDbService.GeopositionDbService.GetAllGeopositionsByRegistrationNumber(registrationNumber);

            if (result == null)
            {
                return HttpNotFound(registrationNumber);
            }

            return Ok(result);
        }


        // GET: /api/Map/GetLatestGeopositionByRegistrationNumber
        /// <summary>REST-Schnittstelle, die die letzte Geoposition eines Fahrzeugs liefert.</summary>
        /// <param name="registrationNumber">Kennzeichen eines Fahrzeugs vom Typ string.</param>
        /// <returns>HttpBadRequest wenn der Parameter registrationNumber null ist.</returns>
        /// <returns>HttpNotFoundObjectResult mit der übergebenen registrationNumber, wenn zu der registrationNumber kein Eintrag in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit letzter Geoposition des geünschten Fahrzeugs.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetLatestGeopositionByRegistrationNumber(string registrationNumber)
        {
            if (string.IsNullOrEmpty(registrationNumber))
            {
                return HttpBadRequest();
            }

            var result = _appDbService.GeopositionDbService.GetLatestGeopositionByRegistrationNumber(registrationNumber);

            if (result == null)
            {
                return HttpNotFound(registrationNumber);
            }

            return Ok(result);
        }

        // GET: /api/Map/GetAllLatestGeopositions
        /// <summary>REST-Schnittstelle, die die letzten Geoposition aller Fahrzeuge liefert.</summary>
        /// <returns>HttpNotFoundObjectResult, wenn kein Eintrag in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit Liste der letzten Geoposition aller Fahrzeuge.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllLatestGeopositions()
        {
            var geopositions = _appDbService.GeopositionDbService.GetAllLatestGeopositions();

            if (geopositions == null)
            {
                return HttpNotFound();
            }

            return Ok(geopositions);
        }

        // GET: /api/Map/GetLatestGeopositionByRegistrationNumbers
        /// <summary>REST-Schnittstelle, die die letzte Geoposition der geünschten Fahrzeuge liefert.</summary>
        /// <param name="registrationNumbers">Jsonobjekt, das die Kennzeichen der gewünschten Fahrzeuge enthält.</param>
        /// <returns>HttpBadRequest wenn der Parameter registrationNumbers null ist.</returns>
        /// <returns>HttpNotFoundObjectResult mit den übergebenen registrationNumbers, wenn für diese keine Einträge in der Datenbank gefunden wurden.</returns>
        /// <returns>HttpOkObjectResult mit Liste von Geopositionen der gewünschten Fahrzeuge.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetLatestGeopositionByRegistrationNumbers(string registrationNumbers)
        {
            if (string.IsNullOrEmpty(registrationNumbers))
            {
                var geopositions = _appDbService.GeopositionDbService.GetAllLatestGeopositions();
                var realTimeData = _appDbService.ObdLogDbService.GetAllLatestObdLogs();
                var obdCommands = _appDbService.ObdCommandDbService.GetAllObdCommands();

                if (geopositions == null || realTimeData == null)
                {
                    return HttpNotFound(registrationNumbers);
                }

                var realTimeDataResultList = _mapService.MergeData(geopositions, realTimeData, obdCommands);

                return Ok(realTimeDataResultList);
            }
            else
            {
                var geopositions = _appDbService.GeopositionDbService.GetLatestGeopositionByRegistrationNumbers(registrationNumbers);
                var realTimeData = _appDbService.ObdLogDbService.GetLatestObdLogsByRegistrationNumbers(registrationNumbers);
                var obdCommands = _appDbService.ObdCommandDbService.GetAllObdCommands();

                if (geopositions == null || realTimeData == null)
                {
                    return HttpNotFound(registrationNumbers);
                }

                var realTimeDataResultList = _mapService.MergeData(geopositions, realTimeData, obdCommands);

                return Ok(realTimeDataResultList);
            }
        }

        // GET: /api/Map/GetAllRegistrationNumbersWithGeoposition
        /// <summary>REST-Schnittstelle, die Kennzeichen, die mindestens eine Geoposition haben liefert.</summary>
        /// <returns>HttpNotFoundObjectResult, wenn kein Eintrag in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit Liste von Geopositionen von Fahrzeugen, die mindestens eine Geoposition haben.</returns>
        /// <author>Duc Viet Pham Le</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllRegistrationNumbersWithGeoposition()
        {
            var result = _appDbService.GeopositionDbService.GetAllRegistrationNumbersWithGeoposition();

            if (result == null)
            {
                return HttpNotFound();
            }

            return Ok(result);
        }


        // GET: /api/Map/GetGeopositionsForSimulationByRegistrationNumber
        /// <summary>REST-Schnittstelle, die Daten für die Simulation eines Fahrzeuges liefert.</summary>
        /// <returns>HttpNotFoundObjectResult, wenn kein Eintrag in der Datenbank gefunden wurde.</returns>
        /// <returns>BadRequest, wenn kein Kennzeichen mitgegeben wurde.</returns>
        /// <returns>HttpOkObjectResult wenn eine Liste mit Simulationsdaten zurückgegeben wird.</returns>
        /// <author>Tizian Stegmüller</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetGeopositionsForSimulationByRegistrationNumber(string registrationNumber)
        {
            if (string.IsNullOrEmpty(registrationNumber))
            {
                return HttpBadRequest();
            }

            var geopositions =
                _appDbService.GeopositionDbService.GetSimulationGeopositionsByRegistrationNumber(registrationNumber);
            var obdLogs = _appDbService.ObdLogDbService.GetSimulationObdLogsByRegistrationNumber(registrationNumber);
            var obdCommands = _appDbService.ObdCommandDbService.GetAllObdCommands();

            if (geopositions == null || obdLogs == null)
            {
                return HttpNotFound();
            }

            var result = _mapService.MergeGeopositionsWithObdLog(geopositions, obdLogs, obdCommands);

            if (result == null || result.Count == 0)
            {
                return HttpNotFound();
            }

            return Ok(result);
        }
    }
}

