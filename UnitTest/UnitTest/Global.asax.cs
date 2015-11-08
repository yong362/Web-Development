using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
//using UnitTest.Migrations;
using UnitTest.Models;

namespace UnitTest
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {

            GlobalConfiguration.Configuration.EnableCors(new EnableCorsAttribute("*", "*", "*"));
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            SetDefaultFormatters();
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.Re‌ferenceLoopHandling = ReferenceLoopHandling.Ignore;
            // Database.SetInitializer(new MigrateDatabaseToLatestVersion<TestDBContext, Configuration>());
        }
        public static void SetDefaultFormatters()
        {
            GlobalConfiguration.Configuration.Formatters.Clear();
            var customizedJsonFormatter = new JsonMediaTypeFormatter();
            customizedJsonFormatter.SerializerSettings.Formatting = Formatting.Indented;
            customizedJsonFormatter.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            customizedJsonFormatter.SerializerSettings.Converters.Add(new StringEnumConverter());
            customizedJsonFormatter.SerializerSettings.ContractResolver =
                new CamelCasePropertyNamesContractResolver();
            GlobalConfiguration.Configuration.Formatters.Add(customizedJsonFormatter);
        }
    }
}
