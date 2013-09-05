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
	[DataContract(IsReference=true)]
	public class FundingCycle : AuditableModelBase
	{
		internal FundingCycle() { }

		[DataMember]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		[Required]
		public int Id { get; set; }

		[DataMember]
		public string Name { get; set; }

		[DataMember]
		[Required]
		public DateTime EndDate { get; set; }

		[DataMember]
		public DateTime DueDate { get; set; }

        [DataMember]
        public DateTime DateSubmitted { get; set; }

		[DataMember]
		public bool IsParticipating { get; set; }

		[DataMember]
		public virtual IList<FundingArea> FundingAreas { get; set; }

		[DataMember]
		[ForeignKey("Donor")]
		[Required]
		public int DonorId { get; set; }

		[DataMember]
		public virtual Donor Donor { get; set; }

		[DataMember]
		public string Notes { get; set; }

		[DataMember]
		public virtual IList<Activity> Activities { get; set; }

        [DataMember]
        public decimal? AmountRequested { get; set; }

        [DataMember]
        public decimal? AmountGranted { get; set; }

        [DataMember]
        [ForeignKey("GrantStatus")]
        [Required]
        public int GrantStatusId { get; set; }

        [DataMember]
        public virtual Definition GrantStatus { get; set; }
	}
}
