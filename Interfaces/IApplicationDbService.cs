
namespace Flottenmanagement_WebApp.Interfaces
{
    public interface IApplicationDbService
    {
        IVehicleDbService VehicleDbService { get; }

        IPropertyDbService PropertyDbService { get; }

        IVehiclePropertyDbService VehiclePropertyDbService { get; }

        IUserDbService UserDbService { get; }

        IVehicleTypeDbService VehicleTypeDbService { get; }

        ITourDbService TourDbService { get; }

        ITourSeriesDbService TourSeriesDbService { get; }

        ITourVehicleDbService TourVehicleDbService { get; }

        IRouteDbService RouteDbService { get; }

        IRouteWaypointDbService RouteWaypointDbService { get; }
    }
}
