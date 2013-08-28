define(['services/unitofwork'], function (unitofwork) {
    
    var myUow = unitofwork.create();

    var viewModel = {
        isWorking: ko.observable(true),
        uow: myUow,
        donor: ko.observable(),
        addressTypes: ko.observableArray(),
        phoneTypes: ko.observableArray(),
        contactTypes: ko.observableArray(),
        activityTypes : ko.observableArray(),
        defaultAddressType: null,
        defaultPhoneType: null,
        defaultContactType: null,

        canActivate: function (params) {
            var self = this;

            //var pred = new breeze.Predicate("Id", "eq", params.id);
            return self.uow.donors.withIdIncluding(params.id, "Addresses, Phones, Contacts, Contacts.Phones, Activities, Activities.ActivityType")
                .then(function (data) {
                    self.donor(data[0]);
                    self.isWorking(false);
                    return true;
                }).fail(function (error) {
                    alert(error);
                    return false;
                });
        },

        activate: function (params) {
            var self = this;

            self.uow.addressTypes.then(function (data) {
                self.addressTypes(data);
                self.defaultAddressType = $.grep(data, function (a) { return a.isDefault() == true; })[0];
            }).fail(function (error) {
                alert(error);
            });

            self.uow.donorPhoneTypes.then(function (data) {
                self.phoneTypes(data);
                self.defaultPhoneType = $.grep(data, function (a) { return a.isDefault() == true; })[0];

                $.each(self.donor().phones(), function (p) {
                    var pType = $.grep(self.phoneTypes, function (pt) { return pt.id = p.phoneTypeId; })[0];
                    if(pType)
                        p.phoneType(pType);
                });

            }).fail(function (error) {
                alert(error);
            });

            self.uow.contactTypes.then(function (data) {

                //Populate the available types and the defaults
                self.contactTypes(data);
                self.defaultContactType = $.grep(data, function (ct) { return ct.isDefault() == true; })[0];

                //Assign the right definition to each of the existing contacts
                $.each(self.donor().contacts(), function (c) {
                    var cType = $.grep(self.contactTypes, function (ct) { return ct.id = c.contactTypeId; })[0];
                    if (cType)
                        c.contactType(cType);
                });
            });

            self.uow.activityTypes.then(function (data) {
                self.activityTypes(data);
                self.defaultActivityType = $.grep(data, function (at) { return at.isDfault() == true; })[0];
            });

            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        },

        editDonor: editDonor,
        saveDonor: saveDonor,
        rollbackDonor: rollbackDonor,

        addPhone: addPhone,
        editPhone: editPhone,
        savePhone: savePhone,
        rollbackPhone: rollbackPhone,
        deletePhone: deletePhone,

        addContact: addContact,
        editContact: editContact,
        saveContact: saveContact,
        rollbackContact: rollbackContact,
        deleteContact: deleteContact,

        saveNotes: saveNotes,

        addActivity: addActivity
    };

    return viewModel;

    function editDonor() {
        var self = this;
        viewModel.donor().isEditing(true);
    }

    function saveDonor() {
        var self = this;
        viewModel.donor().isEditing(false);
    }

    function rollbackDonor() {
        var self = this;
        viewModel.donor().isEditing(false);
    }

    function addPhone() {
        var self = this;

        var phone = self.uow.donors.createRelated("Phone");
        phone.isEditing(true);
        viewModel.donor().phones.push(phone);
    }

    function editPhone(phone) {
        phone.isEditing(true);
    }

    function savePhone(phone) {
        phone.isEditing(false);
        viewModel.uow.commit();
    }

    function rollbackPhone(phone) {
        var aspect = phone.entityAspect;
        if (aspect.entityState.isAdded()) {
            viewModel.donor().phones.remove(phone);
            phone = null;
        }
        else {
            phone.isEditing(false);
        }

        viewModel.uow.rollback();
    }

    function deletePhone(phone) {
        phone.entityAspect.setDeleted();
        viewModel.uow.commit();
        viewModel.donor().phones.remove(phone);
    }

    function addContact() {
        var self = this;

        var contact = self.uow.contacts.create();
        contact.isEditing(true);

        if (viewModel.donor().contacts().length == 0) {
            contact.contactType(self.defaultContactType);
            contact.isPrimary(true);
        }

        var phone = self.uow.contacts.createRelated("Phone");
        phone.phoneType(self.defaultPhoneType);
        phone.isPrimary(true);
        contact.phones.push(phone);
        contact.primaryPhone(phone);

        viewModel.donor().contacts.push(contact);
    }

    function editContact(contact) {
        contact.isEditing(true);
    }

    function saveContact(contact) {
        contact.isEditing(false);
        viewModel.uow.commit();
    }

    function rollbackContact(contact) {
        var aspect = contact.entityAspect;
        if (aspect.entityState.isAdded()) {
            viewModel.donor().contacts.remove(contact);
            contact = null;
        }
        else {
            contact.isEditing(false);
        }

        viewModel.uow.rollback();
    }

    function deleteContact(contact) {
        contact.entityAspect.setDeleted();
        viewModel.uow.commit();
        viewModel.donor().contacts.remove(contact);
    }

    function saveNotes() {
        viewModel.uow.commit()
            .then(function(){
                toastr.success('Donor Saved', 'Success');
            })
            .fail(function (error){
                toastr.error(error, 'Error', { timeOut: 0, positionClass: "toast-bottom-full-width" });
            });
    }

    function addActivity() {
        var self = this;

        var activity = self.uow.donors.createRelated('Activity');
        activity.isEditing(true);

        viewModel.donor().activities.push(activity);
    }
});