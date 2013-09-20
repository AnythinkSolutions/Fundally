using System.Web.Http;
using Breeze.WebApi;
using Fundally.Domain.UnitOfWork;

namespace Fundally.Web.Controllers
{
    [BreezeController]
    [AllowAnonymous]
    public class MetadataController : ApiController
    {

        IUnitOfWork UnitOfWork;

        /// <summary>
        /// ctor
        /// </summary>
        public MetadataController(IUnitOfWork uow)
        {
            UnitOfWork = uow;
        }

        // ~/breeze/Metadata
        [HttpGet]
        public string Metadata()
        {
            string metadata = UnitOfWork.Metadata();
            return metadata;
        }
    }
}