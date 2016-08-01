var NonBlackBerryStrategy = function () {
    var _defaultLanguage = 'en';

    this.close = function () {
        var successFn = function () {
        };
        var errorFn = function (error) {
            window.history.back();
        };

        cordova.exec(successFn, errorFn, 'AWComponent', 'close');
    };


    this.execRequest = function (namespace, func, params) {
        var dfd = $.Deferred();
        var _this = this;
        var successFn = function () {
            // Convert the arguments into an array and resolve
            var args = Array.prototype.slice.call(arguments);
            dfd.resolveWith(_this, args);
        };
        var errorFn = function () {
            // Convert the arguments into an array and reject
            var args = Array.prototype.slice.call(arguments);
            dfd.rejectWith(_this, args);
        };

        cordova.exec(successFn, errorFn, namespace, func, params || []);

        return dfd.promise();
    };

    this.getClientOS = function () {
        return window.clientInformation.platform;
    };

    this.getDefaultLanguage = function () {
        return this.execRequest("AWGlobalization", "getPreferredLanguage");
    };

    this.getGatewayURL = function () {
        var deferred = $.Deferred();
        var auth = new Appworks.Auth(function (authResponse) {
            deferred.resolve(authResponse.authData.gatewayUrl);
        });
        auth.authenticate();
        return deferred.promise();
    };

    this.openFromAppworks = function (destComponentName, data, refreshOnReturn, isComponent) {
        var appworksType = "component";
        var component = new Appworks.AWComponent();

        if (!isComponent) {
            appworksType = "app";
        }

        component.open(success, err, [destComponentName, $.param(data), appworksType]);

        function success() {
            if (refreshOnReturn) {
                location.reload();
            }
        }

        function err() {
            alert(apputil.T("error.NoViewerIsAvailableForThisTypeOfAssignment"));
        }
    };

    this.openWindow = function (url) {
        var webview = new Appworks.AWWebView();
        webview.open(url, '_blank', 'EnableViewPortScale=yes,location=no');
    };

    this.processQueryParameters = function (query) {
        var params = {};

        if (typeof(query) === 'string') {
            var pairs = query.split("&");
            var len = pairs.length;
            var idx, pair, key;

            // Iterate through each pair and build the array
            for (idx = 0; idx < len; idx += 1) {
                pair = pairs[idx].split("=");
                key = pair[0];

                switch (typeof params[key]) {
                    // Key has not been found, create entry
                    case "undefined":
                        params[key] = pair[1];
                        break;
                    // Key exists, create an array
                    case "string":
                        params[key] = [params[key], pair[1]];
                        break;
                    // Add to the array
                    default:
                        params[key].push(pair[1]);
                }
            }
        }

        return params;
    };

    this.reauth = function () {
        return this.authenticate(true);
    };

    this.authenticate = function (force) {
        var deferred = $.Deferred();
        var auth = new Appworks.Auth(deferred.resolve, deferred.reject);
        auth.authenticate(force);
        return deferred.promise();
    };

    this.runRequestWithAuth = function (requestData) {
        var _this = this;
        var deferred = $.Deferred();

        this.authenticate().then(runRequestWithCredentials);

        return deferred.promise();

        // helper methods

        function runRequest(authHeader) {
            requestData.headers = authHeader;
            $.ajax(requestData).then(onSuccess, onErr);
        }

        function runRequestWithCredentials(authResponse) {
            runRequest(authResponse.authData.authorizationHeader);
        }

        function onSuccess(data, status, xhr) {
            if (xhr.status === 401) {
               _this.reauth().then(runRequestWithCredentials);
            } else {
                deferred.resolve(data);
            }
        }

        function onErr(err, status, xhr) {
            if (xhr.status === 401) {
                _this.reauth().then(runRequestWithCredentials);
            } else {
                deferred.reject(err.status + ' ' + err.statusText);
            }
        }

    };
};