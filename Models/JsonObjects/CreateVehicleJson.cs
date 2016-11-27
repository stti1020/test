namespace Flottenmanagement_WebApp.Models.JsonObjects
{
    public class CreateVehicleJson
    {
        public string RegistrationNumber { get; set; }

        public string VehicleTypeId { get; set; }

        public string[] PropertyIds { get; set; }

        public string[] Values { get; set; }
    }
}
