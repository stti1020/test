using System.Collections.Generic;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IUserDbService
    {
        List<User> GetAllUsers();

        User GetUserById(string id);

        User UpdateUser(User user);

        bool DeleteUser(string id);

        User UpdateProfilePicture(User user);
    }
}
