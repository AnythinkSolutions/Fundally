
define(function () {

    //Donor Ctor & Initializer
    var Donor = function () {
        //this.name = "New Donor";
        this.userId = -1;       //TODO: Don't think this is used yet.
        this.donorTypeId = 11;
        this.isEditing = ko.observable(false);      //Defining this in the constructor allows it to be serialized with Export for Mobile...
    };
    var initializeDonor = function (donor) {
        donor.isWorking = ko.observable(false);
        donor.primaryAddress = ko.observable(null);
        donor.primaryPhone = ko.observable(null);

        donor.totalAsked = ko.computed(function () {
            var total = 0;
            if (donor.fundingCycles() != null) {
                $.each(donor.fundingCycles(), function (i, c) { if (c.amountRequested() != null) total += c.amountRequested(); });
            }
            return total;
        }, this);

        donor.totalGifted = ko.computed(function () {
            var total = 0;
            if (donor.fundingCycles() != null) {
                $.each(donor.fundingCycles(), function (i, c) { if (c.amountGranted() != null) total += c.amountGranted(); });
            }

            return total;

        }, this);

        donor.grantedRatio = ko.computed(function () {
            if (donor.totalAsked() > 0) {
                var ratio = donor.totalGifted() / donor.totalAsked();
                return formatPercent(ratio);
            }

            return null;
        }, this);

        donor.totalAskedFormatted = getFormattedMoney(donor.totalAsked, this);
        donor.totalGiftedFormatted = getFormattedMoney(donor.totalGifted, this);

        if (donor.addresses().length > 0) {
            var pri = ko.utils.arrayFirst(donor.addresses(), function (a) { return a.isPrimary() == true; });
            if (pri == null) {
                pri = donor.addresses()[0];
            }

            donor.primaryAddress(pri);

            //Deal with changes to the primary address
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

            //Deal with changes to the primary phone
            $.each(donor.phones(), function (index, phone) {
                phone.isPrimary.subscribe(function (newValue) {
                    if (newValue == true) {

                        //make the old one not primary
                        if (donor.primaryPhone() != null) {
                            donor.primaryPhone().isPrimary(false);
                        }

                        //move the new one to the primary
                        donor.primaryPhone(phone);
                    }
                });
            });
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

    //Activity Ctor & Initializer
    var Activity = function () {
        this.isEditing = ko.observable(false);
    }
    var initializeActivity = function (activity) {
        //activity.isEditing = ko.observable(false);

        activity.iconName = ko.computed(function () {
            if (activity.activityType() != null) {
                if (activity.activityType().code() == 'phonecall')
                    return 'icon-phone-sign';
                else if (activity.activityType().code() == 'task') {
                    if (activity.isComplete())
                        return 'icon-check';
                    else
                        return 'icon-check-empty';
                }
            }

            return 'icon-comment';

        }, this);

        activity.daysUntilDue = ko.computed(function () {
            if (activity.activityTypeId() == 18 && activity.dueDate() != null && !activity.isComplete()) {
                var momentDue = moment(activity.dueDate());
                var days = momentDue.diff(moment(), 'days');
                return days;
            }

            return 1000;
        }, this);

        activity.isTask = ko.computed(function () {
            return activity.activityType() != null && activity.activityType().code() == 'task';
        }, this);

        activity.hasDueDate = ko.computed(function () {
            return activity.dueDate() != null;
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
        }, this);
    };

    //Funding Area
    var initializeFundingArea = function (area) {

        area.isOther = ko.computed(function () {
            return area.areaType() != null && area.areaType().code() == 'other';
        }, this);

        area.displayName = ko.computed(function () {
            if (area.areaType() != null) {
                if (area.areaType().code() == 'other')
                    return area.otherName();
                else
                    return area.areaType().name();
            }
            else
                return null;
        }, this);

    };

    //Funding Cycle
    var FundingCycle = function () {
        this.isEditing = ko.observable(false);
    }

    var initializeFundingCycle = function (cycle) {
        cycle.daysUntilDue = ko.computed(function () {
            if (cycle.dueDate() != null){
                var dueMoment = moment(cycle.dueDate());            
                if(dueMoment >= moment().startOf('day')) {
                    var days = dueMoment.diff(moment(), 'days');
                    return days;
                }
            }

            return -999;
        }, this);

        //cycle.formattedRequestedAmount = ko.computed({
        //    read: function () {
        //        if (cycle.amountRequested() != null) {
        //            return format(cycle.amountRequested());
        //        }
        //    },
        //    write: function (value) {
        //        var stripped = value.replace(/[^0-9.-]/g, '');
        //        cycle.amountRequested(parseFloat(stripped));
        //    },
        //    owner: this
        //}, this)

        cycle.formattedRequestedAmount = getFormattedMoney(cycle.amountRequested, this);
        cycle.formattedGrantedAmount = getFormattedMoney(cycle.amountGranted, this);
        //this.amountRequested.money();
        //this.amountGranted.money();

        function format(value) {
            if (value != null) {
                toks = value.toFixed(2).replace('-', '').split('.');
                var display = '$' + $.map(toks[0].split('').reverse(), function (elm, i) {
                    return [(i % 3 === 0 && i > 0 ? ',' : ''), elm];
                }).reverse().join('') + '.' + toks[1];

                return value < 0 ? '-' + display : display;
            }

            return value;
        };
    }

    //Define the object to return
    var ModelBuilder = (function(){
        var modelBuilder = function () {

            this.initialize = function (metadata) {
                metadata.registerEntityTypeCtor("Donor", Donor, initializeDonor);
                metadata.registerEntityTypeCtor("Contact", Contact, initializeContact);
                metadata.registerEntityTypeCtor("Address", Address, initializeAddress);
                metadata.registerEntityTypeCtor("Phone", Phone);
                metadata.registerEntityTypeCtor("Activity", Activity, initializeActivity);
                metadata.registerEntityTypeCtor("FundingArea", null, initializeFundingArea);
                metadata.registerEntityTypeCtor("FundingCycle", FundingCycle, initializeFundingCycle);
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

    function getFormattedMoney(prop, context, digits) {
        return ko.computed({
            read: function () {
                if (prop() != null) {
                    return formatMoney(prop(), digits);
                }
            },
            write: function (value) {
                var stripped = value.replace(/[^0-9.-]/g, '');
                if (stripped == '')
                    prop(null);
                else
                    prop(parseFloat(stripped));
            },
            owner: context
        }, context)
    }

    function formatMoney(value, digits) {
        if (value != null) {
            if (digits == null) digits = 2;

            toks = value.toFixed(digits).replace('-', '').split('.');
            var display = '$' + $.map(toks[0].split('').reverse(), function (elm, i) {
                return [(i % 3 === 0 && i > 0 ? ',' : ''), elm];
            }).reverse().join('') + '.' + toks[1];

            return value < 0 ? '-' + display : display;
        }

        return value;
    };

    function formatPercent(value) {
        if (value != null) {
            fval = parseFloat(value);
            if (Math.abs(fval) < 1)
                fval *= 100;

            return (fval < 0 ? '-' : '') + fval.toFixed(1) + '%';
        }

        return value;
    }
});