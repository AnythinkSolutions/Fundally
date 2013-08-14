using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Web.WebPages.OAuth;
using Fundally.Web.Models;
using System.Configuration;
using Fundally.Web.Helpers;

namespace Fundally.Web
{
    public static class AuthConfig
    {
        public static void RegisterAuth()
        {
            // To let users of this site log in using their accounts from other sites such as Microsoft, Facebook, and Twitter,
            // you must update this site. For more information visit http://go.microsoft.com/fwlink/?LinkID=252166

            OAuthWebSecurity.RegisterTwitterClient(
                consumerKey:  ConfigurationManager.AppSettings["TwitterKey"],
                consumerSecret: ConfigurationManager.AppSettings["TwitterSecret"]);

            OAuthWebSecurity.RegisterFacebookClient(
                appId: ConfigurationManager.AppSettings["FacebookKey"],
                appSecret: ConfigurationManager.AppSettings["FacebookSecret"]);

            OAuthWebSecurity.RegisterGoogleClient();

            Dictionary<string, object> MicrosoftsocialData = new Dictionary<string, object>();
            MicrosoftsocialData.Add("Icon", "../Content/icons/microsoft.png");
            OAuthWebSecurity.RegisterClient(new MicrosoftScopedClient(ConfigurationManager.AppSettings["MicrosoftKey"], 
                                                                      ConfigurationManager.AppSettings["MicrosoftSecret"],
                                                                      "wl.basic wl.emails"), "Microsoft", MicrosoftsocialData);
        }
    }
}
