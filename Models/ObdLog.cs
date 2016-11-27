using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flottenmanagement_WebApp.Models
{
    //Attributnamen stimmen nicht mit der Namenskonvention überein, 
    //da bei der gegebenen Datenbank (flottenmanagement_db) die Konvention nicht eingehalten wurde
    [Table("ObdLog", Schema = "flottenmanagement")]
    public class ObdLog
    {
        [Key]
        public string id { get; set; }

        [Required]
        public DateTimeOffset __createdAt { get; set; }

        [Required]
        public string command { get; set; }

        [Required]
        public string result { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Kennzeichen darf maximal 50 Zeichen haben")]
        public string registrationNumber { get; set; }
    }
}
