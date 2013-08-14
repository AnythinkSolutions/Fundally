using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Fundally.Domain.Model;
using System.Data.Entity.ModelConfiguration.Conventions;
using Fundally.Domain.UnitOfWork;
using Fundally.Data.Repositories;
using Fundally.Domain.Contracts;

namespace Fundally.Data
{
    public class DurandalAuthDbContext : DbContext
    {
        public DurandalAuthDbContext()
                    : base("DurandalAuthConnection")
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<DurandalAuthDbContext, Migrations.Configuration>());
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
