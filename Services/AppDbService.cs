using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Services
{
    public class AppDbService : IAppDbService
    {
        internal readonly AppDbContext Context;

        internal readonly IGeopositionDbService geopositionDbService;

        internal readonly IObdLogDbService obdLogDbService;

        internal readonly IObdCommandDbService obdCommandDbService;

        internal AppDbService()
        {
            Context = new AppDbContext();

            geopositionDbService = new GeopositionDbService(this);

            obdLogDbService = new ObdLogDbService(this);

            obdCommandDbService = new ObdCommandDbService(this);

        }

        public IGeopositionDbService GeopositionDbService
        {
            get { return geopositionDbService; }
        }

        public IObdLogDbService ObdLogDbService
        {
            get {  return obdLogDbService;}
        }

        public IObdCommandDbService ObdCommandDbService
        {
            get { return obdCommandDbService;}
        }
    }
}
