define(['services/unitofwork', 'durandal/app', 'services/utils'], function (unitofwork, app, utils) {

    var uow = unitofwork.create();

    var viewModel = {
        //donor: ko.observable(),
        cycle: ko.observable(),
        activityTypes: ko.observableArray(),
        fundingAreas: ko.observableArray(),
        grantStatuses: ko.observableArray(),
        defaultActivityType: null,

        canActivate: canActivate,
        activate: activate,

        editCycle: editCycle,
        //save: save,
        //cancel: cancel,

        addActivity: addActivity,
        deleteActivity: deleteActivity,
        editActivity: editActivity,
        completeTask: completeTask,
        saveActivity: saveActivity,

        addFundingArea: addFundingArea,
        deleteFundingArea: deleteFundingArea
    }

    return viewModel;

    //Private members
    function canActivate(params) {
        var self = this;

        return uow.fundingcycles.withIdIncluding(params.cycleid, "Donor, Donor.Contacts, FundingAreas, FundingAreas.AreaType, GrantStatus")
            .then(function (data) {
                self.cycle(data[0]);
                return true;
            })
            .fail(function (error) {
                alert('Error loading cycle: ' + error);
                return false;
            });
    }

    function activate(params) {
        var self = this;

        uow.definitions.all()
            .then(function (data) {
                self.activityTypes(utils.getDefinitions(data, 'activity_type'));
                self.fundingAreas(utils.getDefinitions(data, 'funding_area'));
                self.grantStatuses(utils.getDefinitions(data, 'grant_status'));

                self.defaultActivityType = utils.getDefaultDefinition(self.activityTypes());
            });
    }

    //------- Funding Areas -----
    function editCycle() {
        viewModel.cycle().isEditing(true);
    }

    //------- Funding Areas -----
    function addFundingArea() {
        var self = this;

        var fundingArea = self.uow.fundingcycles.createRelated("FundingArea");
        viewModel.cycle().fundingcycles.push(fundingArea);
    }

    function deleteFundingArea(area) {
        deleteItem(area, viewModel.cycle().fundingAreas, 'Funding Area');
    }

    //------- Activities -----
    function addActivity() {
        var self = this;

        var activity = uow.fundingcycles.createRelated('Activity');
        activity.activityType(self.defaultActivityType);
        activity.isEditing(true);
        activity.activityDate(new Date());

        viewModel.cycle().activities.unshift(activity);
    }

    function editActivity(activity) {
        activity.isEditing(true);
    }

    function saveActivity(activity) {
        activity.isEditing(false);
        uow.commit();
    }

    function completeTask(activity) {
        if (activity.isTask()) {
            var isComplete = activity.isComplete();
            activity.isComplete(!isComplete);
        }
    }

    function deleteActivity(activity) {
        deleteItem(activity, viewModel.cycle().activities, 'Activity');
    }

    //------- Common -----
    function deleteItem(item, itemCollection, itemName, delayedCommit) {
        if (!item.entityAspect.entityState.isAdded()) {
            //Confirm with user they want to delete this item
            app.showMessage('Are you sure you want to delete this ' + itemName + '?', 'Delete ' + itemName, ['Yes', 'No'])
            .then(function (args) {
                if (args == 'Yes') {
                    deleteItemCore(item, itemCollection);
                }
                else
                    return;
            });
        }
        else
            deleteItemCore(cycle, itemCollection);
    }

    function deleteItemCore(item, itemCollection, delayedCommit) {
        item.entityAspect.setDeleted();
        itemCollection.remove(item);

        if (!delayedCommit)
            uow.commit();

        item = null;
    }

});