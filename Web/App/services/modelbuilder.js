
define(function () {

    //Donor Ctor & Initializer
    var Donor = function () {
        //this.name = "New Donor";
        this.userId = -1;
        this.donorTypeId = 11;
        this.isEditing = ko.observable(false);      //Defining this in the constructor allows it to be serialized with Export for Mobile...
    };
    var initializeDonor = function (donor) {
        donor.isWorking = ko.observable(false);
        donor.primaryAddress = ko.observable(null);
        donor.primaryPhone = ko.observable(null);

        if (donor.addresses().length > 0) {
            var pri = ko.utils.arrayFirst(donor.addresses(), function (a) { return a.isPrimary() == true; });
            if (pri == null) {
                pri = donor.addresses()[0];
            }

            donor.primaryAddress(pri);

            $.each(donor.addresses(), function (index, address) {
                address.isPrimary.subscribe(function (newValue) {
                    if (newValue == true) {

                        //make the old one not primary
                        if (donor.primaryAddress() != null) {
                            donor.primaryAddress().isPrimary(false);
                        }

                        //move the new one to the primary
                        donor.primaryAddress(address);
                    }
                });
            });
        }

        if (donor.phones().length > 0) {
            var pri = ko.utils.arrayFirst(donor.phones(), function (a) { return a.isPrimary() == true; });
            if (pri == null) pri = donor.phones()[0];

            donor.primaryPhone(pri);
        }
    };

    //Address Ctor & Initializer
    var Address = function () {
        this.isEditing = ko.observable(false);
    }
    var initializeAddress = function (address) {
        address.hasStreet2 = ko.computed(function () {
            if (address.streetAddress2() === null)
                return false;
            else
                return true;
        }, this);
    };

    //Phone Ctor & Initializer
    var Phone = function () {
        this.isEditing = ko.observable(false);
    }
    //var initializePhone = function (phone) {
    //    phone.isEditing = ko.observable(false);
    //};

    //Activity Ctor & Initializer
    var Activity = function () {
        this.isEditing = ko.observable(false);
    }
    var initializeActivity = function (activity) {
        //activity.isEditing = ko.observable(false);

        activity.iconName = ko.computed(function () {
            if (activity.activityTypeId() == 16)
                return 'icon-comment';
            else if (activity.activityTypeId() == 17)
                return 'icon-phone-sign';
            else if (activity.activityTypeId() == 18) {
                if (activity.isComplete())
                    return 'icon-check';
                else
                    return 'icon-check-empty';
            }
            else
                return 'icon-question';
        }, this);
    };

    //Contact Ctor & Initializer
    var Contact = function () {
        this.isEditing = ko.observable(false);
    }
    var initializeContact = function (contact) {
        //contact.isEditing = ko.observable(false);
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
            name += contact.lastName() != null ? ' ' + contact.lastName() : '';
            return name;
        }, self);
    };

    //Define the object to return
    var ModelBuilder = (function(){
        var modelBuilder = function () {

            this.initialize = function (metadata) {
                metadata.registerEntityTypeCtor("Donor", Donor, initializeDonor);
                metadata.registerEntityTypeCtor("Contact", Contact, initializeContact);
                metadata.registerEntityTypeCtor("Address", Address, initializeAddress);
                metadata.registerEntityTypeCtor("Phone", Phone);
                metadata.registerEntityTypeCtor("Activity", Activity, initializeActivity);
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