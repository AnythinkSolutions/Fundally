define(['durandal/app', 'services/utils'],
    function (app, utils) {
        
        var calendar = {
            date: ko.observable(),
            day: ko.observable(),
            month: ko.observable(),
            year: ko.observable(),
            monthName: ko.observable(),
            weeks: ko.observableArray(),
            days: ko.observableArray(),
            events: ko.observableArray(),
            selectedDay: ko.observable(),

            dateChanging: null,
            dateChanged: null,

            initialize: initialize,
            setDate: setDate,
            nextMonth: nextMonth,
            prevMonth: prevMonth,
            nextYear: nextYear,
            prevYear: prevYear,
            gotoToday: gotoToday,
            selectDate: selectDate,

            event: event,
            addEvent: addEvent,
            addEvents: addEvents
        };

        return calendar;

        //An object to represent a day on the calendar.
        function day(dayDate, now) {
            var self = this;

            self.date = dayDate;
            self.isCurrentDay = (dayDate.getTime() === now.getTime());
            self.isCurrentMonth = (dayDate.getMonth() == calendar.month());
            self.dayOfWeek = dayDate.getDay();
            self.dayOfMonth = dayDate.getDate();
            self.isSelected = ko.observable(false);

            self.events = ko.observableArray();
            
            self.checkForEvents = function () {
                if (calendar.events() != null) {
                    self.events($.grep(calendar.events(), function (e) {
                        return utils.isSameDate(e.date, self.date);
                    }));
                }
            }

            self.addEvent = function(event){
                self.events.push(event);
            }

            self.checkForEvents();
        }

        function event(date, subject, tooltip, activity) {
            var self = this;

            self.date = date;
            self.subject = subject;
            self.tooltip = tooltip;
            self.activity = activity;
        }
        
        function addEvents(events) {
            calendar.events(events);

            if (calendar.days() != null) {
                $.each(calendar.days(), function (i, d) {
                    d.checkForEvents();
                });
            }
        }

        function addEvent(event) {
            calendar.events.push(event);

            var day = $.grep(calendar.days(), function (d) { return utils.isSameDate(event.date, d.date); });

            if(day != null && day.length > 0 && day[0] != null)
                day[0].addEvent(event);
        }

        function nextMonth() {
            var nextMonthYear = calendar.month() == 12 ? calendar.year() + 1 : calendar.year();
            var nextMonth = calendar.month() == 12 ? 1 : calendar.month() + 1;

            var newDate = new Date(nextMonthYear, nextMonth, 1);
            setDate(newDate);
        }

        function prevMonth() {
            var prevMonthYear = calendar.month() == 1 ? calendar.year() - 1 : calendar.year();
            var prevMonth = calendar.month() == 1 ? 12 : calendar.month() - 1;

            var newDate = new Date(prevMonthYear, prevMonth, 1);
            setDate(newDate);
        }

        function nextYear() {
            var newDate = new Date(calendar.year() + 1, calendar.month(), 1);
            setDate(newDate);
        }

        function prevYear() {
            var newDate = new Date(calendar.year() - 1, calendar.month(), 1);
            setDate(newDate);
        }

        function gotoToday() {
            setDate(new Date());
        }

        function isLeapYear(year) {
            if (year % 4 == 0) // basic rule
                return true // is leap year
            return false // is not leap year
        }

        function getDays(month, year) {
            // create array to hold number of days in each month
            var ar = new Array(12)
            ar[0] = 31 // January
            ar[1] = (isLeapYear(year)) ? 29 : 28 // February
            ar[2] = 31 // March
            ar[3] = 30 // April
            ar[4] = 31 // May
            ar[5] = 30 // June
            ar[6] = 31 // July
            ar[7] = 31 // August
            ar[8] = 30 // September
            ar[9] = 31 // October
            ar[10] = 30 // November
            ar[11] = 31 // December

            // return number of days in the specified month (parameter)
            return ar[month]
        }

        function getMonthName(month) {
            // create array to hold name of each month
            var ar = new Array(12)
            ar[0] = "January"
            ar[1] = "February"
            ar[2] = "March"
            ar[3] = "April"
            ar[4] = "May"
            ar[5] = "June"
            ar[6] = "July"
            ar[7] = "August"
            ar[8] = "September"
            ar[9] = "October"
            ar[10] = "November"
            ar[11] = "December"

            // return name of specified month (parameter)
            return ar[month]
        }

        function getFirstDayOfMonth(date) {
            var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            return firstDayOfMonth;
        }

        function initialize(changingCallback, changedCallback) {
            calendar.dateChanging = changingCallback;
            calendar.dateChanged = changedCallback;

            setDate(new Date());
        }

        function setDate(calendarDate) {

            if (calendarDate == null)
                calendarDate = new Date();

            if (calendar.dateChanging) {
                var result = calendar.dateChanging(calendar.date(), calendarDate);
                if (result == false)
                    return;
            }

            var rebuild = calendar.date() == null || calendarDate.getFullYear() != calendar.year() || calendar.month() != calendarDate.getMonth();
            calendar.date(calendarDate);

            // standard time attributes
            if (rebuild) {
                var year = calendarDate.getFullYear();
                var month = calendarDate.getMonth();
                var monthName = getMonthName(month);
                var date = calendarDate.getDate();

                calendar.year(year);
                calendar.month(month);
                calendar.monthName(monthName);
                calendar.day(date);

                // Get the first day of month, and extract the day on which it occurs
                var firstDay = calendarDate.getDay();
                if (date != 1) {
                    var firstDayInstance = new Date(year, month, 1)
                    firstDay = firstDayInstance.getDay()
                    firstDayInstance = null
                }

                // number of days in current month
                var days = getDays(month, year)

                buildCalendar(firstDay + 1, days, date, month, year);
            }

            if (calendar.dateChanged)
                calendar.dateChanged(calendarDate);
        }

        function buildCalendar(firstDay, lastDay, date, month, year) {
            calendar.weeks.removeAll();
            calendar.days.removeAll();

            var weekDays = [];
            var rowCount = Math.ceil((lastDay + firstDay - 1) / 7);
            var curDay = 1;
            var curWeek = 0;
            var now = new Date();
            var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            now = null;

            //Deal with days in the previous month
            if (firstDay > 1) 
                curDay = (1 - (firstDay - 1));

            for (var row = 1; row <= rowCount ; ++row) {
                for (var col = 1; col <= 7; ++col) {

                    if (curDay > lastDay) {
                        if (month == 12) {
                            month = 1;
                            year++;
                        }
                        else
                            month++;

                        curDay = 1;
                    }

                    var dayDate = new Date(year, month, curDay);
                    var thisDay = new day(dayDate, today);
                    calendar.days.push(thisDay);
                    weekDays.push(thisDay); curDay++;
                }

                calendar.weeks.push(weekDays);
                weekDays = [];
                curWeek++;
            }
        }

        function selectDate(date) {

            if (calendar.selectedDay() != null)
                calendar.selectedDay().isSelected(false);
            
            calendar.date(date.date);
            date.isSelected(true);
            calendar.selectedDay(date);
        }
        //function getTime() {
        //    // initialize time-related variables with current time settings
        //    var now = new Date()
        //    var hour = now.getHours()
        //    var minute = now.getMinutes()
        //    now = null
        //    var ampm = ""

        //    // validate hour values and set value of ampm
        //    if (hour >= 12) {
        //        hour -= 12
        //        ampm = "PM"
        //    } else
        //        ampm = "AM"
        //    hour = (hour == 0) ? 12 : hour

        //    // add zero digit to a one digit minute
        //    if (minute < 10)
        //        minute = "0" + minute // do not parse this number!

        //    // return time string
        //    return hour + ":" + minute + " " + ampm
        //}


    }
);