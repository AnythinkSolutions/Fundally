using System.Data.Entity.Migrations;
using System.Linq;
using System.Web.Security;
using Fundally.Domain.Model;
using WebMatrix.WebData;

namespace Fundally.Data.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<FundallyDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(FundallyDbContext context)
        {
            if (!WebSecurity.Initialized)
            {
                WebSecurity.InitializeDatabaseConnection("FundallyConnection", "FundallyUsers", "UserProfileId", "UserName", autoCreateTables: true);
            }

            if (!Roles.RoleExists("Administrator")) { Roles.CreateRole("Administrator"); }
            if (!Roles.RoleExists("User")) { Roles.CreateRole("User"); }
            if (!Roles.RoleExists("Premium")) { Roles.CreateRole("Premium"); }

            if (!WebSecurity.UserExists("admin"))
            {
                WebSecurity.CreateUserAndAccount("admin", "admin1234", new { Email = "admin@mydomain.com" }, false);
                Roles.AddUsersToRoles(new string[] { "admin" }, new string[] { "User", "Administrator" });
            }

            if (!WebSecurity.UserExists("user"))
            {
                WebSecurity.CreateUserAndAccount("user", "user1234", new { Email = "user1@mydomain.com" }, false);
                Roles.AddUsersToRoles(new string[] { "user" }, new string[] { "User" });
            }

            //FundallyDbContext uow = new FundallyDbContext();
            if (!context.Definitions.Any(d => d.ItemType == "address_type"))
            {
                context.Definitions.Add(new Definition("address_type", "home", "Home"));
                context.Definitions.Add(new Definition("address_type", "business", "Business") { IsDefault = true });
                context.Definitions.Add(new Definition("address_type", "other", "Other"));
            }

            if (!context.Definitions.Any(d => d.ItemType == "phone_type" && d.ItemSubType == "donor"))
            {
                context.Definitions.Add(new Definition("phone_type", "main", "Main") { ItemSubType = "donor", IsDefault = true });
                context.Definitions.Add(new Definition("phone_type", "fax", "Fax") { ItemSubType = "donor" });
                context.Definitions.Add(new Definition("phone_type", "secondary", "Secondary") { ItemSubType = "donor" });
            }
            if (!context.Definitions.Any(d => d.ItemType == "phone_type" && d.ItemSubType == "contact"))
            {
                context.Definitions.Add(new Definition("phone_type", "home", "Home") { ItemSubType = "contact" });
                context.Definitions.Add(new Definition("phone_type", "mobile", "Mobile") { ItemSubType = "contact", IsDefault = true });
                context.Definitions.Add(new Definition("phone_type", "contact_fax", "Fax") { ItemSubType = "contact" });
                context.Definitions.Add(new Definition("phone_type", "work", "Work") { ItemSubType = "contact" });
            }

            if (!context.Definitions.Any(d => d.ItemType == "donor_type"))
            {
                context.Definitions.Add(new Definition("donor_type", "foundation", "Foundation") { IsDefault = true });
                context.Definitions.Add(new Definition("donor_type", "Individual", "Individual"));
            }

            if (!context.Definitions.Any(d => d.ItemType == "contact_type"))
            {
                context.Definitions.Add(new Definition("contact_type", "grants", "Grants") { IsDefault = true });
                context.Definitions.Add(new Definition("contact_type", "legal", "Legal"));
                context.Definitions.Add(new Definition("contact_type", "marketing", "Marketing"));
                context.Definitions.Add(new Definition("contact_type", "trustee", "Trustee"));
            }

            if (!context.Definitions.Any(d => d.ItemType == "activity_type"))
            {
                context.Definitions.Add(new Definition("activity_type", "note", "Note") { IsDefault = true });
                context.Definitions.Add(new Definition("activity_type", "phonecall", "Phone Call"));
                context.Definitions.Add(new Definition("activity_type", "task", "Task"));
            }

            if (!context.Definitions.Any(d => d.ItemType == "funding_area"))
            {
                context.Definitions.Add(new Definition("funding_area", "social_needs", "Unmet Social Needs"));
                context.Definitions.Add(new Definition("funding_area", "human_needs", "Unmet Human Needs"));
                context.Definitions.Add(new Definition("funding_area", "families", "Families"));
                context.Definitions.Add(new Definition("funding_area", "children", "Children"));
                context.Definitions.Add(new Definition("funding_area", "health", "Health Care"));
                context.Definitions.Add(new Definition("funding_area", "mental_health", "Mental Health"));
                context.Definitions.Add(new Definition("funding_area", "policy", "Policy"));
                context.Definitions.Add(new Definition("funding_area", "other", "Other"));
            }

            if (!context.Definitions.Any(d => d.ItemType == "grant_status"))
            {
                context.Definitions.Add(new Definition("grant_status", "considering", "Considering"));
                context.Definitions.Add(new Definition("grant_status", "loi", "LOI"));
                context.Definitions.Add(new Definition("grant_status", "proposal", "Proposal") { IsDefault = true });
                context.Definitions.Add(new Definition("grant_status", "waiting", "Waiting"));
                context.Definitions.Add(new Definition("grant_status", "accepted", "Accepted"));
                context.Definitions.Add(new Definition("grant_status", "denied", "Denied"));
            }

            if (context.HasAnyChanges())
            {
                context.SaveChanges();
            }
        }
    }
}
