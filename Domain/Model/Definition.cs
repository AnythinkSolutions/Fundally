using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Fundally.Domain.Model
{
	/// <summary>
	/// A class to hold definition/lookup data for the application
	/// </summary>
	[DataContract(IsReference = true)]
	public class Definition
	{
		/// <summary>
		/// Default Constructor
		/// </summary>
		public Definition() { }

		/// <summary>
		/// Constructor that initializes a definition
		/// </summary>
		/// <param name="itemType">The Type of Definition this is</param>
		/// <param name="code">The Code that identifies this item</param>
		/// <param name="name">The Name of this item</param>
		public Definition(string itemType, string code, string name)
		{
			this.ItemType = itemType;
			this.Code = code;
			this.Name = name;
		}

		/// <summary>
		/// The unique identifier for this item
		/// </summary>
		[DataMember]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		[Required]
		[Key]
		public int Id { get; set; }

		/// <summary>
		/// Gets or sets the Type of item this is
		/// </summary>
		[DataMember]
		[StringLength(25)]
		[Required]
		public string ItemType { get; set; }

		/// <summary>
		/// Gets or sets the Sub-Type of item this is
		/// </summary>
		[DataMember]
		[StringLength(25)]
		public string ItemSubType { get; set; }

		/// <summary>
		/// Gets or sets whether this is the Default item for its type.
		/// </summary>
		[DataMember]
		public bool IsDefault { get; set; }

		/// <summary>
		/// Gets or sets the Code that identifies this item
		/// </summary>
		[DataMember]
		[StringLength(25)]
		[Required]
		public string Code { get; set; }

		/// <summary>
		/// Gets or sets the sub-code to identify this item
		/// </summary>
		[DataMember]
		[StringLength(25)]
		public string SubCode { get; set; }

		/// <summary>
		/// Gets or sets the Name of this item
		/// </summary>
		[DataMember]
		[StringLength(100)]
		[Required]
		public string Name { get; set; }

		/// <summary>
		/// Gets or sets a Description for this item
		/// </summary>
		[DataMember]
		[StringLength(500)]
		public string Description { get; set; }
	}
}
