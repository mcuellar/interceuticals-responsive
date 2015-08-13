using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace interceuticals_responsive.Controllers
{
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Betterman()
        {
            return View();
        }

        public ActionResult Betterwoman()
        {
            return View();
        }
    }
}