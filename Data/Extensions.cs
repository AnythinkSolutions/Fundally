using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fundally.Data
{
	public static class Extensions
	{
		public static bool HasAnyChanges(this DbContext context)
		{
			var changed = context.ChangeTracker.Entries().Any(e => e.State != EntityState.Unchanged && e.State != EntityState.Detached);
			return changed;
		}

		public static bool HasAnyAdditions(this DbContext context)
		{
			var changed = context.ChangeTracker.Entries().Any(e => e.State == EntityState.Added);
			return changed;
		}

		public static bool HasAnyDeletions(this DbContext context)
		{
			var changed = context.ChangeTracker.Entries().Any(e => e.State == EntityState.Deleted);
			return changed;
		}

		public static bool HasAnyModifications(this DbContext context)
		{
			var changed = context.ChangeTracker.Entries().Any(e => e.State == EntityState.Modified);
			return changed;
		}
	}
}
