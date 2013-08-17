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

                // Repositories
                this.donors = repository.create(provider, "Donor", 'fundally/donors');
                this.contacts = repository.create(provider, "Contact", 'fundally/contacts');
                this.userprofiles = repository.create(provider, "UserProfile", 'fundally/userprofiles');
                this.addresses = repository.create(provider, "Address", 'fundally/addresses');
                this.phones = repository.create(provider, "Phone", 'fundally/phones');

                var definitions = repository.create(provider, "Definition", 'fundally/definitions', breeze.FetchStrategy.FromLocalCache);
                var aPred = new breeze.Predicate("itemType", "==", "address_type");
                this.addressTypes = definitions.find(aPred);                

                var cPred1 = new breeze.Predicate("itemType", "==", "phone_type");
                var cPred2 = new breeze.Predicate("itemSubType", "==", "contact");
                this.contactPhoneTypes = definitions.find(cPred1.and(cPred2));

                var dPred1 = new breeze.Predicate("itemType", "==", "phone_type");
                var dPred2 = new breeze.Predicate("itemSubType", "==", "donor");
                this.donorPhoneTypes = definitions.find(dPred1.and(dPred2));

                //this.articles = repository.create(provider, "Article", 'fundally/articles');
                //this.categories = repository.create(provider, "Category", 'fundally/lookups', breeze.FetchStrategy.FromLocalCache);
                //this.tags = repository.create(provider, "Tag", 'fundally/lookups', breeze.FetchStrategy.FromLocalCache);
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