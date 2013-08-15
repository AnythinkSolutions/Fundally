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
	/// Base Model class
	/// </summary>
	[DataContract(IsReference = true)]
	public abstract class ModelBase
	{
		[DataMember]
		[ConcurrencyCheck]
		public int RowVersion { get; internal set; }
	}

	/// <summary>
	/// Base model class that captures audit information
	/// </summary>
	[DataContract(IsReference = true)]
	public abstract class AuditableModelBase : ModelBase
	{
		/// <summary>
		/// User that owns this model
		/// </summary>
		[DataMember]
		public int OwnerId { get; set; }

		/// <summary>
		/// Date this model was created
		/// </summary>
		[DataMember]
		public DateTime DateCreated { get; set; }

		/// <summary>
		/// Date this model was last modified
		/// </summary>
		[DataMember]
		public DateTime DateModified { get; set; }

		/// <summary>
		/// Date this model was deactivated
		/// </summary>
		[DataMember]
		public DateTime? DateDeactivated { get; set; }

		/// <summary>
		/// Flag to indicate whether or not the model is active.
		/// </summary>
		[DataMember]
		public bool IsActive { get; set; }

		/// <summary>
		/// Gets whether or not this model is private and can only be manipulated by the owner
		/// </summary>
		[NotMapped]
		public virtual bool IsPrivate { get { return false; } }

		/// <summary>
		/// Allows for centralized intialize functionality
		/// </summary>
		public virtual void Initialize(DateTime createdDate, int? userId)
		{
			this.IsActive = true;
			this.DateCreated = createdDate;
			this.DateModified = createdDate;
			this.OwnerId = userId.HasValue ? userId.Value : this.OwnerId;
			//this.InitializeChildren(createdDate, userId.HasValue ? userId.Value : this.OwnerId);
		}
	}
}
