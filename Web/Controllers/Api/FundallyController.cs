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


        // ~/breeze/fundally/Donors
        [HttpGet]
        [Authorize(Roles = "User")]
        public IQueryable<Donor> Donors()
        {
            return UnitOfWork.DonorRepository.All();
        }

		// ~/breeze/fundally/Contacts
		[HttpGet]
		[Authorize(Roles = "User")]
		public IQueryable<Contact> Contacts()
		{
			return UnitOfWork.ContactRepository.All();
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

		// ~/breeze/fundally/Definitions
		[HttpGet]
		[AllowAnonymous]
		public IQueryable<Definition> Definitions()
		{
			return UnitOfWork.DefinitionRepository.All();
			//return new DefinitionBundle
			//{
			//	AddressTypes = UnitOfWork.DefinitionRepository.All().Where(d => d.ItemType == "address_type"),
			//	ContactPhoneTypes = UnitOfWork.DefinitionRepository.All().Where(d => d.ItemType == "phone_type" && d.SubCode == "contact"),
			//	DonorPhoneTypes = UnitOfWork.DefinitionRepository.All().Where(d => d.ItemType == "phone_type" && d.SubCode == "donor")
			//};
		}
		// ~/breeze/fundally/Lookups
		//[HttpGet]
		//[AllowAnonymous]
		//public LookupBundle Lookups()
		//{
		//	return new LookupBundle
		//	{
		//		Categories = UnitOfWork.CategoryRepository.All().ToList(),
		//		Tags = UnitOfWork.TagRepository.All().ToList()
		//	};
		//}
    }
}
