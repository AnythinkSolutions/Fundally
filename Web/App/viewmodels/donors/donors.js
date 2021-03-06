﻿define(['services/unitofwork', 'services/utils'], function (unitofwork, utils) {
    
    var viewModel = {
        isWorking : ko.observable(true),
        donors: ko.observableArray(),
        addressTypes: ko.observableArray(),
        donorPhoneTypes: ko.observableArray(),
        uow : null,
        defaultAddressType: null,
        defaultPhoneType: null,

        viewAttached: function () {
            var self = this;

            self.uow = unitofwork.create();

            self.uow.definitions.all()
                .then(function (data) {

                    self.addressTypes(utils.getDefinitions(data, 'address_type'));
                    self.donorPhoneTypes(utils.getDefinitions(data, 'phone_type', 'donor'));
                    //self.activityTypes(getDefinitions(data, 'activity_type'));

                    self.defaultAddressType = utils.getDefaultDefinition(self.addressTypes());
                    self.defaultPhoneType = utils.getDefaultDefinition(self.donorPhoneTypes());
                    //self.defaultActivityType = getDefaultDefinition(self.activityTypes());

                }).fail(function (error) {
                    alert(error);
                });

            self.uow.donors.allIncluding("Addresses, Phones").then(function (data) {
                self.donors(data);
                Stashy.Table("#donors", { idprefix: "dnr-", menuClass: "btn btn-primary" }).on();
                self.isWorking(false);
            }).fail(function (error) {
                alert(error);
            });
                        
        },
        activate: function () {
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        },

        addDonor: addDonor,
        editDonor: editDonor,

        deleteDonor: function (donor) {
        },

        saveDonor: saveDonor,
        rollbackDonor: rollbackDonor
    }

    return viewModel;

    function addDonor() {
        var self = this;
        var newDonor = self.uow.donors.create();

        var address = self.uow.donors.createRelated("Address");
        address.addressType(self.defaultAddressType);
        address.isPrimary(true);
        newDonor.addresses.push(address);
        newDonor.primaryAddress(address);

        var phone = self.uow.donors.createRelated("Phone");
        phone.phoneType(self.defaultPhoneType);
        phone.isPrimary(true);
        newDonor.phones.push(phone);
        newDonor.primaryPhone(phone);

        newDonor.isEditing(true);
        self.donors.push(newDonor);
    }

    function editDonor(donor) {
        donor.isEditing(true);
    }

    function saveDonor(donor, args) {
        donor.isEditing(false);
        viewModel.uow.commit();
    }

    function rollbackDonor(donor) {

        var aspect = donor.entityAspect;
        if (aspect.entityState.isAdded()) {
            viewModel.donors.remove(donor);
            donor = null;
        }
        else {
            donor.isEditing(false);
        }

        viewModel.uow.rollback();
    }
});