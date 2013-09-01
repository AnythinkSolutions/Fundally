using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Fundally.Domain.Model
{
    [DataContract(IsReference = true)]
    public class FundingArea : AuditableModelBase
    {
        internal FundingArea()
        {
        }

        [DataMember]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }

        [DataMember]
        [Required]
        [ForeignKey("AreaType")]
        public int AreaTypeId{ get; set; }

        [DataMember]
        public Definition AreaType { get; set; }

        [DataMember]
        public string OtherName { get; set; }

        [DataMember]
        public string Notes { get; set; }

        [DataMember]
        [ForeignKey("Donor")]
        public int? DonorId { get; set; }

        [DataMember]
        public virtual Donor Donor { get; set; }
    }
}
