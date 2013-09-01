using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;

namespace Fundally.Domain.Model
{
	[DataContract(IsReference = true)]
	public class Donor : AuditableModelBase
	{
		internal Donor() { }

		[DataMember]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		[Required]
		public int Id { get; set; }

		[DataMember]
		[ForeignKey("DonorType")]
		public int DonorTypeId { get; set; }
		[DataMember]
		public virtual Definition DonorType { get; set; }

		[DataMember]
		[Required]
		public string Name { get; set; }

		[DataMember]
		public virtual IList<Contact> Contacts { get; set; }
		[DataMember]
		public virtual IList<Address> Addresses { get; set; }
		[DataMember]
		public virtual IList<Phone> Phones { get; set; }
		[DataMember]
		public string EmailAddress { get; set; }
		[DataMember]
		public string EmailAddress2 { get; set; }

        [DataMember]
        public virtual IList<Activity> Activities { get; set; }

		[DataMember]
		public string Notes { get; set; }

		[DataMember]
		public virtual IList<FundingArea> FundingAreas { get; set; }

		[NotMapped]
		public Address PrimaryAddress
		{
			get { return Addresses.FirstOrDefault(a => a.IsPrimary); }
			set
			{
				if (value.Donor != this)
					throw new InvalidOperationException("Address is not associated with this Donor.");

				Addresses.Where(a => a.IsPrimary).ForEach(a => a.IsPrimary = false);
				value.IsPrimary = true;
			}
		}

		[NotMapped]
		public Phone PrimaryPhone
		{
			get { return Phones.FirstOrDefault(a => a.IsPrimary); }
			set
			{
				if (value.Donor != this)
					throw new InvalidOperationException("Phone is not associated with this Donor.");

				Phones.Where(p => p.IsPrimary).ForEach(p => p.IsPrimary = false);
				value.IsPrimary = true;
			}
		}

		[NotMapped]
		public Contact PrimaryContact
		{
			get { return Contacts.FirstOrDefault(a => a.IsPrimary); }
			set
			{
				if (value.Donor != this)
					throw new InvalidOperationException("Contact is not associated with this Donor.");

				Contacts.Where(c => c.IsPrimary).ForEach(c => c.IsPrimary = false);
				value.IsPrimary = true;
			}
		}
	}
}
