using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
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

        public DbSet<Article> Articles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Configuration.LazyLoadingEnabled = false;
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
        }
    }
}
