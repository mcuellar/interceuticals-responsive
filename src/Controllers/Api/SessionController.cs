using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using interceuticals_responsive.Common;

namespace interceuticals_responsive.Controllers.Api
{
    public class SessionController : ApiController
    {
        public HttpResponseMessage Get()
        {
            Dictionary<string, object> response = new Dictionary<string, object>();
            System.Web.SessionState.HttpSessionState state = System.Web.HttpContext.Current.Session;
            HttpSessionStateBase session = new HttpSessionStateWrapper(state);
            //HttpSessionStateBase session = new HttpSessionStateWrapper(HttpContext.Current.Session);
            //Debug.WriteLine("Getting Session: " + SessionExtensions.GetDataFromSession<string>(session, "CurrentSession"));
            //Debug.WriteLine("Getting Session 2:" + this.Session["CurrentSession"].ToString());

            response.Add("SessionId", SessionExtensions.GetDataFromSession<string>(session, "CurrentSession"));

            return Request.CreateResponse<Dictionary<string, object>> (HttpStatusCode.OK,response);
        }
    }
}
