define(['services/unitofwork', 'services/utils'],function (unitofwork, utils) {

    return {
        donors: ko.observableArray(),
        contacts: ko.observableArray(),
        addressTypes: ko.observableArray(),
        contactPhoneTypes: ko.observableArray(),
        donorPhoneTypes: ko.observableArray(),

        viewAttached: function () {
            var self = this,
            uow = unitofwork.create();

            uow.definitions.all()
                .then(function (data) {

                    self.addressTypes(utils.getDefinitions(data, 'address_type'));
                    self.contactPhoneTypes(utils.getDefinitions(data, 'phone_type', 'contact'));
                    self.donorPhoneTypes(utils.getDefinitions(data, 'phone_type', 'donor'));
                    //self.activityTypes(getDefinitions(data, 'activity_type'));

                }).fail(function (error) {
                    alert(error);
                });

            //self.addressTypes(uow.addressTypes);
            //uow.addressTypes.then(function (data) {
            //    self.addressTypes(data);
            //}).fail(function (error) {
            //    alert(error);
            //});
            //uow.contactPhoneTypes.then(function (data) {
            //    self.contactPhoneTypes(data);
            //}).fail(function (error) {
            //    alert(error);
            //});
            //uow.donorPhoneTypes.then(function (data) {
            //    self.donorPhoneTypes(data);
            //}).fail(function (error) {
            //    alert(error);
            //});
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