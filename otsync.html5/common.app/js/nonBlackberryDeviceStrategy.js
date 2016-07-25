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

        return this.execRequest("AWAuth", "gateway");
    };

    this.openFromAppworks = function (destComponentName, data, refreshOnReturn, isComponent) {
        var appworksType = "component";

        if (!isComponent)
            appworksType = "app";

        this.execRequest("AWComponent", "open", [destComponentName, $.param(data), appworksType])
            .done(function () {
                if (refreshOnReturn)
                    location.reload();
            })
            .fail(function (error) {
                alert(apputil.T("error.NoViewerIsAvailableForThisTypeOfAssignment"));
            });
    };

    this.openWindow = function (url) {
        window.open(url, '_system', 'location=no');
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
        return this.execRequest('AWAuth', 'authenticate');
    };

    this.authenticate = function () {
        var deferred = $.Deferred();
        var auth = new Appworks.Auth(deferred.resolve, deferred.reject);
        auth.authenticate();
        return deferred.promise();
    };

    this.runRequestWithAuth = function (requestData) {
        var deferred = $.Deferred();

        this.authenticate().then(function (authResponse) {
            $.ajax(requestData, authResponse.authorizationHeader).then(
                function (data) {
                    deferred.resolve(data);
                },
                function (jqXHR) {
                    deferred.reject(jqXHR.status + " " + jqXHR.statusText);
                });
        });

        return deferred.promise();
    };
};