using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace Flottenmanagement_WebApp.Services
{
    public class UserDbService : IUserDbService
    {
        private readonly ApplicationDbService _applicationDbService;

        internal UserDbService(ApplicationDbService appDbService)
        {
            _applicationDbService = appDbService;
        }

        /// <summary>Methode, die alle registrierten User als Liste liefert.</summary>
        /// <returns>Liste von Usern.</returns>
        public List<User> GetAllUsers()
        {
           return _applicationDbService.Context.User.ToList();
        }


        /// <summary>Methode, die einen User anhand seiner ID liefert</summary>
        /// <param name="id">Id eines Users vom Typ int</param>
        /// <returns>User Objekt, wenn ein User zu übergebenen ID gefunden wurde.</returns>
        public User GetUserById(string id)
        {
           return _applicationDbService.Context.User.FirstOrDefault(u => u.Id == id);
        }

        /// <summary>Methode, die die Eigenschaften des übergebenen Users ändert und diesen User zurück gibt.</summary>
        /// <param name="user">Objekt vom Typ User.</param>
        /// <returns>Den geänderten User, wenn zur übergebenen ID ein User in der Datenbank gefunden wurde.</returns>
        public User UpdateUser(User user)
        {
            var originalUser = _applicationDbService.UserDbService.GetUserById(user.Id);
            originalUser.FirstName = user.FirstName;
            originalUser.LastName = user.LastName;
            _applicationDbService.Context.SaveChanges();
            return originalUser; 
        }

        /// <summary>Methode, die das Bild des übergbenen Users updatet.</summary>
        /// <param name="user">Objekt vom Typ User</param>
        /// <returns>Geupdatetes Objekt vom Typ User.</returns>
        public User UpdateProfilePicture(User user)
        {
            var usertoUpdate = _applicationDbService.UserDbService.GetUserById(user.Id);
            usertoUpdate.ProfilePicture = user.ProfilePicture;
            _applicationDbService.Context.SaveChanges();
            usertoUpdate.ProfilePicture = user.ProfilePicture;
            return usertoUpdate;
        }

        /// <summary>Methode, die einen Nutzer anhand seiner ID aus der Datenbank löscht.</summary>
        /// <param name="id">User ID vom Typ string</param>
        /// <returns>True, wenn der User erfolgreich gelöscht wurde. False, wenn er nicht gelöscht werden konnte.</returns>
        public bool DeleteUser(string id)
        {
            var success = true;

            try
            {
                var userToDelete = _applicationDbService.UserDbService.GetUserById(id);

                if (userToDelete == null)
                {
                    success = false;
                }
                else
                {
                    _applicationDbService.Context.User.Remove(userToDelete);
                    _applicationDbService.Context.SaveChanges();
                }
            }
            catch
            {
                success = false;
            }

            return success;
        }
    }
}
