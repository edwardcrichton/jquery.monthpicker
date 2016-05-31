"use strict";

(function ($) {
	'use strict';

	if (!$ || !$.ui) {
		return;
	}

	var namespace = "custom";
	var widgetName = "monthpicker";
	var fullWidgetName = namespace + "." + widgetName;
	var className = namespace + "-" + widgetName;

	var months = {};

	months["en"] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	months["fr"] = ["janvier", "f&#xE9;vrier", "mars", "avril", "mai", "juin", "juillet", "ao&#xFB;t", "septembre", "octobre", "novembre", "d&#xE9;cembre"];
	months["es"] = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
	months["de"] = ["Januar", "Februar", "M&#xE4;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

	var now = new Date();
	var minDate = new Date(now.getTime());
	var maxDate = new Date(now.getTime());

	minDate.setFullYear(minDate.getFullYear() - 5);
	maxDate.setFullYear(maxDate.getFullYear() + 5);

	var options = {
		language: "en",
		min: minDate,
		max: maxDate,
		default: now,
		optional: false
	};

	$.widget(fullWidgetName, {
		options: options,
		controlId: "",
		_create: function _create() {
			var me = $(this.element);

			me.hide();

			var minYear = this.options.min.getFullYear();
			var maxYear = this.options.max.getFullYear();

			$(me).uniqueId();

			var id = $(me).attr("id");
			this.controlId = id + "_monthpicker";

			var element = $("<div/>");
			element.attr("id", this.controlId);
			element.css("display", "inline");
			if ($(me).attr("class")) {
				element.addClass($(me).attr("class"));
			}
			element.insertBefore(me);

			var monthsElement = $("<select/>");
			var yearsElement = $("<select/>");

			monthsElement.addClass(className + "-months");
			yearsElement.addClass(className + "-years");
			element.append(monthsElement);
			element.append(yearsElement);

			this._updateMonths();
			this._updateYears();

			var change = function change() {
				$(me).trigger("change");
			};

			monthsElement.on("change", change);
			yearsElement.on("change", change);
		},
		_setOption: function _setOption(key, value) {
			var toUpdate = this._doSetOption(key, value);

			if (toUpdate) {
				this._updateAll();
			}

			this._super(key, value);
		},
		_setOptions: function _setOptions(options) {
			var toUpdate = false;
			for (var option in options) {
				var toUpdateFromThis = this._doSetOption(option, options[option]);
				if (toUpdateFromThis) {
					toUpdate = true;
				}
			}

			if (toUpdate) {
				this._updateAll();
			}

			this._super(options);
		},
		_doSetOption: function _doSetOption(key, value) {
			var toUpdate = false;
			switch (key) {
				case "min":
					this.options.min = value;
					toUpdate = true;
					break;
				case "max":
					this.options.max = value;
					toUpdate = true;
					break;
				case "language":
					this.options.language = value;
					toUpdate = true;
					break;
				case "optional":
					this.options.optional = value;
					toUpdate = true;
					break;
				case "default":
					this.options.default = value;
					toUpdate = false;
					break;
			}
			return toUpdate;
		},

		_triggerChange: function _triggerChange() {
			var me = $(this.element);

			$(me).trigger("change");
		},
		_updateAll: function _updateAll() {
			var date = this.getDate();

			this._updateMonths();
			this._updateYears();
			this.setDate(date);
		},
		_updateMonths: function _updateMonths() {
			var control = $('#' + this.controlId);
			var monthsElement = $(control).find("." + className + "-months");

			monthsElement.empty();

			var monthArray = months[this.options.language];

			if (!monthArray) {
				if ($.datepicker && $.datepicker.regional[this.options.language]) {
					monthArray = $.datepicker.regional[this.options.language].monthNames;
					if (!monthArray) {
						monthArray = $.datepicker.regional[""].monthNames;
					}
				} else {
					monthArray = months["en"];
				}
			}

			var defaultMonth = null;

			if (this.options.default) {
				defaultMonth = this.options.default.getMonth();
			}

			if (this.options.optional) {
				(function () {
					var option = $("<option/>");
					option.attr("value", "-");
					option.html("----------");
					if (defaultMonth === null) {
						option.attr("selected", "selected");
					}
					monthsElement.append(option);
				})();
			}

			for (var m = 0; m < monthArray.length; m++) {
				(function () {
					var option = $("<option/>");
					option.attr("value", m);
					option.html(monthArray[m]);
					if (m === defaultMonth) {
						option.attr("selected", "selected");
					}
					monthsElement.append(option);
				})();
			}
		},
		_updateYears: function _updateYears() {
			var control = $('#' + this.controlId);
			var yearsElement = $(control).find("." + className + "-years");
			yearsElement.empty();

			var minYear = this.options.min.getFullYear();
			var maxYear = this.options.max.getFullYear();

			var defaultYear = this.options.default.getFullYear();

			for (var y = minYear; y <= maxYear; y++) {
				(function () {
					var option = $("<option/>");
					option.attr("value", y);
					option.text("" + y);
					if (y === defaultYear) {
						option.attr("selected", "selected");
					}
					yearsElement.append(option);
				})();
			}
		},
		/* public methods */

		getDate: function getDate() {
			var control = $('#' + this.controlId);
			var monthsElement = $(control).find("." + className + "-months");
			var yearsElement = $(control).find("." + className + "-years");

			var selectedMonthValue = $(monthsElement).find("option:selected").attr("value");
			if (Number(selectedMonthValue) !== Number(selectedMonthValue)) {
				return null;
			}

			var monthValue = parseInt(selectedMonthValue, 10);
			var yearValue = parseInt($(yearsElement).find("option:selected").attr("value"), 10);

			return new Date(yearValue, monthValue, 1);
		},
		setDate: function setDate(date) {
			if (date === undefined) {
				return;
			}

			var control = $('#' + this.controlId);
			var monthsElement = $(control).find("." + className + "-months");
			var yearsElement = $(control).find("." + className + "-years");

			if (date === null) {

				$(monthsElement).find("option[value=-]").prop("selected", true);
			} else {
				if (!date.getMonth || !date.getFullYear) {
					return;
				}

				var monthValue = date.getMonth();
				var yearValue = date.getFullYear();

				$(monthsElement).find("option[value=" + monthValue + "]").prop("selected", true);
				$(yearsElement).find("option[value=" + yearValue + "]").prop("selected", true);

				var current = this.getDate();

				if (current.getMonth() !== monthValue || current.getFullYear() !== yearValue) {
					var defaultDate = this.options.default;

					if (defaultDate === null) {
						$(monthsElement).find("option[value=-]").prop("selected", true);
					} else {
						var defaultMonthValue = defaultDate.getMonth();
						var defaultYearValue = defaultDate.getFullYear();

						$(monthsElement).find("option[value=" + defaultMonthValue + "]").prop("selected", true);
						$(yearsElement).find("option[value=" + defaultYearValue + "]").prop("selected", true);
					}
				}
			}

			var me = $(this.element);

			$(me).trigger("change");
		}
	});
})(jQuery);

