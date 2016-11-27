namespace Flottenmanagement_WebApp.Models
{
    //Attributnamen stimmen nicht mit der Namenskonvention überein, 
    //da bei der gegebenen Datenbank (flottenmanagement_db) die Konvention nicht eingehalten wurde
    public class ObdProperty
    {
        public ObdProperty(string command, string property, string result, string unit)
        {
            this.command = command;
            this.property = property;
            this.result = result;
            this.unit = unit;
        }

        public string command { get; set; }

        public string property { get; set; }

        public string result { get; set; }

        public string unit { get; set; }
    }
}
