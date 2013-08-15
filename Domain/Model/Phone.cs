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
	public class Phone : AuditableModelBase
	{
		internal Phone()
		{
		}

		[DataMember]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		[Required]
		public Guid Id { get; set; }

		[DataMember]
		[Required]
		[StringLength(3, MinimumLength = 3)]
		public string AreaCode { get; set; }

		[DataMember]
		[Required]
		[StringLength(8, MinimumLength = 7)]
		public string Number { get; set; }

		[DataMember]
		[Required]
		[ForeignKey("PhoneType")]
		public int PhoneTypeId { get; set; }

		[DataMember]
		public Definition PhoneType { get; set; }

		[DataMember]
		[Required]
		public bool IsPrimary { get; set; }

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

	}
}
