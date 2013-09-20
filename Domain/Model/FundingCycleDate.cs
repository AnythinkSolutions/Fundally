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
    public class FundingCycleDate
    {
        internal FundingCycleDate() { }

        [DataMember]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }

        [DataMember]
        [Required]
        [ForeignKey("DateType")]
        public int DateTypeId { get; set; }

        [DataMember]
        public Definition DateType { get; set; }

        [DataMember]
        [Required]
        public DateTime Date { get; set; }

        [DataMember]
        public string Notes { get; set; }

        [DataMember]
        [ForeignKey("FundingCycle")]
        public int FundingCycleId { get; set; }

        [DataMember]
        public virtual FundingCycle FundingCycle { get; set; }

    }
}
