using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flottenmanagement_WebApp.Models
{
    [Table("Route")]
    public class Route
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(256, ErrorMessage = "Startort darf maximal 256 Zeichen haben")]
        public string StartName { get; set; }

        [Required]
        public double StartLongitude { get; set; }

        [Required]
        public double StartLatitude { get; set; }

        [Required]
        [MaxLength(256, ErrorMessage = "Zielort darf maximal 256 Zeichen haben")]
        public string DestinationName { get; set; }

        [Required]
        public double DestinationLongitude { get; set; }

        [Required]
        public double DestinationLatitude { get; set; }

        [Column("Distanz")]
        public double? Distance { get; set; }
       
        public double? EstimatedDuration { get; set; }

        [NotMapped]
        public List<RouteWaypoint> Waypoints { get; set; }
    }
}
