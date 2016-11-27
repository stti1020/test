using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flottenmanagement_WebApp.Models
{
    [Table("Tour")]
    public class Tour
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public bool Done { get; set; }

        [Required]
        public int RouteId { get; set; }

        public int? TourSeriesId { get; set; }

        [ForeignKey("RouteId")]
        public virtual Route Route { get; set; }

        [ForeignKey("TourSeriesId")]
        public virtual TourSeries TourSeries { get; set; }

        [NotMapped]
        public List<TourVehicle> TourVehicles { get; set; }
    }
}
