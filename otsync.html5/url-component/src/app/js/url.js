/**
 * # UrlView
 * An assignment viewer component for
 * OpenText Application Gateway.
 *
 * **Version** 1.0.0
 */

/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
 strict:true, undef:true, unused:true, curly:true, browser:true,
 jquery: true */
/* global App */
(function () {
    // Keep JavaScript definitions strict
    "use strict";

    // Create the application
    var UrlView = new App();
    var urlData = UrlView.getParameters();
    var deviceStrategy = UrlView.getDeviceStrategy();
    var id = urlData.id;

    /**
     * ## Initialization
     * Set up initial events and load data.
     */

    /**
     * ### UrlView.init
     *
     * Application initialization.
     */
    UrlView.init = function () {
        // Only trigger the initialization once
        if (!this.initialized && isValidId(id)) {
            this.initialized = true;
            doRedirect();
        }
    };

    function doRedirect() {
        deviceStrategy.getGatewayURL().then(function (gatewayUrl) {
            $.when(
                UrlView.runRequestWithAuth({
                    url: gatewayUrl + '/content/v5/nodes/' + id,
                    cache: false
                })
            ).done(
                function (data) {
                    if (data.ok) {
                        var url = data.contents[0].URLLink;
                        // Open the link in a new browser, and close this app when the webview is dimissed
                        var ref = UrlView.openWindow(url);

                        ref.addEventListener('exit', function () {
                            UrlView.close();
                        });
                    }
                    else {
                        error(apputil.T('error.Could not get link') + data.errMsg);
                    }
                }
            ).fail(
                function (data) {
                    error(apputil.T('error.Could not get link') + data.status + ": " + data.statusText);
                }
            );
        });

    }

    function isValidId(nodeId) {
        var isInvalid = (isNaN(nodeId) || nodeId === '');

        if (isInvalid) {
            error(apputil.T('error.Missing nodeID'));
        }

        return !isInvalid;
    }

    function error(msg) {
        $('#node-name').text(msg);
    }

    // start the application
    UrlView.start();

}).call(this);
