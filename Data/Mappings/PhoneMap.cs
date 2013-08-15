using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fundally.Domain.Model;

namespace Fundally.Domain.Mappings
{
	public class PhoneMap : EntityTypeConfiguration<Phone>
	{
		public PhoneMap()
		{
			this.HasRequired<Definition>(p => p.PhoneType)
				.WithMany()
				.HasForeignKey(p => p.PhoneTypeId);
		}
	}
}
