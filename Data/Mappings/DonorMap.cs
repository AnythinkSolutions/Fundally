using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fundally.Domain.Model;

namespace Fundally.Domain.Mappings
{
	public class DonorMap : EntityTypeConfiguration<Donor>
	{
		public DonorMap()
		{
			//Setup the map to the Contacts
			this.HasMany<Contact>(d => d.Contacts)
				.WithOptional(c => c.Donor)
				.WillCascadeOnDelete(false);

			this.HasMany<Address>(d => d.Addresses)
				.WithOptional(a => a.Donor)
				.HasForeignKey(a => a.DonorId)
				.WillCascadeOnDelete();
		}
	}
}
