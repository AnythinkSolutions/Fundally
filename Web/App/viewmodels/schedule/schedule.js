define(['services/unitofwork', 'services/calendar', 'services/utils', 'durandal/app'], function (unitofwork, calendar, utils, app) {

    var viewModel = {
        isWorking: ko.observable(true),
        uow: unitofwork.create(),
        items: ko.observableArray(),
        upcomingItems: ko.observableArray(),
        calendar: calendar,

        viewAttached: viewAttached,
        activate: activate,

        getActivityTooltip: getActivityTooltip,
        addEvent: addEvent,
        openEvent: openEvent
}

    return viewModel;

    //-----------------------------
    //---- Private Methods --------
    //-----------------------------

    function viewAttached() {
        var self = this

        calendar.initialize(onDateChanging, onDateChanged);

        viewModel.uow.activities.allIncluding("Donor, FundingCycle")
            .then(function (data) {

                var now = new Date();
                var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                now = null;

                var dated = $.grep(data, function (a) { return a.dueDate() != null; });
                var upcoming = $.grep(dated, function (a) {
                    return a.dueDate().getTime() >= today.getTime();
                });

                viewModel.upcomingItems(upcoming);
                viewModel.upcomingItems.sort(utils.sortActivitiesByDueDate);

                var events = $.map(dated, function (e, i) { return createEvent(e); });
                calendar.addEvents(events);

                today = null;
            });

        //Subscribe to new tasks being created
        app.on('activity:new').then(function(activity){
            if(activity.dueDate() != null){

                var event = new calendar.event(activity.dueDate(), activity.subject(), getActivityTooltip(activity));
                
                //need to get the actual Activity from my UOW, can't use the one passed in from the event because
                // it may (likely will) come from a different uow.
                viewModel.uow.activities.withIdIncluding(activity.id(), "ActivityType")
                    .then(function(data){
                        event.activity = data[0];
                    });

                calendar.addEvent(event);

                var now = new Date();
                var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                now = null;
                if(activity.dueDate().getTime() >= today.getTime())
                    viewModel.upcomingItems.push(activity);
            }
        });
        
        viewModel.isWorking(false);
    }

    function getActivityTooltip(activity) {
        var tooltip = '';
        if (activity.donor() != null)
            tooltip += 'Donor: ' + activity.donor().name() + '\n';
        if (activity.fundingCycle() != null)
            tooltip += 'Cycle: ' + activity.fundingCycle().name() + '\n';
        if (activity.body() != null)
            tooltip += activity.body();

        return tooltip;
    }

    function createEvent(activity) {       

        return new calendar.event(activity.dueDate(), activity.subject(), getActivityTooltip(activity), activity);
    }

    function activate() {
        var self = this;

        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
    }

    function onDateChanging(oldDate, newDate) {
        //alert('changing date!');
        return true;
    }

    function onDateChanged(newDate) {
        //alert('changed date!');
    }
    
    function addEvent() {

        var params = { uow: viewModel.uow, activity: null };
        app.showModal('viewmodels/schedule/eventdialog', params); //, activity);
    }

    function openEvent(event) {
        var params = { uow: viewModel.uow, activity: event.activity };
        var originalDueDate = event.activity.dueDate();

        app.showModal('viewmodels/schedule/eventdialog', params)
            .then(function (dialogResult) {
                if (dialogResult.isSaved) {

                    event.subject(event.activity.subject());
                    event.tooltip(getActivityTooltip(event.activity));

                    var curDate = event.activity.dueDate();
                    if (!utils.isSameDate(originalDueDate, curDate)) {

                        //Update the event with the new date
                        event.date = curDate;

                        //get the day from the calendar and remove the event
                        var oldDays = $.grep(viewModel.calendar.days(), function (d) { return utils.isSameDate(d.date, originalDueDate); });
                        if (oldDays != null && oldDays.length > 0) {
                            oldDays[0].events.remove(event);
                        }
                        //get the new day and add it to that day
                        var newDays = $.grep(viewModel.calendar.days(), function (d) { return utils.isSameDate(d.date, curDate); });
                        if (newDays != null && newDays.length > 0) {
                            newDays[0].addEvent(event);
                        }

                    }
                }
            });
    }
});