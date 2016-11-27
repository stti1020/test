using Flottenmanagement_WebApp.Services;
using Microsoft.AspNet.Mvc;
using System;
using Microsoft.AspNet.Authorization;

namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class TourSeriesController : Controller
    {
        private readonly ApplicationDbService _applicationDbService;

        //public TourSeriesController(IApplicationDbService applicationDbService)
        //{
        //    _applicationDbService = applicationDbService;
        //}

        //!!Wichtig bei Production verwenden wir diesen Kontruktor, der Kontruktor mit Parametern wird auskommentiert!!
        public TourSeriesController()
        {
            _applicationDbService = new ApplicationDbService();
        }

        /// <summary>Schnittstelle zum Löschen einer Tourserie anhand ihrer ID</summary>
        /// <param name="id">Id der zu löschenden Tourserie</param>
        /// <returns>Ob löschen geklappt hat, oder nicht</returns>
        [HttpDelete]
        [Route("[action]")]
        public IActionResult DeleteTourSeriesById(int id)
        {
            if (id < 0)
            {
                return HttpBadRequest();
            }

            var success =
                _applicationDbService.TourSeriesDbService.DeleteTourSeriesById(id);

            if (success)
            {
                return Ok(true);
            }
            else
            {
                return HttpNotFound();
            }
        }

        /// <summary>Schnittstelle, die alle Tourserien zurückgibt, welche zwischen zwei Daten liegen</summary>
        /// <param name="rangeFrom">Startdatumswert</param>
        /// <param name="rangeTo">Enddatumswert</param>
        /// <returns>Tourserien, die zwischen den zwei Daten liegen</returns>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllTourSeriesByDateRange(string rangeFrom, string rangeTo)
        {
            var tourList = _applicationDbService.TourSeriesDbService.GetAllTourSeriesByDateRange(DateTime.Parse(rangeFrom), DateTime.Parse(rangeTo));

            if (tourList == null)
            {
                return HttpNotFound();
            }

            return Ok(tourList);
        }
    }
}