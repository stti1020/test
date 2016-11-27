using Flottenmanagement_WebApp.Models;
using System.Collections.Generic;

namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IPropertyDbService
    {
        List<Property> GetAllProperties();
    }
}
