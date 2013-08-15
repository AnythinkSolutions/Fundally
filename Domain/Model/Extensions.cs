using System;
using System.Collections.Generic;

namespace Fundally.Domain.Model
{
	/// <summary>
	/// A Collection of extension methods
	/// </summary>
    public static class Extensions
    {
		/// <summary>
		/// Add the ForEach method to IEnumerable (it is only on IList by default)
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="items"></param>
		/// <param name="action"></param>
         public static void ForEach<T>(this IEnumerable<T> items, Action<T> action) 
         {
             foreach (var item in items)
             {
                 action(item);
             }
         }
    }
}

