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
	public class Contact : AuditableModelBase
	{
		internal Contact() { }

		[DataMember]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		[Required]
		public int Id { get; set; }

		[DataMember]
		[ForeignKey("Donor")]
		public int? DonorId { get; set; }

		[DataMember]
		public virtual Donor Donor { get; set; }

		[DataMember]
		[Required]
		public bool IsPrimary { get; set; }

		[DataMember]
		[Required]
		[ForeignKey("ContactType")]
		public int ContactTypeId { get; set; }

		[DataMember]
		public virtual Definition ContactType { get; set; }

		[DataMember]
		[Required]
		public string FirstName { get; set; }

		[DataMember]
		public string LastName { get; set; }

		[DataMember]
		public string Notes { get; set; }

		[DataMember]
		public virtual IList<Address> Addresses { get; set; }

		[DataMember]
		public virtual IList<Phone> Phones { get; set; }

		[DataMember]
		public string EmailBusiness { get; set; }
		[DataMember]
		public string EmailPersonal { get; set; }
		[DataMember]
		public string EmailOther { get; set; }

		[DataMember]
		[NotMapped]
		public string FullName
		{
			get
			{
				return string.Format("{0} {1}", string.IsNullOrWhiteSpace(FirstName) ? "" : FirstName.Trim(), string.IsNullOrWhiteSpace(LastName) ? "" : LastName.Trim());
			}
		}
	}
}
