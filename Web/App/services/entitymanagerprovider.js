/** 
	* @module Provides the Breeze Entity Manager
	* @requires app
*/

define(['durandal/app'],
	function (app) {

		breeze.NamingConvention.camelCase.setAsDefault();
		var serviceName = 'breeze';
		var masterManager = new breeze.EntityManager(serviceName);

		var modelBuilder = function (metadata) {
            
		    var initializeDonor = function (donor) {
		        donor.errorMessage = ko.observable();
		        donor.isEditing = ko.observable(false);
		        donor.isWorking = ko.observable(false);
		        donor.primaryAddress = ko.observable(null);

		        if (donor.addresses().length > 0) {
		            var pri = ko.utils.arrayFirst(donor.addresses(), function (a) { return a.isPrimary == true; });
		            if (pri == null) {
		                pri = donor.addresses()[0];
		            }

		            donor.primaryAddress(pri);
		        }

		        donor.primaryAddressDisplay = ko.computed(function () {
		            if (donor.primaryAddress())
		                return donor.primaryAddress().display();
		            else
		                return null;
		        }, this);

		    };
		    var Donor = function () {
		        //this.name = "New Donor";
		        this.userId = -1;
		    };

		    metadata.registerEntityTypeCtor("Donor", Donor, initializeDonor);

		};

		/**
		* Entity Manager ctor
		* @constructor
		*/
		var EntityManagerProvider = (function () {

			var entityManagerProvider = function () {
				var manager;

				this.manager = function () {
					if (!manager) {
						manager = masterManager.createEmptyCopy();

						// Populate with lookup data
						manager.importEntities(masterManager.exportEntities());

						// Subscribe to events
						manager.hasChangesChanged.subscribe(function (args) {
							app.trigger('hasChanges');
						});
					}

					return manager;
				};
			};

			return entityManagerProvider;
		})();

		var self = {
			prepare: prepare,
			create: create,
            modelBuilder : modelBuilder
		};

		return self;

		/**
		 * Get a new Entity Manager instance
		 * @method
		 * @return {EntityManagerProvider}
		*/  
		function create() {
			return new EntityManagerProvider();
		}

		/**
		 * Prepare Entity Manager
		 *  - Fetch Metadata from server
		 *  - Get lookup data
		 * @method
		 * @return {promise}
		*/        
		function prepare() {
			return masterManager.fetchMetadata()
				.then(function () {
					if (self.modelBuilder) {
						self.modelBuilder(masterManager.metadataStore);
					}

					var query = breeze.EntityQuery
						.from('fundally/definitions');

					return masterManager.executeQuery(query);
				});
		}
	});