/** 
	* @module Provides the Breeze Entity Manager
	* @requires app
*/

define(['durandal/app', 'services/modelbuilder'],
	function (app, modelbuilder) {

		breeze.NamingConvention.camelCase.setAsDefault();
		var serviceName = 'breeze';
		var masterManager = new breeze.EntityManager(serviceName);
		var modelBuilder = modelbuilder.create();

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
					    self.modelBuilder.initialize(masterManager.metadataStore);
					}

					var query = breeze.EntityQuery
						.from('fundally/definitions');

					return masterManager.executeQuery(query);
				});
		}
	});