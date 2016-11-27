using System.Collections.Generic;

namespace Flottenmanagement_WebApp.Models.JsonObjects
{
    public class CreateAndUpdateTourJson
    {
        public Tour Tour { get; set; }

        public TourSeries TourSeries { get; set; }

        public List<int> VehicleIds { get; set; }
    }
}
