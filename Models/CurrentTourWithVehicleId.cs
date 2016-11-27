using System.Collections.Generic;

namespace Flottenmanagement_WebApp.Models
{
    public class CurrentTourWithVehicleId
    {
        public int VehicleId;

        public string RegistrationNumber;

        public int TourId;

        public string TourName;

        public string StartName;

        public double StartLongitude;

        public double StartLatitude;

        public string DestinationName;

        public double DestinationLongitude;

        public double DestinationLatitude;

        public double? Distance;

        public List<RouteWaypoint> Waypoints;
    }
}
