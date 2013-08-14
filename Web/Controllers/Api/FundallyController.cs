using System.Linq;
using System.Web.Http;
using Breeze.WebApi;
using Newtonsoft.Json.Linq;
using Fundally.Domain.UnitOfWork;
using Fundally.Domain.Model;
using Fundally.Web.Helpers;

namespace Fundally.Web.Controllers
{
    [BreezeController]
    public class FundallyController : ApiController
    {
        IUnitOfWork UnitOfWork;

        public FundallyController(IUnitOfWork uow)
        {
            UnitOfWork = uow;
        }

        // ~/breeze/fundally/Articles
        [HttpGet]
        [Authorize(Roles = "User")]
        public IQueryable<Article> Articles()
        {
            return UnitOfWork.ArticleRepository.All();
        }

		// ~/breeze/fundally/UserProfiles
        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public IQueryable<UserProfile> UserProfiles()
        {
            return UnitOfWork.UserProfileRepository.All();
        }

        [HttpPost]
        [AllowAnonymous]
        public SaveResult SaveChanges(JObject saveBundle)
        {             
            return UnitOfWork.Commit(saveBundle);
        }

		// ~/breeze/fundally/Lookups
        [HttpGet]
        [AllowAnonymous]
        public LookupBundle Lookups()
        {
            return new LookupBundle
            {
                Categories = UnitOfWork.CategoryRepository.All().ToList(),
                Tags = UnitOfWork.TagRepository.All().ToList()
            };
        }
    }
}
