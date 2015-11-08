using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(UnitTest.Startup))]

namespace UnitTest
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
