using Breeze.WebApi;
using Fundally.Data.Repositories;
using Fundally.Domain.Contracts;
using Fundally.Domain.Model;
using Fundally.Domain.UnitOfWork;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Fundally.Data.UnitOfWork
{
    /// <summary>
    /// Implementation for the UnitOfWork in the current app
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FundallyDbContextProvider contextProvider;

        /// <summary>
        /// ctor
        /// </summary>
        public UnitOfWork()
        {
            contextProvider = new FundallyDbContextProvider();

            UserProfileRepository = new Repository<UserProfile>(contextProvider.Context);
			DefinitionRepository = new Repository<Definition>(contextProvider.Context);
			DonorRepository = new Repository<Donor>(contextProvider.Context);
			ContactRepository = new Repository<Contact>(contextProvider.Context);
			AddressesRepository = new Repository<Address>(contextProvider.Context);
			PhonesRepository = new Repository<Phone>(contextProvider.Context);
            FundingAreasRepository = new Repository<FundingArea>(contextProvider.Context);
			FundingCyclesRepository = new Repository<FundingCycle>(contextProvider.Context);
        }

        /// <summary>
        /// Reporitories
        /// </summary>
		public IRepository<Definition> DefinitionRepository { get; private set; }
		public IRepository<Donor> DonorRepository { get; private set; }
		public IRepository<Contact> ContactRepository { get; private set; }
		public IRepository<UserProfile> UserProfileRepository { get; private set; }
		public IRepository<Address> AddressesRepository { get; private set; }
		public IRepository<Phone> PhonesRepository { get; private set; }
        public IRepository<FundingArea> FundingAreasRepository { get; private set; }
		public IRepository<FundingCycle> FundingCyclesRepository { get; private set; }

        /// <summary>
        /// Check if Database exists. 
        /// Being used in Global.asax
        /// </summary>
        /// <returns></returns>
        public bool DatabaseExists()
        {
            return contextProvider.Context.Database.Exists();
        }

        /// <summary>
        /// Initialize Database
        /// Being used in Global.asax
        /// </summary>
        public void DatabaseInitialize()
        {
            contextProvider.Context.Database.Initialize(true);
        }

        /// <summary>
        /// Get breeze Metadata
        /// </summary>
        /// <returns>String containing Breeze metadata</returns>
        public string Metadata()
        {
            return contextProvider.Metadata();
        }

        /// <summary>
        /// Save a changeset using Breeze
        /// </summary>
        /// <param name="changeSet"></param>
        /// <returns></returns>
        public SaveResult Commit(JObject changeSet)
        {
            return contextProvider.SaveChanges(changeSet);
        }

        /// <summary>
        /// Save Context using traditional Entity Framework operation
        /// </summary>
        public void Commit()
        {
            contextProvider.Context.SaveChanges();
        }
    }
}
