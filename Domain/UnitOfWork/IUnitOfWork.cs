using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Fundally.Domain.Contracts;
using Fundally.Domain.Model;
using Newtonsoft.Json.Linq;
using Breeze.WebApi;

namespace Fundally.Domain.UnitOfWork
{
    /// <summary>
    /// Contract for the UnitOfWork
    /// </summary>
    public interface IUnitOfWork
    {
		//IRepository<Article> ArticleRepository { get; }
		//IRepository<Category> CategoryRepository { get; }
		//IRepository<Tag> TagRepository { get; }
		IRepository<Definition> DefinitionRepository { get; }
		IRepository<Donor> DonorRepository { get; }
		IRepository<Contact> ContactRepository { get; }
        IRepository<UserProfile> UserProfileRepository { get; }

        bool DatabaseExists();
        void DatabaseInitialize();
        string Metadata();

        SaveResult Commit(JObject changeSet);
        void Commit();
    }
}
