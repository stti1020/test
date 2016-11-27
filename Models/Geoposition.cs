using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flottenmanagement_WebApp.Models
{
    [Table("DeviceGeoposition", Schema = "flottenmanagement")]
    public class Geoposition
    {
        [Key]
        public string id{ get; set; }
         
        public DateTimeOffset __createdAt { get; set; }

        public Double latitude { get; set; }
        
        public Double longitude { get; set; }
        
        [MaxLength(50, ErrorMessage = "Kennzeichen darf maximal 50 Zeichen haben")]
        public string registrationNumber { get; set; }
    }
}
