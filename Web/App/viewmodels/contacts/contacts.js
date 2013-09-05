define(['services/unitofwork', 'services/utils'], function (unitofwork, utils) {

    var viewModel = {
        isWorking: ko.observable(true),
        donors: ko.observableArray(),
        contacts: ko.observableArray(),
        contactPhoneTypes: ko.observableArray(),
        addressTypes: ko.observableArray(),
        defaultAddressType: null,
        defaultPhoneType: null,
        uow: null,
        defaultPhoneType: null,

        viewAttached: function () {
            var self = this;

            self.uow = unitofwork.create();

            self.uow.definitions.all()
                .then(function (data) {

                    self.addressTypes(utils.getDefinitions(data, 'address_type'));
                    self.contactPhoneTypes(utils.getDefinitions(data, 'phone_type', 'contact'));
                    //self.activityTypes(getDefinitions(data, 'activity_type'));
                    self.defaultPhoneType = utils.getDefaultDefinition(self.contactPhoneTypes());
                    self.defaultAddressType = utils.getDefaultDefinition(self.addressTypes());

                }).fail(function (error) {
                    alert(error);
                });

            //self.uow.donorPhoneTypes.then(function (data) {
            //    self.contactPhoneTypes(data);
            //    self.defaultPhoneType = $.grep(data, function (a) { return a.isDefault() == true; })[0];
            //}).fail(function (error) {
            //    alert(error);
            //});

            self.uow.donors.all().then(function (data) {
                self.donors(data);
            });

            self.uow.contacts.allIncluding("ContactType, Phones, Donor").then(function (data) {
                self.contacts(data);
                Stashy.Table("#contacts", { idprefix: "ctc-", menuClass: "btn btn-primary" }).on();
                self.isWorking(false);
            }).fail(function (error) {
                alert(error);
            });

        },
        activate: function () {
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        },

        addContact: addContact,
        editContact: editContact,

        deleteContact: function (contact) {
        },

        saveContact: saveContact,
        rollbackContact: rollbackContact
    }

    return viewModel;

    function addContact() {
        //var self = this;
        //var newDonor = self.uow.donors.create();

        //var address = self.uow.donors.createRelated("Address");
        //address.addressType(self.defaultAddressType);
        //address.isPrimary(true);
        //newDonor.addresses.push(address);
        //newDonor.primaryAddress(address);

        //var phone = self.uow.donors.createRelated("Phone");
        //phone.phoneType(self.defaultPhoneType);
        //phone.isPrimary(true);
        //newDonor.phones.push(phone);
        //newDonor.primaryPhone(phone);

        //newDonor.isEditing(true);
        //self.donors.push(newDonor);
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
            viewModel.contacts.remove(contact);
            contact = null;
        }
        else {
            contact.isEditing(false);
        }

        viewModel.uow.rollback();
    }
});