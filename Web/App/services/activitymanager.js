define(['services/utils', 'durandal/app'], function (utils, app) {
    var ActivityManager = (function () {

        var activityManager = function (unitOfWork, obsArray, added, deleted) {
            var self = this;
            var uow = unitOfWork;
            var defaultActivityType = null;
            self.activityTypes = ko.observableArray();
            //self.defaultActivityType = null;
            var collection = obsArray;
            var onAdded = added;
            var onDeleted = deleted;

            uow.definitions.all()
                .then(function (data) {
                    self.activityTypes(utils.getDefinitions(data, 'activity_type'));
                    defaultActivityType = utils.getDefaultDefinition(self.activityTypes());
                    //self.defaultActivityType = dfActType;
                });

            this.newActivity = function () {
                //var self = this.activityManager;

                var activity = uow.activities.create();
                activity.activityType(defaultActivityType);
                activity.isEditing(true);
                activity.activityDate(new Date());

                if (onAdded != null)
                    onAdded(activity);

                collection.unshift(activity);
            }

            this.deleteActivity = function (activity) {
                //var self = this;

                if (!activity.entityAspect.entityState.isAdded()) {
                    //Confirm with user they want to delete this item
                    app.showMessage('Are you sure you want to delete this activity?', 'Delete Activity', ['Yes', 'No'])
                    .then(function (args) {
                        if (args == 'Yes') {
                            deleteItemCore(activity);
                            collection.valueHasChanged();

                            //send out notification about the delete
                            app.trigger('activity:delete', activity.id());

                            if (onDeleted != null)
                                onDeleted(activity);

                            activity = null;
                            //getActivities();
                        }
                        else
                            return;
                    });
                }
                else {
                    deleteItemCore(activity);
                    collection.valueHasChanged();
                    //getActivities();
                }
            }

            this.cancelActivity = function (activity) {

                //activity.isEditing(false);

                if (activity.entityAspect.entityState.isAdded())
                    activity.entityAspect.setDeleted(); //deleteItemCore(activity);

                uow.rollback();

                //getActivities();
            }

            this.editActivity = function (activity) {
                activity.isEditing(true);
            }

            this.saveActivity = function (activity) {
                var isNew = activity.entityAspect.entityState.isAdded();
                activity.isEditing(false);

                uow.commit()
                    .then(function () {
                        if (isNew)
                            app.trigger('activity:new', activity);
                        else
                            app.trigger('activity:edit', activity);
                    });
            }

            this.markComplete = function (activity) {
                if (activity.hasDueDate()) {
                    var isComplete = activity.isComplete();
                    activity.isComplete(!isComplete);
                    uow.commit();
                }
            }

            //Deletes an item and removes it from a collection
            function deleteItemCore(item, delayedCommit) {
                item.entityAspect.setDeleted();

                if (!delayedCommit)
                    uow.commit();
            }
        }

        return activityManager;

    })();

    return {
        create: create,
    };

    /**
    * Creates a new Activity Manager
    **/
    function create(unitOfWork, obsArray, onAdded, onDeleted) {
        var am = new ActivityManager(unitOfWork, obsArray, onAdded, onDeleted);
        
        return am;
    }

});