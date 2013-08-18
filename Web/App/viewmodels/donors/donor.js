define(['services/unitofwork'], function (unitofwork) {
    
    var myUow = unitofwork.create();

    var viewModel = {
        isWorking: ko.observable(true),
        uow: myUow,
        donor: ko.observable(),
        addressTypes: ko.observableArray(),
        phoneTypes: ko.observableArray(),
        defaultAddressType: null,
        defaultPhoneType: null,

        viewAttached: function (params) {
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
            }).fail(function (error) {
                alert(error);
            });
        },

        activate: function (params) {
            var self = this;

            self.uow.donors.withId(params.id)
                .then(function (data) {
                    self.donor (data);
                    self.isWorking(false);
                }).fail(function (error) {
                    alert(error);
                });
        },

        editDonor: editDonor,
        saveDonor: saveDonor,
        rollbackDonor: rollbackDonor
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
});