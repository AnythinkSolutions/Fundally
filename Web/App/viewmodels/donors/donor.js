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

        canActivate: function (params) {
            var self = this;

            //var pred = new breeze.Predicate("Id", "eq", params.id);
            return self.uow.donors.withIdIncluding(params.id, "Addresses, Phones")
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
        },

        //viewAttached: function (params) {
            
        //},

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