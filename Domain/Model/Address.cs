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
	[DataContract(IsReference = true)]
	public class Address : AuditableModelBase
	{
		internal Address() { }

		[DataMember]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		[Required]
		public int Id { get; set; }

		[DataMember]
		public bool IsPrimary { get; set; }

		[DataMember]
		[Required]
		[ForeignKey("AddressType")]
		public int AddressTypeId { get; set; }

		[DataMember]
		public virtual Definition AddressType { get; set; }

		[DataMember]
		[StringLength(150)]
		[Required]
		public string StreetAddress { get; set; }

		[DataMember]
		[StringLength(150)]
		public string StreetAddress2 { get; set; }

		[DataMember]
		[StringLength(100)]
		[Required]
		public string City { get; set; }

		[DataMember]
		[StringLength(100)]
		public string State { get; set; }

		[DataMember]
		[StringLength(10, MinimumLength = 5)]
		public string Zip { get; set; }

		[DataMember]
		[StringLength(100)]
		public string Country { get; set; }

		[DataMember]
		[ForeignKey("Donor")]
		public int? DonorId { get; set; }

		[DataMember]
		public virtual Donor Donor { get; set; }

		[DataMember]
		[ForeignKey("Contact")]
		public int? ContactId { get; set; }

		[DataMember]
		public virtual Contact Contact { get; set; }

		[DataMember]
		public double? Latitude { get; set; }

		[DataMember]
		public double? Longitude { get; set; }
		
	}
}
