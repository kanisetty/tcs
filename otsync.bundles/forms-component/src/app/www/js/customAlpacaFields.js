var AddCustomAlpacaFields = function() {

    Alpaca.Fields.CsuiDateOnlyField = Alpaca.Fields.DateField.extend({

        getFieldType: function() {
            return "date";
        },
        setValue: function (val) {

            // skip out if no date
            if (val === "") {
                this.base(val);
                return;
            }

            /* Check and handle Content Server's date in ISO-8601 format */
            if ($.isArray(val)) {
                val = _.map(val, function (el) {
                    return this.convertIsoToAlpacaFormat(el);
                }, this);
                this.base(base.formatExactDate(val));
                return;
            } else if (val) {
                this.base(base.formatExactDate(this.convertIsoToAlpacaFormat(val)));
                return;
            }

            this.base(base.formatExactDate(val));
        },

        getValue: function () {
            var value = this.base();
            /* Content Server only accepts datetime value in ISO-8601 format */
            value = base.dateToLocalIsoString(value,
                    this.changeYearInDateFormat(this.options.dateFormat));
            return value;
        },

        /* private: convert Content Server's date in ISO-8601 format to Alpaca format */
        convertIsoToAlpacaFormat: function (val) {
            var csDTFormat = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})/;
            if (typeof val == "string" && csDTFormat.test(val)) {
                var mmDatetime = moment(val, moment.ISO_8601);
                if (mmDatetime.isValid()) {
                    val = base.formatDate(val,
                            this.changeYearInDateFormat(this.options.dateFormat));
                }
            }
            return val;
        },

        /* private */
        changeYearInDateFormat: function (format) {
            /* The year format of both Alpaca and jQueryUI.datepicker has y=2-digit-year and yy=4-digit-year.
             With moment.js each y is a digit. Double up the 'y' if needed. */
            var delta;
            var dateFormat = format;
            dateFormat.toLowerCase();
            delta = dateFormat.lastIndexOf('y') - dateFormat.indexOf('y') + 1;
            if (delta > 0 && delta < 3) {
                dateFormat = dateFormat.replace(/y/g, "yy");
            }
            return dateFormat;
        }
    });

    Alpaca.registerFieldClass("date", Alpaca.Fields.CsuiDateOnlyField);
    Alpaca.registerDefaultFormatFieldMapping("date", "date");

    Alpaca.Fields.CsuiDateTimeField = Alpaca.Fields.DatetimeField.extend({

        setValue: function (value) {
            this.base();

            /* Check and handle Content Server's datetime value in ISO-8601 format */
            if ($.isArray(value)) {
                value = _.map(value, function (el) {
                    return this.convertIsoToAlpacaFormat(el);
                }, this);
                this.base(base.formatExactDateTime(value));
            } else {
                this.base(base.formatExactDateTime(this.convertIsoToAlpacaFormat(value)));
            }
        },

        getValue: function () {
            var value = this.base();
            /* Content Server only accepts datetime value in ISO-8601 format */
            value = base.dateToLocalIsoString(value);
            return value;
        },

        /* private: convert Content Server's date in ISO-8601 format to Alpaca format */
        convertIsoToAlpacaFormat: function (value) {
            function pad(n) { return n < 10 ? '0' + n : n }

            var csDTFormat = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})/;
            if (typeof value == "string" && csDTFormat.test(value)) {
                var mmDatetime = moment(value, moment.ISO_8601);
                if (mmDatetime.isValid()) {
                    /* jQueryUI.datetimepicker expects the same datetime format as in Alpaca setValue code */
                    value =
                        pad((mmDatetime.month() + 1)) + "/" +
                        pad(mmDatetime.date()) + "/" +
                        pad(mmDatetime.year()) + " " +
                        pad(mmDatetime.hours()) + ":" +
                        pad(mmDatetime.minutes());
                }
            }
            return value;
        }

    });

    Alpaca.registerFieldClass("datetime", Alpaca.Fields.CsuiDateTimeField);
    Alpaca.registerDefaultFormatFieldMapping("datetime", "datetime");

    Alpaca.Fields.otcsUserPicker = Alpaca.Fields.TextField.extend({

        setup: function()
        {
            this.base();
            this.selectedUserID = this.data == undefined ? '' : this.data;
        },

        setValue: function(value) {

            if(_.isObject(value)) {

                this.selectedUserID = value.selectedUserID;
                this.selectedUserName = value.selectedUserName;
                this.base(value.selectedUserName);
            }
        },

        onBlur: function(e) {

            //Do the type ahead blur logic before I blank out user
            var typeahead = $(this.getControlEl()).data().typeahead;

            setTimeout(function () {
                if (!typeahead.$menu.is(':hover')) {
                    typeahead.hide();
                }
            }, 150);

            var currentText = e.target.value;
            //Clear selected user if text has been modified
            if(currentText != this.selectedUserName) {
                var blankUser = {selectedUserName: '', selectedUserID: ''};
                this.setValue(blankUser)
            }
        },

        getValue: function () {
            return this.selectedUserID;
        },

        getDisplayName: function(userObject) {

            return (userObject.first_name == null || userObject.last_name == null) ? userObject.name : userObject.first_name + ' ' + userObject.last_name;
        },

        postRender: function ( callback) {

            var _this = this;
            var where_type;
            var field = this.getControlEl();


            field.on('blur', $.proxy(this.onBlur, this));

            // If user_picker, only return users
            if (this.type == 'otcs_user_picker') {
                where_type = UAPI.User;
            }

            if(this.data != undefined) {

                var requestParams = {
                    method: 'GET',
                    url: appSettings.serverURL + appSettings.CONTENT_SERVER_API_PATH + '/v1/members/' + this.data,
                    headers: {'Content-Type': 'application/json; charset=utf-8', OTCSTICKET: appSettings.otcsTicket}
                };

                $.when(request.sendRequest(requestParams)).done(function (userData) {

                    var user = {};
                    user.selectedUserName = _this.getDisplayName(userData.data);
                    user.selectedUserID = userData.data.id;

                    _this.setValue(user);
                    callback();

                }).fail(function(error) {
                    console.log(error);
                });

            }
            else {
                callback();
            }

            field.typeahead({
                source: function () {

                    return function (query, process) {

                        var url = appSettings.serverURL + appSettings.CONTENT_SERVER_API_PATH + '/v1/members?limit=5&query=' + query;

                        if (where_type != undefined)
                            url += '&where_type=' + where_type;

                        var requestParams = {
                            method: 'GET',
                            url: url,
                            headers: {'Content-Type': 'application/json; charset=utf-8'}
                        };

                        return $.when(request.sendRequest(requestParams)).done(function (data) {

                            var options = [];

                            for (var i in data.data) {
                                options.push('<span data-attrid dataID="' + data.data[i].id + '">'
                                        + _this.getDisplayName(data.data[i]) + '</span>');
                            }
                            return process(options);
                        });
                    };
                }(),

                matcher: function (item) {

                    return true;	// always match, our api takes care of the filtering.
                },

                updater: function () {

                    return function (item) {
                        item = $(item);

                        var user = {};

                        user.selectedUserID = item.attr('dataID');
                        user.selectedUserName = item.text();
                        _this.setValue(user);

                        return item.text();
                    };
                }(),

                highlighter: function (item) {

                    return item;
                },

                minLength: 2,
                items: 5
            });
        }
    });

    Alpaca.registerFieldClass("otcs_user_picker", Alpaca.Fields.otcsUserPicker);
    Alpaca.registerFieldClass("otcs_member_picker", Alpaca.Fields.otcsUserPicker);
}
