using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fundally.Domain.Model;

namespace Fundally.Domain.Mappings
{
	public class AddressMap : EntityTypeConfiguration<Address>
	{
		public AddressMap()
		{
			this.HasRequired<Definition>(a => a.AddressType)
				.WithMany()
				.HasForeignKey(a => a.AddressTypeId);
		}
	}
}
