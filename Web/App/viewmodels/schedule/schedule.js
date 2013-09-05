define(['services/unitofwork', 'services/calendar', 'services/utils', 'durandal/app'], function (unitofwork, calendar, utils, app) {

    var viewModel = {
        isWorking: ko.observable(true),
        uow: unitofwork.create(),
        items: ko.observableArray(),
        upcomingItems: ko.observableArray(),
        calendar: calendar,

        viewAttached: viewAttached,
        activate: activate,

        getActivityTooltip: getActivityTooltip
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
                viewModel.upcomingItems.sort(sortActivities);

                var events = $.map(dated, function (e, i) { return createEvent(e); });
                calendar.addEvents(events);

                today = null;
            });

        //Subscribe to new tasks being created
        app.on('activity:new').then(function(activity){
            if(activity.dueDate() != null){

                var event = new calendar.event(activity.dueDate(), activity.subject(), getActivityTooltip(activity));
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

        return new calendar.event(activity.dueDate(), activity.subject(), getActivityTooltip(activity));
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

    function sortActivities(left, right){
        var leftTime = left.dueDate().getTime();
        var rightTime = right.dueDate().getTime();

        if(leftTime < rightTime)
            return -1;
        else if(leftTime === rightTime)
            return 0;
        else
            return 1;
        
    }
    
});