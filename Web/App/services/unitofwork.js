/** 
    * @module UnitOfWork containing all repositories
    * @requires app
    * @requires entitymanagerprovider
    * @requires repository 
*/

define(['services/entitymanagerprovider', 'services/repository', 'durandal/app'],
    function (entityManagerProvider, repository, app) {

        var refs = {};

        /**
        * UnitOfWork ctor
	    * @constructor
	    */
        var UnitOfWork = (function () {

            var unitofwork = function () {
                var provider = entityManagerProvider.create();

                /**
                * Has the current UnitOfWork changed?
		        * @method
		        * @return {bool}
		        */ 
                this.hasChanges = function () {
                    return provider.manager().hasChanges();
                };

                /**
                * Commit changeset
    	        * @method
		        * @return {promise}
		        */ 
                this.commit = function () {
                    var saveOptions = new breeze.SaveOptions({ resourceName: 'fundally/savechanges' });

                    return provider.manager().saveChanges(null, saveOptions)
                        .then(function (saveResult) {
                            app.trigger('saved', saveResult.entities);
                        });
                };

                /**
                * Rollback changes
                * @method
		        */ 
                this.rollback = function () {
                    provider.manager().rejectChanges();
                };

                this.getDefinitions = function (itemType, itemSubType) {

                    var predicate = new breeze.Predicate("itemType", "==", itemType);

                    if (itemSubType) {
                        var predicate2 = new breeze.Predicate("itemSubType", "==", itemSubType);
                        predicate = predicate.and(predicate2);
                    }

                    return this.definitions.find(predicate);
                };

                this.getDefaultDefinition = function (itemType, itemSubType) {
                    var defaultDefinition = null;
                    return (this.getDefinitions(itemType, itemSubType)
                        .done(function (definitions) {
                            defaultDefinition = $.grep(definitions, function (d) { return d.isDefault() == true; })[0];
                        }), defaultDefinition);
                };

                // Repositories
                this.donors = repository.create(provider, "Donor", 'fundally/donors');
                this.contacts = repository.create(provider, "Contact", 'fundally/contacts');
                this.userprofiles = repository.create(provider, "UserProfile", 'fundally/userprofiles');

                this.definitions = repository.create(provider, "Definition", 'fundally/definitions', breeze.FetchStrategy.FromLocalCache);
                var aPred = new breeze.Predicate("itemType", "==", "address_type");
                this.addressTypes = this.definitions.find(aPred);

                var cPred1 = new breeze.Predicate("itemType", "==", "phone_type");
                var cPred2 = new breeze.Predicate("itemSubType", "==", "contact");
                this.contactPhoneTypes = this.definitions.find(cPred1.and(cPred2));

                var dPred1 = new breeze.Predicate("itemType", "==", "phone_type");
                var dPred2 = new breeze.Predicate("itemSubType", "==", "donor");
                this.donorPhoneTypes = this.definitions.find(dPred1.and(dPred2));

                var ctPred = new breeze.Predicate("itemType", "==", "contact_type");
                this.contactTypes = this.definitions.find(ctPred);

                var actPred = new breeze.Predicate("itemType", "==", "activity_type");
                this.activityTypes = this.definitions.find(actPred);
            };

            return unitofwork;
        })();

        var SmartReference = (function () {

            var ctor = function () {
                var value = null;

                this.referenceCount = 0;

                this.value = function () {
                    if (value === null) {
                        value = new UnitOfWork();
                    }

                    this.referenceCount++;
                    return value;
                };

                this.clear = function () {
                    value = null;
                    this.referenceCount = 0;

                    clean();
                };
            };

            ctor.prototype.release = function () {
                this.referenceCount--;
                if (this.referenceCount === 0) {
                    this.clear();
                }
            };

            return ctor;
        })();

        return {
            create: create,
            get: get
        };

        /**
    	 * Get a new UnitOfWork instance
		 * @method
		 * @return {UnitOfWork}
		*/ 
        function create() {
            return new UnitOfWork();
        }

        /**
		 * Get a new UnitOfWork based on the provided key
		 * @method
         * @param {int/string} key - Key used in the reference store
		 * @return {promise}
		*/  
        function get(key) {
            if (!refs[key]) {
                refs[key] = new SmartReference();
            }

            return refs[key];
        }

        /**
    	 * Delete references
		 * @method         
		*/ 
        function clean() {
            for (key in refs) {
                if (refs[key].referenceCount == 0) {
                    delete refs[key];
                }
            }
        }
    });