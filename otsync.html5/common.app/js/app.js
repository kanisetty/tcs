/**
 * # OTAG App Framework
 * A basic structure for OpenText Application Gateway
 * application creation.
 *
 * **Version** 1.0.0
 *
 * **Dependencies**
 * * jQuery >= 2.0.0
 */

/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
 strict:true, undef:true, unused:true, curly:true, browser:true,
 jquery:true */
/* global cordova, moment */

;(function () {
    // Keep JavaScript definitions strict
    "use strict";

    /**
     * ## App Constructor
     *
     * Application structure.
     *
     * @return    App object.
     */
    var deviceStrategyFactory = new DeviceStrategyFactory();
    var deviceStrategy = deviceStrategyFactory.getDeviceStrategy();

    var App = function () {
        // Haven't initialized yet
        this.initialized = false;

        this.getDeviceStrategy = function(){

            return deviceStrategy;
        };

        // Return the app reference
        return this;
    };

    /**
     * ## Initialization
     * Creating, initializing, and starting the application.
     */

    /**
     * ### App.prototype.start
     *
     * Start the application.
     */
    App.prototype.start = function () {
        var _this = this;

        var onDeviceReady = function () {

            deviceStrategy.getDefaultLanguage()
                .done(function (lang) {
                    $.jsperanto.init(function () {
                            var key;
                            // find all 'localize' classes and translate them: both text and title attr (if present)
                            $('.localize').each(function () {
                                key = $(this).text().replace(/\./g, '');
                                $(this).text(apputil.T('label.' + key));

                                var title = $(this).attr('title');
                                if (title) {
                                    key = title.replace(/\./g, '');
                                    $(this).attr('title', apputil.T('label.' + key));
                                }
                            });

                            // Hide the loading overlay
                            _this.hideLoading();

                            // Execute the init function, if it exists
                            if (_this.init) {
                                _this.init();
                            }
                        },
                        {lang: lang});
                })
                .fail(function (error) {
                    alert(error);
                });
        };

        // Display the loading overlay
        _this.showLoading();

        // Trigger when Cordova is ready
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    /**
     * ## Miscellaneous
     * A collection of useful methods to help reduce development
     * time and make the framework easier to user.
     */

    /**
     * ### App.prototype.getHash
     *
     * Get any hash parameters.
     *
     * @param href    A specific URL to parse (Default: window.location.hash).
     * @return        String representing the URL hash.
     */
    App.prototype.getHash = function(href) {
        var hash = (href || window.location.hash).split("#");
        return (hash.length > 1 ? hash[1] : "");
    };

    /**
     * ### App.prototype.getParameters
     *
     * Get any query string parameters.
     *
     * @return    Object of key:value pairs of parameters.
     */
    App.prototype.getParameters = function () {
        var query = window.location.search.toString().substring(1).split('data=').pop();
        return deviceStrategy.processQueryParameters(query);
    };

    App.prototype.runRequestWithAuth = function(data) {
        data.cache = false;

        return deviceStrategy.runRequestWithAuth(data);
    };

    App.prototype.close = function() {

        return deviceStrategy.close();
    };

    App.prototype.openWindow = function(url) {

        return deviceStrategy.openWindow(url);
    };
	
	App.prototype.openFromAppworks = function(destComponentName, data, refreshOnReturn, isComponent) {

        return deviceStrategy.openFromAppworks(destComponentName, data, refreshOnReturn, isComponent);
    };


    /**
     * ### App.prototype.toggleLoad
     *
     * Toggle the loading overlay panel.
     * Will create it if it does not exist.
     *
     * @param isLoad    True to show the overlay, false to hide.
     */
    App.prototype.toggleLoad = function (isLoad) {
        // Get the overlay element
        var $el = $("#overlay");

        // Create the element, if it doesn't exist
        if ($el.length <= 0) {
            $el = $("<div class='overlay' id='overlay'></div>");
            $(document.body).append($el);
        }

        $el.toggle(isLoad);
    };

    /**
     * #### App.prototype.showLoading
     *
     * Show the loading overlay.
     */
    App.prototype.showLoading = function () {
        this.toggleLoad(true);
    };

    /**
     * #### App.prototype.hideLoading
     *
     * Hide the loading overlay.
     */
    App.prototype.hideLoading = function () {
        this.toggleLoad(false);
    };

    /**
     * ## Formatting
     *
     * General string formatting.
     */
    App.prototype.format = {
        /**
         * ### App.prototype.format.date
         *
         * Format a date according to locale.
         * Will use moment.js if availble.
         *
         * @param theDate    The date to format.
         * @return           A string representing the formatted date.
         */
        date: function (theDate) {
            var result;

            // Use moment.js if it exists
            if (moment) {
                result = moment(theDate, "YYYY-MM-DDTHH:mm:ssZ").format("LLL");
            } else {
                result = theDate.toLocaleDateString();
            }
            return result;
        },
        /**
         * ### App.prototype.format.displayName
         *
         * Format a user's display name.
         *
         * @param username     The user's username.
         * @param firstName    The user's first name.
         * @param lastName     The user's last name.
         * @return             String that best represents the user.
         */
        displayName: function (username, firstName, lastName) {
            var displayName = '';

            // Include the first name, if available
            if (firstName) {
                displayName += firstName;
            }

            // Include the last name, if available
            if (lastName && lastName !== 'N/A') {
                displayName += ' ' + lastName;
            }

            // Show a combination of first/last name, otherwise username
            return (displayName || username || '').trim();
        },
        /**
         * ### App.prototype.format.number
         *
         * Format a number with commas.
         *
         * @param num    The number to format.
         * @return       A string representing the formatted number.
         */
        number: function (num) {
            // Set commas every 3 digit, starting on the right (ie. 1,234,567)
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    };

    // Expose the App globally
    window.App = App;

}).call(this);

var apputil = new function(){
    /**

     This function will return an HTML decoded string

     @param	{String} value
     @return {String} The HTML decoded string
     */
    this.htmlDecode = function(value){

        // if < or > is present in the value, encode them first before passing to $.html()
        var patt = /[<>]/i;
        if(patt.test(value))
        {
            value = value.replace("<","&lt;").replace(">","&gt;");
        }
        var r = $('<div/>').html(value).text();
        return r;
    }

    /**
     This function will provide the translated string from the loaded dictionary that matches the passed key.

     @param {String} key
     @param {Object} data Object that contains properties named to match the variable substitution used in the
     dictionary object

     @return {String} The translated string
     */
    this.T = function( key, data ){
        return  $.t( key, data );
    }
};

