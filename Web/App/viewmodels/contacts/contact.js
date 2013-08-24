define(['services/unitofwork'], function (unitofwork) {

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

        canActivate: function (params) {
            var self = this;


            return self.uow.contacts.withIdIncluding(params.id, "ContactType, Addresses, Phones, Donor")
                .then(function (data) {
                    self.contact(data[0]);
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

            self.uow.contactPhoneTypes.then(function (data) {
                self.phoneTypes(data);
                self.defaultPhoneType = $.grep(data, function (a) { return a.isDefault() == true; })[0];

                $.each(self.contact().phones(), function (p) {
                    var pType = $.grep(self.phoneTypes, function (pt) { return pt.id = p.phoneTypeId; })[0];
                    if (pType)
                        p.phoneType(pType);
                });

            }).fail(function (error) {
                alert(error);
            });
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

});