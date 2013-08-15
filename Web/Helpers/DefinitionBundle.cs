using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Fundally.Domain.Model;

namespace Fundally.Web.Helpers
{
	public class DefinitionBundle
	{
		public IEnumerable<Definition> AddressTypes { get; set; }
		public IEnumerable<Definition> DonorPhoneTypes { get; set; }
		public IEnumerable<Definition> ContactPhoneTypes { get; set; }
	}
}