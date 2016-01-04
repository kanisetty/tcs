var CordovaRequest = function() {

    var execRequest = function (namespace, func, params) {
        var dfd = $.Deferred();
        var successFn = function (data) {

            dfd.resolve(data);
        };
        var errorFn = function (error) {
            dfd.reject(error);
        };

        cordova.exec(successFn, errorFn, namespace, func, params || []);

        return dfd.promise();
    };

    return {

        getGatewayURL: function() {
            return execRequest("AWAuth", "gateway");
        },
        getDefaultLanguage: function() {
            return execRequest("AWGlobalization", "getPreferredLanguage");
        },
        authenticate: function() {
            return execRequest("AWAuth", "authenticate");
        },
        closeMe: function() {
            return execRequest('AWComponent', 'close');
        }

    }

};

