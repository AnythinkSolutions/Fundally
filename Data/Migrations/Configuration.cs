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
			//uow.Categories.AddOrUpdate(new Domain.Model.Category()
			//{
			//	CategoryId = 1,
			//	Name = "Category 1"
			//});

			//uow.Categories.AddOrUpdate(new Domain.Model.Category()
			//{
			//	CategoryId = 2,
			//	Name = "Category 2"
			//});

			//uow.Categories.AddOrUpdate(new Domain.Model.Category()
			//{
			//	CategoryId = 3,
			//	Name = "Category 3"
			//});

			//var Tag1 = new Tag() 
			//{
			//	TagId = 1,
			//	Name = "Tag 1"
			//};

			//var Tag2 = new Tag()
			//{
			//	TagId = 2,
			//	Name = "Tag 2"
			//};

			//var Tag3 = new Tag()
			//{
			//	TagId = 3,
			//	Name = "Tag 3"
			//};

			//uow.Tags.AddOrUpdate(Tag1);
			//uow.Tags.AddOrUpdate(Tag2);
			//uow.Tags.AddOrUpdate(Tag3);



			//uow.Articles.AddOrUpdate(new Domain.Model.Article()
			//{
			//	ArticleId = 1,
			//	Title = "Lorem ipsum dolor sit amet",
			//	Description = "Nullam ipsum tortor, varius sit amet commodo vitae, condimentum sit amet tellus. Suspendisse eu tortor odio. In a massa id mi cursus malesuada sed vel ligula",
			//	Text = "Etiam dictum mi nulla, id ultrices tortor imperdiet eget. Nulla tortor tellus, pulvinar eu ultricies eget, feugiat posuere magna. Maecenas ut lectus sit amet libero vestibulum rhoncus. Nulla imperdiet lacus non scelerisque vestibulum. Praesent porta mauris a ipsum posuere sodales. Phasellus tincidunt arcu eu vestibulum egestas. Ut justo tortor, ornare non molestie vitae, consectetur sit amet turpis. Aenean et risus mattis, iaculis lorem ac, bibendum massa. Fusce urna urna, lobortis non arcu non, tristique commodo ligula. Maecenas volutpat augue nec diam accumsan viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Curabitur eget lacinia odio, vel suscipit est. Etiam id orci augue. Donec sodales sollicitudin orci, ac vehicula lorem adipiscing vitae. Etiam tempus urna mauris, vel pharetra ante euismod quis. Donec id nisl ornare lacus congue hendrerit. In eros lectus, eleifend a imperdiet at, bibendum at dolor. Praesent risus risus, pulvinar nec erat a, volutpat aliquam nunc. Mauris dapibus semper est, in volutpat magna. Nullam laoreet dolor et odio ultricies scelerisque. Ut porttitor urna massa, id rhoncus sem pellentesque ut. Etiam vel vestibulum diam. Maecenas blandit cursus vestibulum. Curabitur accumsan venenatis lectus ac scelerisque. Nullam eu lacus at mi porta ornare sit amet vitae eros",
			//	CreatedBy = "admin",
			//	CreatedDate = DateTime.UtcNow,
			//	UpdatedDate = DateTime.UtcNow,
			//	UpdatedBy = "admin",
			//	CategoryId = 1,
			//	Tags = new List<Tag>() {
			//		Tag1, Tag2                    
			//	}                
			//});

			//uow.Articles.AddOrUpdate(new Domain.Model.Article()
			//{
			//	ArticleId = 2,
			//	Title = "Lorem ipsum dolor sit amet",
			//	Description = "Nullam ipsum tortor, varius sit amet commodo vitae, condimentum sit amet tellus. Suspendisse eu tortor odio. In a massa id mi cursus malesuada sed vel ligula",
			//	Text = "Etiam dictum mi nulla, id ultrices tortor imperdiet eget. Nulla tortor tellus, pulvinar eu ultricies eget, feugiat posuere magna. Maecenas ut lectus sit amet libero vestibulum rhoncus. Nulla imperdiet lacus non scelerisque vestibulum. Praesent porta mauris a ipsum posuere sodales. Phasellus tincidunt arcu eu vestibulum egestas. Ut justo tortor, ornare non molestie vitae, consectetur sit amet turpis. Aenean et risus mattis, iaculis lorem ac, bibendum massa. Fusce urna urna, lobortis non arcu non, tristique commodo ligula. Maecenas volutpat augue nec diam accumsan viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Curabitur eget lacinia odio, vel suscipit est. Etiam id orci augue. Donec sodales sollicitudin orci, ac vehicula lorem adipiscing vitae. Etiam tempus urna mauris, vel pharetra ante euismod quis. Donec id nisl ornare lacus congue hendrerit. In eros lectus, eleifend a imperdiet at, bibendum at dolor. Praesent risus risus, pulvinar nec erat a, volutpat aliquam nunc. Mauris dapibus semper est, in volutpat magna. Nullam laoreet dolor et odio ultricies scelerisque. Ut porttitor urna massa, id rhoncus sem pellentesque ut. Etiam vel vestibulum diam. Maecenas blandit cursus vestibulum. Curabitur accumsan venenatis lectus ac scelerisque. Nullam eu lacus at mi porta ornare sit amet vitae eros",
			//	CreatedBy = "admin",
			//	CreatedDate = DateTime.UtcNow,
			//	UpdatedDate = DateTime.UtcNow,
			//	UpdatedBy = "admin",
			//	CategoryId = 2,
			//	Tags = new List<Tag>() {
			//		Tag1, Tag3
			//	}       
			//});

			//uow.Articles.AddOrUpdate(new Domain.Model.Article()
			//{
			//	ArticleId = 3,
			//	Title = "Lorem ipsum dolor sit amet",
			//	Description = "Nullam ipsum tortor, varius sit amet commodo vitae, condimentum sit amet tellus. Suspendisse eu tortor odio. In a massa id mi cursus malesuada sed vel ligula",
			//	Text = "Etiam dictum mi nulla, id ultrices tortor imperdiet eget. Nulla tortor tellus, pulvinar eu ultricies eget, feugiat posuere magna. Maecenas ut lectus sit amet libero vestibulum rhoncus. Nulla imperdiet lacus non scelerisque vestibulum. Praesent porta mauris a ipsum posuere sodales. Phasellus tincidunt arcu eu vestibulum egestas. Ut justo tortor, ornare non molestie vitae, consectetur sit amet turpis. Aenean et risus mattis, iaculis lorem ac, bibendum massa. Fusce urna urna, lobortis non arcu non, tristique commodo ligula. Maecenas volutpat augue nec diam accumsan viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Curabitur eget lacinia odio, vel suscipit est. Etiam id orci augue. Donec sodales sollicitudin orci, ac vehicula lorem adipiscing vitae. Etiam tempus urna mauris, vel pharetra ante euismod quis. Donec id nisl ornare lacus congue hendrerit. In eros lectus, eleifend a imperdiet at, bibendum at dolor. Praesent risus risus, pulvinar nec erat a, volutpat aliquam nunc. Mauris dapibus semper est, in volutpat magna. Nullam laoreet dolor et odio ultricies scelerisque. Ut porttitor urna massa, id rhoncus sem pellentesque ut. Etiam vel vestibulum diam. Maecenas blandit cursus vestibulum. Curabitur accumsan venenatis lectus ac scelerisque. Nullam eu lacus at mi porta ornare sit amet vitae eros",
			//	CreatedBy = "admin",
			//	CreatedDate = DateTime.UtcNow,
			//	UpdatedDate = DateTime.UtcNow,
			//	UpdatedBy = "admin",
			//	CategoryId = 3,
			//	Tags = new List<Tag>() {
			//		Tag2, Tag3
			//	}       
			//});

			//uow.Articles.AddOrUpdate(new Domain.Model.Article()
			//{
			//	ArticleId = 4,
			//	Title = "Lorem ipsum dolor sit amet",
			//	Description = "Nullam ipsum tortor, varius sit amet commodo vitae, condimentum sit amet tellus. Suspendisse eu tortor odio. In a massa id mi cursus malesuada sed vel ligula",
			//	Text = "Etiam dictum mi nulla, id ultrices tortor imperdiet eget. Nulla tortor tellus, pulvinar eu ultricies eget, feugiat posuere magna. Maecenas ut lectus sit amet libero vestibulum rhoncus. Nulla imperdiet lacus non scelerisque vestibulum. Praesent porta mauris a ipsum posuere sodales. Phasellus tincidunt arcu eu vestibulum egestas. Ut justo tortor, ornare non molestie vitae, consectetur sit amet turpis. Aenean et risus mattis, iaculis lorem ac, bibendum massa. Fusce urna urna, lobortis non arcu non, tristique commodo ligula. Maecenas volutpat augue nec diam accumsan viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Curabitur eget lacinia odio, vel suscipit est. Etiam id orci augue. Donec sodales sollicitudin orci, ac vehicula lorem adipiscing vitae. Etiam tempus urna mauris, vel pharetra ante euismod quis. Donec id nisl ornare lacus congue hendrerit. In eros lectus, eleifend a imperdiet at, bibendum at dolor. Praesent risus risus, pulvinar nec erat a, volutpat aliquam nunc. Mauris dapibus semper est, in volutpat magna. Nullam laoreet dolor et odio ultricies scelerisque. Ut porttitor urna massa, id rhoncus sem pellentesque ut. Etiam vel vestibulum diam. Maecenas blandit cursus vestibulum. Curabitur accumsan venenatis lectus ac scelerisque. Nullam eu lacus at mi porta ornare sit amet vitae eros",
			//	CreatedBy = "admin",
			//	CreatedDate = DateTime.UtcNow,
			//	UpdatedDate = DateTime.UtcNow,
			//	UpdatedBy = "admin",
			//	CategoryId = 1,
			//	Tags = new List<Tag>() {
			//		Tag1, Tag3
			//	}     
			//});

			//uow.Articles.AddOrUpdate(new Domain.Model.Article()
			//{
			//	ArticleId = 5,
			//	Title = "Lorem ipsum dolor sit amet",
			//	Description = "Nullam ipsum tortor, varius sit amet commodo vitae, condimentum sit amet tellus. Suspendisse eu tortor odio. In a massa id mi cursus malesuada sed vel ligula",
			//	Text = "Etiam dictum mi nulla, id ultrices tortor imperdiet eget. Nulla tortor tellus, pulvinar eu ultricies eget, feugiat posuere magna. Maecenas ut lectus sit amet libero vestibulum rhoncus. Nulla imperdiet lacus non scelerisque vestibulum. Praesent porta mauris a ipsum posuere sodales. Phasellus tincidunt arcu eu vestibulum egestas. Ut justo tortor, ornare non molestie vitae, consectetur sit amet turpis. Aenean et risus mattis, iaculis lorem ac, bibendum massa. Fusce urna urna, lobortis non arcu non, tristique commodo ligula. Maecenas volutpat augue nec diam accumsan viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Curabitur eget lacinia odio, vel suscipit est. Etiam id orci augue. Donec sodales sollicitudin orci, ac vehicula lorem adipiscing vitae. Etiam tempus urna mauris, vel pharetra ante euismod quis. Donec id nisl ornare lacus congue hendrerit. In eros lectus, eleifend a imperdiet at, bibendum at dolor. Praesent risus risus, pulvinar nec erat a, volutpat aliquam nunc. Mauris dapibus semper est, in volutpat magna. Nullam laoreet dolor et odio ultricies scelerisque. Ut porttitor urna massa, id rhoncus sem pellentesque ut. Etiam vel vestibulum diam. Maecenas blandit cursus vestibulum. Curabitur accumsan venenatis lectus ac scelerisque. Nullam eu lacus at mi porta ornare sit amet vitae eros",
			//	CreatedBy = "admin",
			//	CreatedDate = DateTime.UtcNow,
			//	UpdatedDate = DateTime.UtcNow,
			//	UpdatedBy = "admin",
			//	CategoryId = 3,
			//	Tags = new List<Tag>() {
			//		Tag2, Tag3
			//	}     
			//});

			//uow.Articles.AddOrUpdate(new Domain.Model.Article()
			//{
			//	ArticleId = 6,
			//	Title = "Lorem ipsum dolor sit amet",
			//	Description = "Nullam ipsum tortor, varius sit amet commodo vitae, condimentum sit amet tellus. Suspendisse eu tortor odio. In a massa id mi cursus malesuada sed vel ligula",
			//	Text = "Etiam dictum mi nulla, id ultrices tortor imperdiet eget. Nulla tortor tellus, pulvinar eu ultricies eget, feugiat posuere magna. Maecenas ut lectus sit amet libero vestibulum rhoncus. Nulla imperdiet lacus non scelerisque vestibulum. Praesent porta mauris a ipsum posuere sodales. Phasellus tincidunt arcu eu vestibulum egestas. Ut justo tortor, ornare non molestie vitae, consectetur sit amet turpis. Aenean et risus mattis, iaculis lorem ac, bibendum massa. Fusce urna urna, lobortis non arcu non, tristique commodo ligula. Maecenas volutpat augue nec diam accumsan viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Curabitur eget lacinia odio, vel suscipit est. Etiam id orci augue. Donec sodales sollicitudin orci, ac vehicula lorem adipiscing vitae. Etiam tempus urna mauris, vel pharetra ante euismod quis. Donec id nisl ornare lacus congue hendrerit. In eros lectus, eleifend a imperdiet at, bibendum at dolor. Praesent risus risus, pulvinar nec erat a, volutpat aliquam nunc. Mauris dapibus semper est, in volutpat magna. Nullam laoreet dolor et odio ultricies scelerisque. Ut porttitor urna massa, id rhoncus sem pellentesque ut. Etiam vel vestibulum diam. Maecenas blandit cursus vestibulum. Curabitur accumsan venenatis lectus ac scelerisque. Nullam eu lacus at mi porta ornare sit amet vitae eros",
			//	CreatedBy = "admin",
			//	CreatedDate = DateTime.UtcNow,
			//	UpdatedDate = DateTime.UtcNow,
			//	UpdatedBy = "admin",
			//	CategoryId = 2,
			//	Tags = new List<Tag>() {
			//		Tag1, Tag2
			//	}       
			//});

			//uow.SaveChanges();
		}
	}
}
