define(['services/unitofwork', 'services/utils', 'services/activitymanager'], function (unitofwork, utils, actMgr) {

    var myUow = unitofwork.create();

    var viewModel = {
        isWorking: ko.observable(true),
        uow: myUow,
        contact: ko.observable(),
        addressTypes: ko.observableArray(),
        phoneTypes: ko.observableArray(),
        contactTypes: ko.observableArray(),
        defaultAddressType: null,
        defaultPhoneType: null,
        activityManager: null,

        canActivate: function (params) {
            var self = this;


            return self.uow.contacts.withIdIncluding(params.id, "ContactType, Addresses, Addresses.AddressType, Phones, Phones.PhoneType, Donor, Activities, Activities.ActivityType")
                .then(function (data) {
                    self.contact(data[0]);

                    self.activityManager = actMgr.create(self.uow, self.contact().activities, onActivityAdded);

                    self.isWorking(false);
                    return true;
                }).fail(function (error) {
                    alert(error);
                    return false;
                });
        },

        activate: function (params) {
            var self = this;

            self.uow.definitions.all()
                .then(function (data) {

                    self.addressTypes(utils.getDefinitions(data, 'address_type'));
                    self.phoneTypes(utils.getDefinitions(data, 'phone_type', 'contact'));
                    self.contactTypes(utils.getDefinitions(data, 'contact_type'));
                    //self.activityTypes(getDefinitions(data, 'activity_type'));

                    self.defaultAddressType = utils.getDefaultDefinition(self.addressTypes());
                    self.defaultPhoneType = utils.getDefaultDefinition(self.phoneTypes());
                    //self.defaultActivityType = getDefaultDefinition(self.activityTypes());

                }).fail(function (error) {
                    alert(error);
                });
            
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        },

        editContact: editContact,
        saveContact: saveContact,
        rollbackContact: rollbackContact,

        addPhone: addPhone,
        editPhone: editPhone,
        savePhone: savePhone,
        rollbackPhone: rollbackPhone,
        deletePhone: deletePhone,

        addAddress: addAddress,
        editAddress: editAddress,
        saveAddress: saveAddress,
        rollbackAddress: rollbackAddress,
        deleteAddress: deleteAddress
    };

    return viewModel;

    function editContact() {
        var self = this;
        viewModel.contact().isEditing(true);
    }

    function saveContact() {
        var self = this;
        viewModel.contact().isEditing(false);

        $.each(viewModel.contact().phones(), function (i, p) { p.isEditing(false); });

        viewModel.uow.commit()
            .then(function () {
                toastr.success('Contact Saved');
            })
            .fail(function (error) {
                toastr.error('There was an error saving the contact: ' + error);
            });
    }

    function rollbackContact() {
        var self = this;
        viewModel.contact().isEditing(false);
    }

    function addPhone() {
        var self = this;

        var phone = self.uow.contacts.createRelated("Phone");
        phone.isEditing(true);
        viewModel.contact().phones.push(phone);
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
            viewModel.contact().phones.remove(phone);
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
        viewModel.contact().phones.remove(phone);
    }

    function addAddress() {
        var self = this;

        var address = self.uow.contacts.createRelated("Address");
        address.isEditing(true);
        viewModel.contact().addresss.push(address);
    }

    function editAddress(address) {
        address.isEditing(true);
    }

    function saveAddress(address) {
        address.isEditing(false);
        viewModel.uow.commit();
    }

    function rollbackAddress(address) {
        var aspect = address.entityAspect;
        if (aspect.entityState.isAdded()) {
            viewModel.contact().addresss.remove(address);
            address = null;
        }
        else {
            address.isEditing(false);
        }

        viewModel.uow.rollback();
    }

    function deleteAddress(address) {
        address.entityAspect.setDeleted();
        viewModel.uow.commit();
        viewModel.contact().addresss.remove(address);
    }

    function onActivityAdded(activity) {
        activity.donor(viewModel.contact().donor());
    }
});