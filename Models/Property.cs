﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flottenmanagement_WebApp.Models
{
    public class Property
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int PropertyId { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Kennzeichen darf maximal 50 Zeichen haben")]
        public string Name { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Kennzeichen darf maximal 50 Zeichen haben")]
        public string Unit { get; set; }
    }
}
