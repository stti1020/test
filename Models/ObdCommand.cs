using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Flottenmanagement_WebApp.Models
{
    //Attributnamen stimmen nicht mit der Namenskonvention überein, 
    //da bei der gegebenen Datenbank (flottenmanagement_db) die Konvention nicht eingehalten wurde
    [Table("ObdCommand", Schema = "flottenmanagement")]
    public class ObdCommand
    {
        [Key]
        public int id { get; set; }

        [Required]
        public string command { get; set; }

        [Required]
        public string property { get; set; }

        [Required]
        public string unit { get; set; }
    }
}
