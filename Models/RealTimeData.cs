using System;
using System.Collections.Generic;

namespace Flottenmanagement_WebApp.Models
{
    public class RealTimeData
    {
        public RealTimeData(Geoposition geoposition)
        {
            CreatedAt = geoposition.__createdAt;
            Latitude = geoposition.latitude;
            Longitude = geoposition.longitude;
            RegistrationNumber = geoposition.registrationNumber;
        }

        public RealTimeData(Geoposition geoposition, List<ObdProperty> list)
        {
            CreatedAt = geoposition.__createdAt;
            Latitude = geoposition.latitude;
            Longitude = geoposition.longitude;
            RegistrationNumber = geoposition.registrationNumber;
            ObdPropertyList = list;
        }

        public DateTimeOffset CreatedAt { get; set; }

        public Double Latitude { get; set; }

        public Double Longitude { get; set; }

        public string RegistrationNumber { get; set; }

        public List <ObdProperty> ObdPropertyList { get; set; }
    }
}
