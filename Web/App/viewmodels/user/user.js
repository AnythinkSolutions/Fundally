define(['services/unitofwork'],function (unitofwork) {

    return {
        donors: ko.observableArray(),
        contacts: ko.observableArray(),
        addressTypes: ko.observableArray(),
        contactPhoneTypes: ko.observableArray(),
        donorPhoneTypes: ko.observableArray(),

        viewAttached: function () {
            var self = this,
            uow = unitofwork.create();

            //self.addressTypes(uow.addressTypes);
            uow.addressTypes.then(function (data) {
                self.addressTypes(data);
            }).fail(function (error) {
                alert(error);
            });
            uow.contactPhoneTypes.then(function (data) {
                self.contactPhoneTypes(data);
            }).fail(function (error) {
                alert(error);
            });
            uow.donorPhoneTypes.then(function (data) {
                self.donorPhoneTypes(data);
            }).fail(function (error) {
                alert(error);
            });
            //self.contactPhoneTypes(uow.contactPhoneTypes);
            //self.donorPhoneTypes(uow.donorPhoneTypes);
            //uow.addressTypes.all().then(function (data) {
            //    console.log(data);
            //});
            //uow.tags.all().then(function (data) {
            //    console.log(data);
            //});
            uow.donors.all().then(function (data) {
                self.donors(data);
                Stashy.Table("#donors", { idprefix: "art-", menuClass: "btn btn-primary" }).on();
            });
            uow.contacts.all().then(function (data) {
                self.contacts(data);
                Stashy.Table("#contacts", { idprefix: "art-", menuClass: "btn btn-primary" }).on();
            });
        },
        activate: function () {
            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        }
    }
});