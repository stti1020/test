using Flottenmanagement_WebApp.Interfaces;
using Flottenmanagement_WebApp.Models;

namespace Flottenmanagement_WebApp.Services
{
    public class ApplicationDbService : IApplicationDbService
    {
        internal readonly ApplicationDbContext Context;

        internal readonly IUserDbService userDbService;

        internal readonly IPropertyDbService propertyDbService;

        internal readonly IRouteDbService routeDbService;

        internal readonly IRouteWaypointDbService routeWaypointDbService;

        internal readonly ITourDbService tourDbService;

        internal readonly ITourSeriesDbService tourSeriesDbService;

        internal readonly ITourVehicleDbService tourVehicleDbService;

        internal readonly IVehicleDbService vehicleDbService;

        internal readonly IVehicleTypeDbService vehicleTypeDbService;

        internal readonly IVehiclePropertyDbService vehiclePropertyDbService;

        /// <summary>ApplicationDBService-Konstruktor, hier müssen alle genutzten Services aufgeführt werden</summary>
        internal ApplicationDbService()
        {
            Context = new ApplicationDbContext();

            userDbService = new UserDbService(this);

            propertyDbService = new PropertyDbService(this);

            routeDbService = new RouteDbService(this);

            routeWaypointDbService = new RouteWaypointDbService(this);

            vehicleDbService = new VehicleDbService(this);

            vehicleTypeDbService = new VehicleTypeDbService(this);

            vehiclePropertyDbService = new VehiclePropertyDbService(this);

            tourDbService = new TourDbService(this);

            tourVehicleDbService = new TourVehicleDbService(this);

            tourSeriesDbService = new TourSeriesDbService(this);
        }

        public IVehicleDbService VehicleDbService
        {
            get { return vehicleDbService; }
        }

        public IPropertyDbService PropertyDbService
        {
            get { return propertyDbService; }
        }

        public IRouteDbService RouteDbService
        {
            get { return routeDbService; }
        }

        public IRouteWaypointDbService RouteWaypointDbService
        {
            get { return routeWaypointDbService; }
        }

        public IVehiclePropertyDbService VehiclePropertyDbService
        {
            get { return vehiclePropertyDbService; }
        }

        public IUserDbService UserDbService
        {
            get { return userDbService; }
        }

        public IVehicleTypeDbService VehicleTypeDbService
        {
            get { return vehicleTypeDbService; }
        }

        public ITourDbService TourDbService
        {
            get { return tourDbService; }
        }
        
        public ITourVehicleDbService TourVehicleDbService
        {
            get { return tourVehicleDbService; }
        }
        public ITourSeriesDbService TourSeriesDbService
        {
            get { return tourSeriesDbService; }
        }
    }
}
