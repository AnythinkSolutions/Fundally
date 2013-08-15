using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fundally.Domain.Model;

namespace Fundally.Domain.Mappings
{
	public class ContactMap : EntityTypeConfiguration<Contact>
	{
		public ContactMap()
		{
			this.HasMany<Address>(c => c.Addresses)
				.WithOptional(a => a.Contact)
				.HasForeignKey(a => a.ContactId)
				.WillCascadeOnDelete();
		}
	}
}
