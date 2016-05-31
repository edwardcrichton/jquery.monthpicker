# jquery.monthpicker
A jquery ui widget for choosing months and years.

The problem. I wanted a widget for choosing a particular month. So I tried to get the jqueryui datepicker to work with mm/yy date format. Datepicker does not like date formats without the day of the month, it gives parser errors. It is possible to catch some events and fix that behaviour. It is possible to hide the days of the month. It is possible to add your own buttons. However, I found it was not possible to modifiy it completely to do months only because the datepicker, when it refreshes, rebuilds the entire datepicker HTML so all jquery references to parts of the datepicker are lost and it does this _after_ any events which would allow the HTML elements to be found and modified.

As a solution, this is a very simple date picker. It hides the element it was called on, and inserts a dropdown for the month of the year and another dropdown for the year itself. Change events are triggered whenever there is a change to the month or year. There are getDate and setDate methods. Choosing a month can be made optional, getDate returns ```null``` if a month is not chosen.

Usage
-----

```
$(yourelement).monthpicker( options );
```

The options are:

```min``` - A Date used to set the minimum year. Defaults to ```now``` minus 5 years.
```max``` - A Date used to set the maximum year. Defaults to ```now``` plus 5 years.
```default``` - The Date to chose initially when the widget is first started. If not set, this is ```now``` (this month).
```optional``` - Whether there is an non-month in the month drop down. Defaults to ```false```. It can be useful to set ```default``` to ```null``` when ```optional: true```.

Like any other jquery ui widget, you can set these options with:

```
$(yourelement).monthpicker( "option", optionName, optionValue );
```

or

```
$(yourelement).monthpicker( "option", {...} );
```

To get the chosen month:
```
$(yourelement).monthpicker( "getDate" );
```
This may return ```null``` if the option ```optional: true``` and the user has not chosen a month.

To set the chosen month:
```
$(yourelement).monthpicker( "setDate", theDateObject );
```

If ```optional``` is ```true```, the Date passed can be ```null```: this chooses the non-month.

To listen for changes:

```
$(yourelement).on("change"
  function()
  {
    // The date chosen is:
    $(this).monthpicker("getDate");
  })
```
Examples
--------

Creating a monthpicker:
```
$(element).monthpicker({optional:true,default:null});
```

```
$(element).monthpicker({min: new Date(1990,0,1), max: new Date(2000,0,1), default: new Date(1995,5,1)});
```

Changing the options after creation:
```
$(element).monthpicker("option", {min: new Date(2018,0,1), max: new Date(2020,0,1), default: new Date(2019,5,1)});
```


