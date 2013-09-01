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
    public class Activity : AuditableModelBase
    {
        internal Activity() { }

        [DataMember]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }

        [DataMember]
        [ForeignKey("ActivityType")]
        public int ActivityTypeId { get; set; }

        [DataMember]
        public virtual Definition ActivityType { get; set; }

        [DataMember]
        public DateTime ActivityDate { get; set; }
        [DataMember]
        public string Subject { get; set; }
        [DataMember]
        public string Body { get; set; }
        [DataMember]
        public DateTime? DueDate { get; set; }
        [DataMember]
        public bool IsComplete { get; set; }
        [DataMember]
        public bool RequiresFollowup { get; set; }

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
		[ForeignKey("FundingCycle")]
		public int? FundingCycleId { get; set; }

		[DataMember]
		public virtual FundingCycle FundingCycle { get; set; }

    }
}
