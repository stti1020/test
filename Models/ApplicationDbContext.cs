using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;

namespace Flottenmanagement_WebApp.Models
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<User> User { get; set; }

        public DbSet<Property> Property { get; set; }

        public DbSet<Route> Route { get; set; }

        public DbSet<RouteWaypoint> RouteWaypoint { get; set; }

        public DbSet<Tour> Tour { get; set; }

        public DbSet<TourSeries> TourSeries { get; set; }

        public DbSet<TourVehicle> TourVehicle { get; set; }

        public DbSet<Vehicle> Vehicle { get; set; }

        public DbSet<VehicleType> VehicleType { get; set; }

        public DbSet<VehicleProperty> VehicleProperty { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //ConnectionString für AzureDB
            //optionsBuilder.UseSqlServer("Server=tcp:o1mhadospv.database.windows.net,1433;Database=flottenmanagement_webapp;User ID=flottenmanagement-admin@o1mhadospv;Password=OKflotte2016;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

            //ConnectionString für Lokale DB (Julian's Laptop)
            optionsBuilder.UseSqlServer("Data Source=TIZIASN-TAB;Initial Catalog=flottenmanagement_webapp;Integrated Security=True");
        }
    }
}
