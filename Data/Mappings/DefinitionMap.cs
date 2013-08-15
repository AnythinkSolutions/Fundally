using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fundally.Domain.Model;

namespace Fundally.Data.Mappings
{
	public class DefinitionMap : EntityTypeConfiguration<Definition>
	{
		public DefinitionMap()
		{
			//Setup the map to the Contacts
			//this.HasKey(d => new { d.Id, d.);
		}
	}
}
