using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Fundally.Domain.Mappings;
using Fundally.Domain.Model;

namespace Fundally.Data
{
    public class FundallyDbContext : DbContext
    {
        public FundallyDbContext()
                    : base("FundallyConnection")
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<FundallyDbContext, Migrations.Configuration>());
        }

		//public DbSet<Article> Articles { get; set; }
		//public DbSet<Category> Categories { get; set; }
		//public DbSet<Tag> Tags { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Configuration.LazyLoadingEnabled = false;
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();

			modelBuilder.Configurations.Add(new DonorMap());
			modelBuilder.Configurations.Add(new ContactMap());
			modelBuilder.Configurations.Add(new AddressMap());
			modelBuilder.Configurations.Add(new PhoneMap());
        }

		public DbSet<UserProfile> UserProfiles { get; set; }

		public DbSet<Donor> Donors { get; set; }
		public DbSet<Contact> Contacts { get; set; }
		public DbSet<Definition> Definitions { get; set; }
		public DbSet<FundingCycle> FundingCycles { get; set; }
    }
}
