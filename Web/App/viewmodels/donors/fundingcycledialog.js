define(['services/utils', 'durandal/app'],
    function (utils, app) {
        var uow = null;

        var viewModel = {
            donor: ko.observable(),
            cycle: ko.observable(),
            fundingAreas: ko.observableArray(),
            grantStatuses: ko.observableArray(),
            defaultGrantStatus: null,
            isSaved: false,
            isNew: ko.observable(false),

            activate: activate,
            save: save,
            cancel: cancel,

            deleteCycle: deleteCycle,
        };

        return viewModel;

        function activate(params) {
            var self = this;
            uow = params.uow;
            self.donor(params.donor);

            uow.definitions.all()
                .then(initializeDefinitions)
                .then(initializeDonor);

            function initializeDefinitions(data) {
                viewModel.fundingAreas(utils.getDefinitions(data, 'funding_area'));
                viewModel.grantStatuses(utils.getDefinitions(data, 'grant_status'));
                viewModel.defaultGrantStatus = utils.getDefaultDefinition(viewModel.grantStatuses());
            }

            function initializeDonor() {
                if (params.cycle == null) {

                    //creating a new cycle
                    viewModel.isNew(true);

                    var cycle = uow.fundingcycles.create();
                    self.cycle(cycle);
                    cycle.donor(self.donor());
                    cycle.grantStatus(self.defaultGrantStatus);
                    cycle.isParticipating(true);
                    cycle.dueDate(new Date());
                    cycle.endDate(new Date());
                    cycle.isEditing(true);

                    viewModel.donor().fundingCycles.push(cycle);
                }
                else {
                    
                    //modifying an existing cycle
                    self.cycle(params.cycle);
                    self.cycle().isEditing(true);
                    viewModel.isNew(false);
                }
            }
        }

        function save(dialogResult) {
            uow.commit()
                .then(function () {
                    if (viewModel.isNew) {
                        app.trigger('fundingcycle:new', viewModel.cycle());
                        toastr.success('Funding Cycle created');
                    }
                    else {
                        app.trigger('fundingcycle:edit', viewModel.cycle());
                        toastr.success('Funding Cycle saved');
                    }

                    viewModel.isSaved = true;
                    viewModel.modal.close(dialogResult);
                })
                .fail(function (error) {
                    toastr.error('Error saving Funding Cycle: ' + error);
                });
        }

        function cancel(dialogResult) {
            if (viewModel.isNew)
                viewModel.donor().fundingCycles.remove(viewModel.cycle());

            uow.rollback();
            this.modal.close(dialogResult);
        }

        function deleteCycle(dialogResult) {
            if (!viewModel.isNew()) {
                //Confirm with user they want to delete this item
                app.showMessage('Are you sure you want to delete this funding cycle?', 'Delete Funding Cycle', ['Yes', 'No'])
                .then(function (args) {
                    if (args == 'Yes') {
                        viewModel.cycle().entityAspect.setDeleted();

                        uow.commit()
                            .then(function () {
                                viewModel.donor().fundingCycles.valueHasMutated();
                                toastr.success('Funding Cycle deleted');
                                viewModel.modal.close(dialogResult);
                            })
                            .fail(function (error) {
                                toastr.error('Error deleting funding cycle: ' + error);
                            });
                    }
                    else
                        return;
                });
            }
        }


    });