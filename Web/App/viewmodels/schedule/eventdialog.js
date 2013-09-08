define(['durandal/modalDialog', 'services/utils', 'durandal/app'], function (dialog, utils, app) {

    var uow = null; //unitofwork.create();

    var vm = {
        activity: ko.observable(),
        rules: ko.observable(),
        donors: ko.observableArray(),
        contacts: ko.observableArray(),
        activityTypes: ko.observableArray(),
        defaultActivityType: null,
        isSaved: false,

        activate: function(params){
            var self = this;
            uow = params.uow;

            uow.definitions.all()
                .then(initializeDefinitions)
                .then(uow.donors.allIncluding("Contacts")
                    .then(initializeDonors)
                    .then(initializeActivity));

            function initializeDefinitions(data) {
                vm.activityTypes(utils.getDefinitions(data, 'activity_type'));
                vm.defaultActivityType = utils.getDefaultDefinition(self.activityTypes());
            }

            function initializeDonors(data) {
                self.donors(data);
            }

            function initializeActivity() {
                if (params.activity == null) {

                    var act = uow.activities.create();
                    act.activityType(self.defaultActivityType);
                    act.isEditing(true);
                    act.activityDate(new Date());

                    self.activity(act);
                }
                else
                    self.activity(params.activity);
            }
        },

        save: function (dialogResult) {
            uow.commit()
                     .then(function () {
                         app.trigger('activity:new', activity);
                         toastr.success('Schedule Item Saved');
                     });
            vm.isSaved = true;
            this.modal.close(dialogResult);
        },

        cancel: function (dialogResult) {
            //uow.activities.remove(vm.activity());
            uow.rollback();

            this.modal.close(dialogResult);
        }

    };
    
    //vm.prototype.close = function (dialogResult) {
    //    dialog.close(this, dialogResult);
    //};

    return vm;
});