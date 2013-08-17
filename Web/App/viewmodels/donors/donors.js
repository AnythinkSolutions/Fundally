define(['services/unitofwork'], function (unitofwork) {



    return {
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

            self.uow.addressTypes.then(function (data) {
                self.addressTypes(data);
                self.defaultAddressType = $.grep(data, function (a) { return a.isDefault() == true; })[0];
            }).fail(function (error) {
                alert(error);
            });

            self.uow.donorPhoneTypes.then(function (data) {
                self.donorPhoneTypes(data);
                self.defaultPhoneType = $.grep(data, function (a) { return a.isDefault() == true; })[0];
            }).fail(function (error) {
                alert(error);
            });

            self.uow.donors.all().then(function (data) {
                self.donors(data);
                Stashy.Table("#donors", { idprefix: "dnr-", menuClass: "btn btn-primary" }).on();
                self.isWorking(false);
            });
                        
        },
        activate: function () {
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        },

        addDonor: function () {
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
        },

        editDonor: function (donor) {
            donor.isEditing(true);
        },

        deleteDonor: function (donor) {
        },

        saveDonor: function (donor) {
            donor.isEditing(false);
        },

        rollbackDonor: function (donor) {
            donor.isEditing(false);
        }

    }
});