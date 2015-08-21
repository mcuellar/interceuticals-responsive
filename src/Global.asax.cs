using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace interceuticals_responsive
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            string sessionId = Session.SessionID;
            // event is raised each time a new session is created
            //HttpContext.Current.Session.Add("CurrentSession", HttpContext.Current.Session.SessionID);
            removeCookie("SessionCookie");
            Session["CurrentSession"] = sessionId;
            setCookie("SessionCookie", sessionId);
            Debug.WriteLine("Initializing Session: " + HttpContext.Current.Session.SessionID);
        }

        protected void Session_End(object sender, EventArgs e)
        {
            // event is raised when a session is abandoned or expires
            removeCookie("SessionCookie");
        }

        private void setCookie(string cookieName, string cookieValue)
        {
            HttpCookie cookieSession = new HttpCookie(cookieName,cookieValue);
            //cookieSession[cookieName] = cookieValue;
            //myCookie.Expires = DateTime.Now.AddDays(cookieExpireDate);
            HttpContext.Current.Response.Cookies.Add(cookieSession);
        }

        private void removeCookie(string cookieName)
        {
            //TODO: Getting NRE on HttpContext when session expires.
            //HttpCookie cookieSession = new HttpCookie(cookieName);
            //cookieSession.Expires = DateTime.Now.AddDays(-1);
            //HttpContext.Current.Response.Cookies.Add(cookieSession);
        }
    }
}
