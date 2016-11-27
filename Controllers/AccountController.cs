using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Flottenmanagement_WebApp.Models;

using Flottenmanagement_WebApp.ViewModels.Account;
using System.Security.Claims;

namespace Flottenmanagement_WebApp.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // GET: /controllers/Account/GetCurrentUser
        /// <summary>REST-Schnittstelle, die den angemeldeten Nutzer liefert.</summary>
        /// <returns>User, gibt den aktuell angemeldeten User zurück.</returns>
        [HttpGet]
        [Route("controllers/[controller]/[action]")]
        public async Task<User> GetCurrentUser()
        {
            return await _userManager.FindByIdAsync(HttpContext.User.GetUserId());
        }

        // GET: /Account/Login
        /// <summary>
        /// Schnittstelle, kann nur von .cshtml Dateien genutzt werden und ist nicht durch das Front-End ansprechbar.
        /// Liefert die View für die Login Seite.
        /// </summary>
        /// <returns>View, gibt die Login.cshtml Seite zurück.</returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }

        //
        // POST: /Account/Login
        /// <summary>
        /// Schnittstelle, kann nur von .cshtml Dateien genutzt werden und ist nicht durch das Front-End ansprechbar.
        /// Meldet einen Nutzer am System an.
        /// </summary>
        /// <param name="model">LoginViewModel, enthält die Eingabedaten der Inputfelder der Loginseite.</param>
        /// <returns>View, bei erfolgreichem Login wird die Index.cshtml zurückgegeben</returns>
        /// <returns>View, bei ungültigem Login, wird die mit Fehlermeldungen versehenen Login.cshtml zurückgegeben.</returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Ungültiger Anmeldeversuch.");
                    return View(model);
                }
            }

            return View(model);
        }

        // GET: /Account/Register
        /// <summary>
        /// Schnittstelle, wird nur von .cshtml Datein genutzt und ist nicht durch das Front-End anprechbar.
        /// Liefert die View für die Registrieren Seite.
        /// </summary>
        /// <returns>View, gibt die Register.cshtml Seite zurück.</returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Register()
        {
            return View();
        }

        // POST: /Account/Register
        /// <summary>
        /// Schnittstelle, wird nur von .cshtml Datein genutzt und ist nicht durch das Front-End anprechbar.
        /// Registriert einen Nutzer im System und meldet ihn direkt an.
        /// </summary>
        /// <param name="model">RegisterViewModel, enthält die Eingabedaten der Inputfelder der Registrierungsseite.</param>
        /// <returns>View, gibt die Index.cshtml zurück, sofern die Registrierungsseite sich nicht in einem invaliden Status befindet und die Registrierung erfolgreich war.</returns>
        /// <returns>
        /// View, wenn die Registrierungsseite sich in einem validen Status befindet, jedoch die Eingabedaten invalide sind 
        /// wird die mit Fehlermeldungen versehene Register.cshtml zurückgeliefert.
        /// </returns>
        /// <returns>View, befindet sich die Registrierungsseite in einem invaliden Status wird die Registrierungsseite erneut zurückgeliefert.</returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new User { UserName = model.Email, Email = model.Email, FirstName = model.FirstName,  LastName = model.LastName, CreateDate = DateTime.Now };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return RedirectToAction("Index", "Home");
                }

                AddErrors(result);
            }

            return View(model);
        }

        // POST: /controllers/Account/LogOff
        /// <summary>REST-Schnittstelle, die ineen angemeldeten Nutzer vom System abmeldet.</summary>
        /// <returns>HttpOkResult, wenn der Nutzer ausgeloggt wurde.</returns>
        [HttpPost]
        [Route("controllers/[controller]/[action]")]
        public async Task<IActionResult> LogOff()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        #region Helpers

        /// <summary>Methode, die Fehlermeldungen für die .cshtml-Dateien bei falscher Eingabe verfügbar macht.</summary>
        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        #endregion
    }
}
