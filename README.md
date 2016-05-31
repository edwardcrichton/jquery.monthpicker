# jquery.monthpicker
A jquery ui widget for choosing months and years.

The problem. I wanted a widget for choosing a particular month. So I tried to get the jqueryui datepicker to work with mm/yy date format. Datepicker does not like date formats without the day of the month, it gives parser errors. It is possible to catch some events and fix that behaviour. It is possible to hide the days of the month. It is possible to add your own buttons. However, I found it was not possible to modifiy it completely to do months only because the datepicker, when it refreshes, rebuilds the entire datepicker HTML so all jquery references to parts of the datepicker are lost and it does this _after_ any events which would allow the HTML elements to be found and modified.

As a solution, this is a very simple date picker. It hides the element it was called on, and inserts a dropdown for the month of the year and another dropdown for the year itself. Change events are triggered whenever there is a change to the month or year. There are getDate and setDate methods. Choosing a month can be made optional, getDate returns null if a month is not chosen.

