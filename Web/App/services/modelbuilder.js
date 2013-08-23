
define(function () {

    //Private Stuff
    var initializeDonor = function (donor) {
        donor.isEditing = ko.observable(false);
        donor.isWorking = ko.observable(false);
        donor.primaryAddress = ko.observable(null);
        donor.primaryPhone = ko.observable(null);

        if (donor.addresses().length > 0) {
            var pri = ko.utils.arrayFirst(donor.addresses(), function (a) { return a.isPrimary == true; });
            if (pri == null) {
                pri = donor.addresses()[0];
            }

            donor.primaryAddress(pri);
        }

        if (donor.phones().length > 0) {
            var pri = ko.utils.arrayFirst(donor.phones(), function (a) { return a.isPrimary == true; });
            if (pri == null) pri = donor.phones()[0];

            donor.primaryPhone(pri);
        }

        //donor.primaryAddressDisplay = ko.computed(function () {
        //    if (donor.primaryAddress())
        //        return donor.primaryAddress().display();
        //    else
        //        return null;
        //}, this);

    };
    var Donor = function () {
        //this.name = "New Donor";
        this.userId = -1;
        this.donorTypeId = 11;
    };

    var initializeAddress = function (address) {
        address.hasStreet2 = ko.computed(function () {
            if (address.streetAddress2() === null)
                return false;
            else
                return true;
        }, this);
    };

    var initializePhone = function (phone) {
        phone.isEditing = ko.observable(false);
    };

    var initializeContact = function (contact) {
        contact.isEditing = ko.observable(false);
        contact.isWorking = ko.observable(false);
        contact.primaryAddress = ko.observable(null);
        contact.primaryPhone = ko.observable(null);

        if (contact.addresses().length > 0) {
            var pri = ko.utils.arrayFirst(contact.addresses(), function (a) { return a.isPrimary == true; });
            if (pri == null) {
                pri = contact.addresses()[0];
            }

            donor.primaryAddress(pri);
        }

        if (contact.phones().length > 0) {
            var pri = ko.utils.arrayFirst(contact.phones(), function (a) { return a.isPrimary == true; });
            if (pri == null) pri = contact.phones()[0];

            contact.primaryPhone(pri);
        }

        contact.fullName = ko.computed(function () {
            var name = contact.firstName() != null ? contact.firstName() : '?';
            name += contact.lastName() != null ? contact.lastName() : '';
            return name;
        }, self);
    };

    //Define the object to return
    var ModelBuilder = (function(){
        var modelBuilder = function () {

            this.initialize = function (metadata) {
                metadata.registerEntityTypeCtor("Donor", Donor, initializeDonor);
                metadata.registerEntityTypeCtor("Contact", null, initializeContact);
                metadata.registerEntityTypeCtor("Address", null, initializeAddress);
                metadata.registerEntityTypeCtor("Phone", null, initializePhone);
            }
        };

        return modelBuilder;
    })();

    var self = {
        create: create,
    };

    return self;

    //Gets a new instance of the ModelBuilder
    function create() {
        return new ModelBuilder();
    }

});