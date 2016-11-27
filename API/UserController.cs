using System;
using System.IO;
using Microsoft.AspNet.Mvc;
using Flottenmanagement_WebApp.Models;
using Flottenmanagement_WebApp.Services;
using Microsoft.AspNet.Authorization;
using Newtonsoft.Json;

namespace Flottenmanagement_WebApp.API
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly ApplicationDbService _applicationDbService;

        //public UserController(IApplicationDbService applicationDbService)
        //{
        //    _applicationDbService = applicationDbService;
        //}

        // !!Wichtig bei Production verwenden wir diesen Kontruktor, der Kontruktor mit Parametern wird auskommentiert!!
        public UserController()
        {
            _applicationDbService = new ApplicationDbService();
        }


        // GET: /api/User/GetAllUsers
        /// <summary>REST-Schnittstelle, die alle registrierten User als Array liefert.</summary>
        /// <returns>HttpNotFoundResult wenn keine User in der Datenbank zu finden sind.</returns>
        /// <returns>HttpOkObjectResult mit Liste aller User, die im System registriert sind.</returns>
        /// <author>Julian Schnurr</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllUsers()
        {
            var userList = _applicationDbService.UserDbService.GetAllUsers();

            if (userList == null)
            {
                return HttpNotFound();
            }

            return Ok(userList);
        }

        // GET: /api/User/GetUserById
        /// <summary>REST-Schnittstelle, die einen User anhand seiner ID liefert</summary>
        /// <param name="id">ID eines Users vom Typ int</param>
        /// <returns>HttpBadRequest wenn der Parameter id null ist.</returns>
        /// <returns>HttpNotFoundObjectResult mit der übergebenen ID, wenn zu der Id kein User-Objekt gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit einem User Objekt, wenn ein User zu übergebenen ID gefunden wurde.</returns>
        /// <author>Julian Schnurr</author>
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetUserById(string id)
        {
            if (id == null)
            {
                return HttpBadRequest();
            }

            var user = _applicationDbService.UserDbService.GetUserById(id);

            if (user == null)
            {
                return HttpNotFound(id);
            }

            return Ok(user);
        }

        // PUT: /api/User/UpdateUser
        /// <summary>REST-Schnittstelle, die die Eigenschaften des übergebenen Users ändert und diesen User zurück gibt.</summary>
        /// <param name="user">Objekt vom Typ User.</param>
        /// <returns>BadReqeustResult, wenn der übergebene User nicht vorhanden ist.</returns>
        /// <returns>HttpNotFoundObjectResult mit dem übergebenen User, wenn zur ID des übergebenen Users kein User in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit dem geänderten User, wenn zur übergebenen ID ein User in der Datenbank gefunden wurde.</returns>
        /// <author>Julian Schnurr</author>
        [HttpPut]
        [Route("[action]")]
        public IActionResult UpdateUser(User user)
        {
            if (user.Id == null)
            {
                return HttpBadRequest();
            }

            var updatedUser = _applicationDbService.UserDbService.UpdateUser(user);

            if (updatedUser == null)
            {
                return HttpNotFound(user);
            }

            return Ok(updatedUser);
        }

        // DELETE: /api/User/DeleteUser
        /// <summary>REST-Schnittstelle, die einen Nutzer anhand seiner ID aus der Datenbank löscht.</summary>
        /// <param name="id">User ID vom Typ string</param>
        /// <returns>BadRequestResult, wenn die übergebene ID nicht vorhanden ist.</returns>
        /// <returns>HttpNotFoundObjectResult mit false, wenn zur angegebenen ID kein User in der Datenbank gefunden wurde.</returns>
        /// <returns>HttpOkObjectResult mit true, wenn der User erfolgreich gelöscht wurde.</returns>
        /// <author>Julian Schnurr</author>
        [HttpDelete]
        [Route("[action]")]
        public IActionResult DeleteUser(string id)
        {
            if (id == null)
            {
                return HttpBadRequest();
            }

            var success = _applicationDbService.UserDbService.DeleteUser(id);

            if (success)
            {
                return Ok(true);
            }
            else
            {
                return HttpNotFound(id);
            }
        }

        // PUT: /api/User/UpdatePicture
        /// <summary>REST-Schnittstelle, die das Bild des übergbenen Users updatet.</summary>
        /// <param name="user">Objekt vom Typ User</param>
        /// <returns>JsonResult mit dem geupdateten Objekt vom Typ User.</returns>
        /// <author>Julian Schnurr</author>
        [HttpPut]
        [Route("[action]")]
        public JsonResult UpdateProfilePicture(User user)
        {
            // Speichert Body des Requests in einem String und kürzt einen Teil am Anfang, sodass nur dass der JSON string übrig bleibt
            var pictureAsBase64String = new StreamReader(Request.Body).ReadToEnd();

            try
            {
                pictureAsBase64String.Remove(0, 55);
            }
            catch (ArgumentOutOfRangeException e)
            {
                return Json(e);
            }

            // Speichert das ProfilBild in einem Container
            var container = JsonConvert.DeserializeObject<PictureContainer>(pictureAsBase64String);

            // Codiert das Profilbild von Base64-Format in einen Byte-Array und speichert in bei dem Benutzer als ProfilePicture
            user.ProfilePicture = Convert.FromBase64String(container.Picture);

            return Json(_applicationDbService.UserDbService.UpdateProfilePicture(user));
        }
    }
}
