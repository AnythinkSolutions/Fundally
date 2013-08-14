using Fundally.Domain.Model;
using System.Collections.Generic;

namespace Fundally.Web.Helpers
{
    public class LookupBundle
    {
        public IEnumerable<Category> Categories { get; set; }
        public IEnumerable<Tag> Tags { get; set; }
    }
}
