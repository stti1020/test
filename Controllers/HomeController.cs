using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Authorization;

namespace Flottenmanagement_WebApp.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        /// <summary>
        /// Schnittstelle, die nach erfolgreichem Anmelde- oder Registrierungsvorgang aufgerufen wird und die View der Index.cshtml liefert und
        /// damit unser Front-End mit AngularJS startet.
        /// </summary>
        /// <result>View, liefert die Index.cshtml zurück in der unsere AngularJS Anwendung startet.</result>
        public IActionResult Index()
        {
            return View();
        }
    }
}
