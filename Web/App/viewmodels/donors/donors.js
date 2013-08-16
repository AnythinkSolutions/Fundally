define(['services/unitofwork'], function (unitofwork) {

    return {
        isWorking : ko.observable(true),
        donors: ko.observableArray(),
        addressTypes: ko.observableArray(),
        donorPhoneTypes: ko.observableArray(),

        viewAttached: function () {
            var self = this,
            uow = unitofwork.create();

            uow.addressTypes.then(function (data) {
                self.addressTypes(data);
            }).fail(function (error) {
                alert(error);
            });

            uow.donorPhoneTypes.then(function (data) {
                self.donorPhoneTypes(data);
            }).fail(function (error) {
                alert(error);
            });

            uow.donors.all().then(function (data) {
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
            uow = unitofwork.create();

            var newDonor = uow.donors.create();
            newDonor.name("Test Donor");
            newDonor.isEditing(true);
            self.donors.push(newDonor);
        }
    }
});