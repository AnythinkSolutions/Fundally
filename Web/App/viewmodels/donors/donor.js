define(['services/unitofwork', 'durandal/app', 'services/utils'], function (unitofwork, app, utils) {
    
    var myUow = unitofwork.create();
    var isOperatingOnActivity = false;

    var viewModel = {
        isWorking: ko.observable(true),
        uow: myUow,
        donor: ko.observable(),
        isAllCycles: ko.observable(false),
        activeCycles: ko.observableArray(),
        activities: ko.observableArray(),
        addressTypes: ko.observableArray(),
        phoneTypes: ko.observableArray(),
        contactTypes: ko.observableArray(),
        activityTypes: ko.observableArray(),
        fundingAreas: ko.observableArray(),
        grantStatuses: ko.observableArray(),
        defaultAddressType: null,
        defaultPhoneType: null,
        defaultContactType: null,
        defaultActivityType: null,
        defaultGrantStatus: null,
        hasGiftHistory: ko.observable(true),

        canActivate: function (params) {
            var self = this;

            if (self.donor() == null || self.donor().id() != params.id) {
                //var pred = new breeze.Predicate("Id", "eq", params.id);
                return self.uow.donors.withIdIncluding(params.id, "Addresses, Phones, Contacts, FundingAreas, FundingCycles, Contacts.Phones, Activities, Phones.PhoneType, Contacts.ContactType, Activities.ActivityType, FundingAreas.AreaType, FundingCycles.FundingAreas, FundingCycles.FundingAreas.AreaType")
                    .then(function (data) {
                        self.donor(data[0]);

                        getActivities();
                        //self.activities();

                        //Get the list of active cycles
                        getActiveFundingCycles();

                        self.donor().entityAspect.propertyChanged.subscribe(handlePropertyChanged);
                        self.isWorking(false);
                        return true;
                    }).fail(function (error) {
                        alert(error);
                        return false;
                    });
            }
            else
                return true;
        },

        activate: function (params) {
            var self = this;

            var id = self.donor().id();
            var predicate = new breeze.Predicate("donorId", "eq", id);
            self.uow.activities.find(predicate)
                .then(function (data) {
                    var items = data;   //for purposes of debugging
                    getActivities();
                })
                .fail(function (error) {
                    console.log(error);
                });

            ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        },

        viewAttached: function (params) {
            var self = this;
            self.uow.definitions.all()
                .then(function (data) {

                    self.addressTypes(utils.getDefinitions(data, 'address_type'));
                    self.phoneTypes(utils.getDefinitions(data, 'phone_type', 'donor'));
                    self.contactTypes(utils.getDefinitions(data, 'contact_type'));
                    self.activityTypes(utils.getDefinitions(data, 'activity_type'));
                    self.fundingAreas(utils.getDefinitions(data, 'funding_area'));
                    self.grantStatuses(utils.getDefinitions(data, 'grant_status'));

                    self.defaultAddressType = utils.getDefaultDefinition(self.addressTypes());
                    self.defaultPhoneType = utils.getDefaultDefinition(self.phoneTypes());
                    self.defaultActivityType = utils.getDefaultDefinition(self.activityTypes());
                    self.defaultGrantStatus = utils.getDefaultDefinition(self.grantStatuses());

                }).fail(function (error) {
                    alert(error);
                });

            drawChart();
        },

        editDonor: editDonor,
        rollbackDonor: rollbackDonor,

        addPhone: addPhone,
        editPhone: editPhone,
        savePhone: savePhone,
        rollbackPhone: rollbackPhone,
        deletePhone: deletePhone,

        addAddress : addAddress,
        deleteAddress: deleteAddress,

        addFundingArea: addFundingArea,
        deleteFundingArea: deleteFundingArea,

        addContact: addContact,
        editContact: editContact,
        saveContact: saveContact,
        rollbackContact: rollbackContact,
        deleteContact: deleteContact,

        addActivity: addActivity,
        editActivity: editActivity,
        cancelActivity: cancelActivity,
        deleteActivity: deleteActivity,
        saveActivity: saveActivity,

        toggleCycleDisplay: toggleCycleDisplay,
        addFundingCycle: addFundingCycle,
        editFundingCycle: editFundingCycle,
        deleteFundingCycle: deleteFundingCycle,

        completeTask: completeTask,

        saveChanges: saveChanges
    };

    return viewModel;

    var giftChart = null;

    function drawChart() {
        //Build the jqPlot chart
        var requestData = [];
        var grantData = [];
        var index = 1;
        var cycles = viewModel.donor().fundingCycles().slice();
        sortCycles(cycles, true);

        $.each(cycles, function (i, val) {
            if (val.amountRequested() != null)
                requestData.push([val.endDate(), val.amountRequested()]);
            if (val.amountGranted() != null)
                grantData.push([val.endDate(), val.amountGranted()]);
            index++;
        });

        createChart(requestData, grantData);
    }

    function createChart(requestData, grantData) {

        var chartOptions = {
            title: 'Gift History',
            axes: {
                xaxis: {
                    renderer: $.jqplot.DateAxisRenderer,
                    tickOptions: { formatString: '%b, %Y' },
                    //min: 'Jan 1, 2000',
                    //max: 'Dec 31, 2100'
                },
                yaxis: {
                    tickOptions: { formatString: "$%'d" },
                }
            },
            series: [{ lineWidth: 3 }],
            legend: { show: true, labels: ['Requested', 'Gifted'], location: 'se', background: '#00FFFFFF' },
        };

        if (grantData.length > 0 || requestData.length > 0) {
            viewModel.hasGiftHistory(true);
            if (grantData.length > 0 && requestData.length > 0)
                giftChart = $.jqplot('donorGiftChart', [requestData, grantData], chartOptions);
            else if (grantData.length > 0)
                giftChart = $.jqplot('donorGiftChart', [grantData], chartOptions);
            else if (requestData.length > 0)
                giftChart = $.jqplot('donorGiftChart', [requestData], chartOptions);
        }
        else {    //viewModel.hasGiftHistory(false);
            viewModel.hasGiftHistory(false);
            //var emptySeries = [0, 0];
            //giftChart = $.jqplot('donorGiftChart', [emptySeries, emptySeries], chartOptions);
        }
    }

    function handlePropertyChanged(args) {
        if (args.propertyName == 'notes') {
            self.uow.commit();
        }
    }

    function editDonor() {
        var self = this;
        viewModel.donor().isEditing(true);
    }

    function saveChanges() {
        viewModel.uow.commit()
            .then(function () {
                toastr.success('Donor Saved', 'Success');
                viewModel.donor().isEditing(false);

                getActiveFundingCycles();
                drawChart();
            })
            .fail(function (error) {
                toastr.error(error, 'Error', { timeOut: 0, positionClass: "toast-bottom-full-width" });
            });
    }

    function rollbackDonor() {
        var self = this;
        viewModel.uow.rollback();
        viewModel.donor().isEditing(false);

        getActiveFundingCycles();
        drawChart();
    }

    function addPhone() {
        var self = this;

        var phone = self.uow.donors.createRelated("Phone");
        phone.isEditing(true);
        viewModel.donor().phones.push(phone);
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
            viewModel.donor().phones.remove(phone);
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
        viewModel.donor().phones.remove(phone);
    }

    function addFundingArea() {
        var self = this;

        var fundingArea = self.uow.donors.createRelated("FundingArea");
        viewModel.donor().fundingAreas.push(fundingArea);
    }

    function deleteFundingArea(area){
        area.entityAspect.setDeleted();
        viewModel.donor().fundingAreas.remove(area);
        viewModel.uow.commit();
        area = null;
    }

    function addFundingCycle() {
        var self = this;

        var params = { uow: viewModel.uow, cycle: null, donor: viewModel.donor() };
        app.showModal('viewmodels/donors/fundingcycledialog', params)
            .then(function (result) {
                if (result.isSaved) {
                    getActiveFundingCycles();
                }
            });
    }

    function editFundingCycle(cycle) {
        var self = this;

        var params = { uow: viewModel.uow, cycle: cycle, donor: viewModel.donor() };
        app.showModal('viewmodels/donors/fundingcycledialog', params)
            .then(function (result) {
                getActiveFundingCycles();
            });
    }

    function toggleCycleDisplay() {
        var val = viewModel.isAllCycles();
        viewModel.isAllCycles(!val);
        getActiveFundingCycles();
    }

    function getActiveFundingCycles() {
        var cycles = null;

        if (viewModel.isAllCycles()) {
            cycles = viewModel.donor().fundingCycles();
        }
        else {
            cycles = $.grep(viewModel.donor().fundingCycles(), function (c) { return c.daysUntilDue() >= 0 && c.daysUntilDue() <= 356; });
            viewModel.donor().fundingCycles.valueHasMutated();
        }

        if (cycles != null) {

            sortCycles(cycles);
            //Sort them by due date
            //cycles.sortBy(function (c) { return c.dueDate; });
            //cycles.sort(function (left, right) {
            //    var lDate = left.dueDate();
            //    var rDate = right.dueDate();
            //    return lDate > rDate ? -1 : lDate < rDate ? 1 : 0;
            //});

            viewModel.activeCycles(cycles);
        }

    }

    function sortCycles(cycles, isAscending) {
        //Sort them descending by due date
        cycles.sort(function (left, right) {
            var lDate = left.dueDate();
            var rDate = right.dueDate();
            var sort = lDate > rDate ? -1 : lDate < rDate ? 1 : 0;
            return isAscending ? sort * -1 : sort;
        });
    }

    function deleteFundingCycle(cycle) {

        if (!cycle.entityAspect.entityState.isAdded()) {
            //Confirm with user they want to delete this item
            app.showMessage('Are you sure you want to delete this funding cycle?', 'Delete Funding Cycle', ['Yes', 'No'])
            .then(function (args) {
                if (args == 'Yes') {
                    deleteItemCore(cycle, viewModel.donor().fundingCycles);
                    cycle = null;
                    getActiveFundingCycles();
                }
                else
                    return;
            });
        }
        else {
            deleteItemCore(cycle, viewModel.donor().fundingCycles);
            cycle = null;
            getActiveFundingCycles();
        }

    }

    //Deletes an item and removes it from a collection
    function deleteItemCore(item, itemCollection, delayedCommit) {
        item.entityAspect.setDeleted();
        itemCollection.remove(item);

        if (!delayedCommit)
            viewModel.uow.commit();
    }

    function addAddress() {
        var self = this;

        var address = self.uow.donors.createRelated("Address");
        address.isEditing(true);
        viewModel.donor().addresses.push(address);
    }

    function deleteAddress(address) {
        address.entityAspect.setDeleted();
        viewModel.donor().addresses.remove(address);
        viewModel.uow.commit();
        address = null;
    }

    function addContact() {
        var self = this;

        var params = { uow: viewModel.uow, contact: null, donor: viewModel.donor() };
        app.showModal('viewmodels/contacts/contactdialog', params);
    }

    function editContact(contact) {
        //contact.isEditing(true);
        var params = { uow: viewModel.uow, contact: contact, donor: viewModel.donor() };
        app.showModal('viewmodels/contacts/contactdialog', params);
    }

    function saveContact(contact) {
        contact.isEditing(false);
        viewModel.uow.commit();
    }

    function rollbackContact(contact) {
        var aspect = contact.entityAspect;
        if (aspect.entityState.isAdded()) {
            viewModel.donor().contacts.remove(contact);
            contact = null;
        }
        else {
            contact.isEditing(false);
        }

        viewModel.uow.rollback();
    }

    function deleteContact(contact) {
        contact.entityAspect.setDeleted();
        viewModel.uow.commit();
        viewModel.donor().contacts.remove(contact);
    }

    function addActivity() {
        var self = this;

        var activity = self.uow.donors.createRelated('Activity');
        activity.activityType(self.defaultActivityType);
        activity.isEditing(true);
        activity.activityDate(new Date());

        viewModel.activities.unshift(activity);
        viewModel.donor().activities.unshift(activity);
    }

    function deleteActivity(activity) {
        var self = this;

        if (!activity.entityAspect.entityState.isAdded()) {
            //Confirm with user they want to delete this item
            app.showMessage('Are you sure you want to delete this activity?', 'Delete Activity', ['Yes', 'No'])
            .then(function (args) {
                if (args == 'Yes') {
                    isOperatingOnActivity = true;
                    //activity.isEditing(false);
                    deleteItemCore(activity, viewModel.donor().activities);

                    //send out notification about the delete
                    app.trigger('activity:delete', activity.id());

                    activity = null;
                    isOperatingOnActivity = false;

                    getActivities();
                }
                else
                    return;
            });
        }
        else {
            deleteItemCore(activity, viewModel.donor().activities);
            getActivities();
        }
    }

    function cancelActivity(activity) {

        activity.isEditing(false);

        if (activity.entityAspect.entityState.isAdded()) {
            deleteItemCore(activity, viewModel.donor().activities);
            //viewModel.activities.remove(activity);
        }

        viewModel.uow.rollback();
        getActivities();
    }

    function editActivity(activity) {
        activity.isEditing(true);
    }

    function saveActivity(activity) {
        var isNew = activity.entityAspect.entityState.isAdded();
        isOperatingOnActivity = true;
        activity.isEditing(false);

        viewModel.uow.commit()
            .then(function () {
                if (isNew)
                    app.trigger('activity:new', activity);
                else
                    app.trigger('activity:edit', activity);

                isOperatingOnActivity = false;
            });
    }

    function completeTask(activity) {
        if (activity.hasDueDate()) {
            var isComplete = activity.isComplete();
            activity.isComplete(!isComplete);
            viewModel.uow.commit();
        }
    }

    function getActivities() {
        //viewModel.activities.removeAll();
        var sorted = viewModel.donor().activities().sort(utils.sortActivities);
        viewModel.activities(sorted.slice());   //slice will make a copy, so the lists are separate
    }

});