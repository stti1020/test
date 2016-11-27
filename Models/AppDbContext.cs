using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;

namespace Flottenmanagement_WebApp.Models
{
    public class AppDbContext: IdentityDbContext<User>
    {
        public DbSet<Geoposition> Geoposition { get; set; }

        public DbSet<ObdLog> ObdLog { get; set; }

        public DbSet<ObdCommand> ObdCommand { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //ConnectionString für AzureDB
            //optionsBuilder.UseSqlServer("Server=tcp:o1mhadospv.database.windows.net,1433;Database=flottenmanagement_webapp;User ID=flottenmanagement-admin@o1mhadospv;Password=OKflotte2016;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

            //ConnectionString für Lokale DB (Julian's Laptop)
            optionsBuilder.UseSqlServer("Data Source=TIZIASN-TAB;Initial Catalog=flottenmanagement_mobileapp;Integrated Security=True");
        }
    }
}
