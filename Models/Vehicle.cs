using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flottenmanagement_WebApp.Models
{
    [Table("Vehicle")]
    public class Vehicle
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [Required]
        public int VehicleTypeId { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Kennzeichen darf maximal 50 Zeichen haben")]

        public string RegistrationNumber { get; set; }

        [ForeignKey("VehicleTypeId")]
        public virtual VehicleType VehicleType { get; set; }

        public byte[] Picture { get; set; }
    }
}
