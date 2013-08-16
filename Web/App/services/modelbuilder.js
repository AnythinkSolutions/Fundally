
define(function (metadataStore) {

    //Private Stuff
    var Donor = function () {
        this.userId = -1;
    };

    var initializeDonor = function (donor) {
        donor.errorMessage = ko.observable();
        donor.isEditing = ko.observable(false);
        donor.isWorking = ko.observable(false);
        //donor.primaryAddress = ko.observable(null);

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
    }


    //Define the object to return
    var ModelBuilder = (function(){
        var modelBuilder = function (metadata) {

        };

        return modelBuilder;
    })();

    return {
        initialize : initialize
    };

    function initialize(metadataStore) {
        metadataStore.registerEntityTypeCtor("Donor", Donor, initializeDonor);
    }
})();