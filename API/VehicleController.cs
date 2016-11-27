using Microsoft.AspNet.Mvc;
using System;
using System.IO;
using Flottenmanagement_WebApp.Models;
using Newtonsoft.Json;
using Flottenmanagement_WebApp.Services;
using Microsoft.AspNet.Authorization;

namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class VehicleController : Controller
    {
        private readonly ApplicationDbService _applicationDbService;

        //public VehicleController(IApplicationDbService applicationDbService)
        //{
        //    _applicationDbService = applicationDbService;
        //}

        //!!Wichtig bei Production verwenden wir diesen Kontruktor, der Kontruktor mit Parametern wird auskommentiert!!
        public VehicleController()
        {
            _applicationDbService = new ApplicationDbService();
        }

        /// <summary>REST-Schnittstelle, die ein Fahrzeug mit einem bestimmten Kennzeichen zurückliefert</summary>
        /// <param name="registrationNumber">Kennzeichen</param>
        /// <returns>Fahrzeug mit Kennzeichen</returns>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetVehicleByRegistrationNumber(string registrationNumber)
        {
            return Ok(_applicationDbService.VehicleDbService.GetVehicleByRegistrationNumber(registrationNumber));
        }

        // GET: /api/vehicle/GetAllVehicles
        /// <summary>REST-Schnittstelle, die eine Liste aller Vehciles liefert.</summary>
        /// <returns>HttpNotFoundObjectResult, wenn kein Vehicle in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit einer Liste vom Typ Vehicle, wenn in der Datenbank mindestens ein Vehicle gefunden wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllVehicles()
        {
            var vehicleList = _applicationDbService.VehicleDbService.GetAllVehicles();

            if (vehicleList == null)
            {
                return HttpNotFound();
            }

            return Ok(vehicleList);
        }

        // GET: /api/vehicle/GetVehicleById
        /// <summary>REST-Schnittstelle, die ein Vehicle anhand seiner Id liefert.</summary>
        /// <param name="id">vehicle Id vom Typ int</param>
        /// <returns>HttpNotFoundObjectResult, wenn das Vehicle mit der Id nicht in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit dem Objekt vom Typ Vehicle, wenn in der Datenbank das Vehicle mit dieser Id gefunden wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetVehicleById(int id)
        {
            var vehicle = _applicationDbService.VehicleDbService.GetVehicleById(id);

            if (vehicle == null)
            {
                return HttpNotFound(id);
            }

            return Ok(vehicle);
        }

        // GET: /api/vehicle/GetAllProperties
        /// <summary>REST-Schnittstelle, die alle Properties liefert.</summary>
        /// <returns>HttpNotFoundObjectResult, wenn keine Property in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit einer Liste von Properties, wenn in der Datenbank mindestens eine Property gefunden wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllProperties()
        {
            var properties = _applicationDbService.PropertyDbService.GetAllProperties();

            if (properties == null)
            {
                return HttpNotFound();
            }

            return Ok(properties);
        }

        // GET: /api/vehicle/GetAllVehicleProperties
        /// <summary>REST-Schnittstelle, die alle VehicleProperties liefert.</summary>
        /// <returns>HttpNotFoundObjectResult, wenn keine VehicleProperty in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit einer Liste von VehicleProperties, wenn in der Datenbank mindestens eine VehicleProperty gefunden wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllVehicleProperties()
        {
            var vehicleProperties = _applicationDbService.VehiclePropertyDbService.GetAllVehicleProperties();

            if (vehicleProperties == null)
            {
                return HttpNotFound();
            }

            return Ok(vehicleProperties);
        }

        // GET: /api/vehicle/GetAllVehiclePropertiesByVehicleId
        /// <summary>REST-Schnittstelle, die alle VehicleProperties eines Vehicles, das anhand seiner Id gesucht wird, liefert.</summary>
        /// <param name="vehicleId">vehicle Id vom Typ int.</param>
        /// <returns>HttpNotFoundObjectResult, wenn keine VehicleProperty des Vehicles, das anhand seiner Id gesucht wird, in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit einer Liste von VehicleProperties des Vehicles, das anhand seiner Id gesucht wird, wenn in der Datenbank mindestens eine VehicleProperty gefunden wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllVehiclePropertiesByVehicleId(int vehicleId)
        {
            var vehicleProperties = _applicationDbService.VehiclePropertyDbService.GetAllVehiclePropertiesByVehicleId(vehicleId);

            if (vehicleProperties == null)
            {
                return HttpNotFound(vehicleId);
            }

            return Ok(vehicleProperties);
        }

        // DELETE: /api/vehicle/DeleteVehicleById
        /// <summary>REST-Schnittstelle, die ein Vehicle anhand seiner Id löscht.</summary>
        /// <param name="id">vehicle Id vom Typ int</param>
        /// <returns>HttpBadRequestResult, wenn eine nicht zulässige Vehicle Id übergeben wurde.</returns>
        /// <returns>HttpOkObjectResult mit true, wenn in der Datenbank das Vehicle mit dieser Id gelöscht wurde.</returns>
        /// <returns>HttpNotFoundObjectResult mit der Id des zu löschenden Vehicles, wenn das Vehicle mit der Id nicht in der Datenbank gefunden wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpDelete]
        [Route("[action]")]
        public IActionResult DeleteVehicleById(int id)
        {
            if (id < 0)
            {
                return HttpBadRequest();
            }

            var success = _applicationDbService.VehicleDbService.DeleteVehicleById(id);

            if (success)
            {
                return Ok(true);
            }
            else
            {
                return HttpNotFound(id);
            }
        }

        // PUT: /api/vehicle/UpdateVehicle
        /// <summary>REST-Schnittstelle, die registrationNumber, vehicleTypeId und vehicleProperties eines Vehicle anhand seiner Id updatet.</summary>
        /// <param name="id">vehicle Id vom Typ int</param>
        /// <param name="registrationNumber">registrationNumber vom Typ string</param>
        /// <param name="vehicleTypeId">vehicleTypeId vom Typ int</param>
        /// <param name="vehiclePropertiesJson">vehiclePropertiesJson vom Typ string</param>
        /// <returns>HttpBadRequestResult, wenn eine nicht zulässige Vehicle Id übergeben wurde.</returns>
        /// <returns>HttpOkObjectResult mit dem geupdateten Vehicle, wenn in der Datenbank das Vehicle mit dieser Id geupdatet wurde.</returns>
        /// <returns>HttpNotFoundObjectResult mit der Id des zu updateten Vehicles, wenn das Vehicle mit der Id nicht in der Datenbank gefunden wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpPut]
        [Route("[action]")]
        public IActionResult UpdateVehicle(int id, string registrationNumber, int vehicleTypeId, string vehiclePropertiesJson)
        {
            if (id < 0)
            {
                return HttpBadRequest();
            }

            var updatedVehicle = _applicationDbService.VehicleDbService.UpdateVehicle(id, registrationNumber, vehicleTypeId, vehiclePropertiesJson);

            if (updatedVehicle == null)
            {
                return HttpNotFound(id);
            }

            return Ok(updatedVehicle);
        }

        // POST: /api/vehicle/CreateVehicle
        /// <summary>REST-Schnittstelle, die ein Vehicle entgegen nimmt und in der Datenbank anlegt.</summary>
        /// <param name="createVehicleJson">createVehicleJson vom Typ string.</param>
        /// <returns>HttpBadRequestResult, wenn ein nicht zulässiges createVehicleJson übergeben wurde.</returns>
        /// <returns>HttpOkObjectResult mit dem angelegten Objekt vom Typ Vehicle, wenn in der Datenbank das Vehicle angelegt wurde.</returns>
        /// <author>Paul Pelludat</author>
        [HttpPost]
        [Route("[action]")]
        public IActionResult CreateVehicle(string createVehicleJson)
        {
            if (createVehicleJson == null)
            {
                return HttpBadRequest();
            }

            var createdVehicle = _applicationDbService.VehicleDbService.CreateVehicle(createVehicleJson);

            return Ok(createdVehicle);
        }

        // PUT: /api/vehicle/UpdatePicture
        /// <summary>REST-Schnittstelle, die das Bild des übergbenen Vehicles updatet.</summary>
        /// <param name="vehicle">Objekt vom Typ Vehicle</param>
        /// <returns>JsonResult mit dem geupdateten Vehicle, wenn in der Datenbank dieses Vehicle geupdated wurde.</returns>
        /// <author>Duc Viet Pham Le</author>
        [HttpPut]
        [Route("[action]")]
        public JsonResult UpdatePicture(Vehicle vehicle)
        {
            // Speichert Body des Requests in einem String und kürzt einen Teil am Anfang, sodass nur dass der JSON string übrig bleibt
            var pictureAsBase64String = new StreamReader(Request.Body).ReadToEnd();

            try
            {
                pictureAsBase64String.Remove(0, 55);
            }
            catch(ArgumentOutOfRangeException e)
            {
                return Json(e);
            }

            // Speichert das ProfilBild in einem Container
            var container = JsonConvert.DeserializeObject<PictureContainer>(pictureAsBase64String);

            // Codiert das Profilbild von Base64-Format in einen Byte-Array und speichert in bei dem Benutzer als ProfilePicture
            vehicle.Picture = Convert.FromBase64String(container.Picture);

            return Json(_applicationDbService.VehicleDbService.UpdatePicture(vehicle));
        }
    }
}

