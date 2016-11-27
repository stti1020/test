using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace Flottenmanagement_WebApp.Services
{
    public class PropertyDbService : IPropertyDbService
    {
        internal ApplicationDbService ApplicationDbService;

        internal PropertyDbService(ApplicationDbService appDbService)
        {
            ApplicationDbService = appDbService;
        }

        /// <summary>Methode, die alle Properties liefert.</summary>
        /// <returns>Liste von Properties.</returns>
        public List<Property> GetAllProperties()
        {
            return ApplicationDbService.Context.Property.ToList();
        }
    }
}
