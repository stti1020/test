using System;
using Flottenmanagement_WebApp.Services;
using Flottenmanagement_WebApp.Models.JsonObjects;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;


namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class TourController : Controller
    {
        private readonly ApplicationDbService _applicationDbService;

        //public TourController(IApplicationDbService applicationDbService)
        //{
        //    _applicationDbService = applicationDbService;
        //}

        // !!Wichtig bei Production verwenden wir diesen Kontruktor, der Kontruktor mit Parametern wird auskommentiert!!
        public TourController()
        {
            _applicationDbService = new ApplicationDbService();
        }


        /// <summary>Schnittstelle zum Löschen einer Tour anhand ihrer Id</summary>
        /// <param name="id">Id der zu löschenden Tour</param>
        /// <returns>Ob das Löschen der Tour erfolgreich war</returns>
        [HttpDelete]
        [Route("[action]")]
        public IActionResult DeleteTourById(int id)
        {
            if (id < 0)
            {
                return HttpBadRequest();
            }

            var success = _applicationDbService.TourDbService.DeleteTourById(id);

            if (success)
            {
                return Ok(true);
            }
            else
            {
                return HttpNotFound();
            }
        }

        // GET: /api/Tour/GetAllTours
        /// <summary>REST-Schnittstelle, die alle Touren als Liste liefert.</summary>
        /// <returns>HttpNotFoundResult wenn keine Touren in der Datenbank zu finden sind.</returns>
        /// <returns>HttpOkObjectResult mit Liste aller Touren.</returns>
        /// <author>Kevin Steinhagen</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllTours()
        {
            var tourList = _applicationDbService.TourDbService.GetAllTours();

            if (tourList == null)
            {
                return HttpNotFound();
            }

            return Ok(tourList);
        }

        // GET: /api/Tour/GetTourById
        /// <summary>REST-Schnittstelle, die eine Tour anhand der zugehörigen Id zurückgibt.</summary>
        /// <param name="id">id einer Tour vom Typ int.</param>
        /// <returns>HttpNotFoundObjectResult mit der übergebenen id, wenn zu der id kein Eintrag in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpBadRequest wenn der übergebene Parameter id null ist.</returns>
        /// <returns>HttpOkObjectResult mit einer Tour zur passenden id.</returns>
        /// <author>Kevin Steinhagen</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetTourById(int id)
        {
            var tour = _applicationDbService.TourDbService.GetTourById(id);

            if (tour == null)
            {
                return HttpNotFound(id);
            }

            return Ok(tour);
        }

        // GET: /api/Tour/GetAllToursByDateRange
        /// <summary>REST-Schnittstelle, die eine Liste von Touren, deren Startzeit im mitgegebenen Zeitraum liegt, zurückgibt.</summary>
        /// <param name="rangeFrom">Startdatum, legt den Start des Zeitraums fest indem die Touren, deren Startzeit im mitgegebenen Zeitraum liegen, aus der Datenbank geholt werden, ist vom Typ string.</param>
        /// <param name="rangeTo">Enddatum, legt das Ende des Zeitraums fest indem die Touren, deren Startzeit im mitgegebenen Zeitraum liegen, aus der Datenbank geholt werden, ist vom Typ string.</param>
        /// <returns>HttpNotFoundObjectResult wenn zum mitgegebenen Zeitintervall keine Touren, deren Startzeit im mitgegebenen Zeitraum liegen, in der Datenbank gefunden wurden.</returns>
        /// <returns>HttpBadRequest wenn einer der übergebenen Parameter null ist.</returns>
        /// <returns>HttpOkObjectResult mit einer Liste aus Touren, deren Startzeit im mitgegebenen Zeitraum liegen.</returns>
        /// <author>Kevin Steinhagen</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllToursByDateRange(string rangeFrom, string rangeTo)
        {
            var tourList = _applicationDbService.TourDbService.GetAllToursByDateRange(DateTime.Parse(rangeFrom), DateTime.Parse(rangeTo));

            if (tourList == null)
            {
                return HttpNotFound();
            }

            return Ok(tourList);
        }

        // POST: /api/Tour/CreateAndUpdateTour
        /// <summary>REST-Schnittstelle, die eine Tour anlegt oder ändert.</summary>
        /// <param name="json">ein Tourobjekt im json Format, vom Typ string.</param>
        /// <returns>HttpBadRequest wenn die Variable createAndUpdateTourJson.Tour null ist.</returns>
        /// <returns>HttpOkObjectResult mit der Variable Success, diese enthält das erstellte Tourobjekt bzw. das geänderte Tourobjekt .</returns>
        /// <author>Duc Viet Pham Le</author>
        [HttpPost]
        [Route("[action]")]
        public IActionResult CreateAndUpdateTour(string json)
        {
            var createAndUpdateTourJson = JsonConvert.DeserializeObject<CreateAndUpdateTourJson>(json);

            if (createAndUpdateTourJson.Tour == null )
            {
                return HttpBadRequest();
            }

            var success = (createAndUpdateTourJson.Tour.Id <= 0) ? 
                _applicationDbService.TourDbService.CreateTour(createAndUpdateTourJson.Tour, createAndUpdateTourJson.VehicleIds, createAndUpdateTourJson.TourSeries) :
                _applicationDbService.TourDbService.UpdateTour(createAndUpdateTourJson.Tour, createAndUpdateTourJson.VehicleIds, createAndUpdateTourJson.TourSeries);
          
            return Ok(success);

        }

        /// <summary>Schnittstelle, die die aktuelle Tour eines Fahrzeug zurückgibt</summary>
        /// <param name="vehicleId">Id des Fahrzeugs</param>
        /// <returns>Aktuelle Tour des Fahrzeugs, oder Meldung, dass das Fahrzeug keine aktuelle Tour hat</returns>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCurrentTourByVehicleId(int vehicleId)
        {
            if (vehicleId <= 0 )
            {
                return HttpBadRequest();
            }

            var tour = _applicationDbService.TourDbService.GetCurrentTourByVehicleId(vehicleId);

            if (tour == null)
            {
                return HttpNotFound();
            }

            return Ok(tour);
        }
    }
}
