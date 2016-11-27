using System;
using Microsoft.AspNet.Identity.EntityFramework;
using System.ComponentModel.DataAnnotations;

namespace Flottenmanagement_WebApp.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class User : IdentityUser
    {
        [Required]
        public string FirstName { get; set; }

        [Required]

        public string LastName { get; set; }

        public byte[] ProfilePicture { get; set; }

        public bool Active { get; set; }

        public DateTime CreateDate { get; set; }

        public DateTime ChangeDate { get; set; }
    }
}
