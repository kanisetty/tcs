var NonBlackBerryStrategy = function(){
    var _defaultLanguage = 'en';

    this.reauth = function(){
        var deferred = $.Deferred();

        // TODO: get reauth working. There is currently no way to reauth using the new appworks.js file.
        deferred.reject("UnAuthorized");
        /*appworks.auth.authenticate().then(function(data){
         resolve(data);
         });*/


        return deferred.promise();
    };

    this.browseObject = function(nodeID, title){
        var openData = [nodeID, title];

        this.execRequest("Content", "browseObject", openData);
    };

    this.close = function(){
        var successFn = function (session) {
        };
        var errorFn = function (data) {
            window.history.back();
        };

        cordova.exec(successFn, errorFn, "Application", "closeme", []);
    };


    this.execRequest = function (namespace, func, params) {
        var dfd = $.Deferred();
        var _this = this;
        var successFn = function () {
            // Convert the arguments into an array and resolve
            var args = Array.prototype.slice.call(arguments);
            alert("success");
            dfd.resolveWith(_this, args);
        };
        var errorFn = function () {
            // Convert the arguments into an array and reject
            var args = Array.prototype.slice.call(arguments);
            alert("failure");
            dfd.rejectWith(_this, args);
        };

        cordova.exec(successFn, errorFn, namespace, func, params || []);

        return dfd.promise();
    };

    this.getClientOS = function(){
        return window.clientInformation.platform;
    };

    this.getDefaultLanguage = function(){
        var deferred = $.Deferred();

        //TODO need to change this back when I get an answer from appworks on how to get the language
        /*window.appworks.globalization.getPreferredLanguage(function(lang) {
         deferred.resolve(lang.value);
         }, function() {
         deferred.resolve(_defaultLanguage);
         });*/
        deferred.resolve('en');
        return deferred.promise();
    };

    this.getGatewayURL = function(){

        //TODO need to change this back when I get a new client that you can log into
        //return window.gatewayUrl;
        return "http://10.2.28.232:8080";
    };

    this.openComponent = function(data, refreshOnReturn){

        var destComponentName = null;

        if(data.type == "task") {
            destComponentName = 'tasks-component';
        }else if(data.type == "workflow") {
            destComponentName = 'workflow-component';
        }

        this.execRequest("AWComponent", "open", [destComponentName, $.param(data)])
            .done(function(){
                if (refreshOnReturn)
                    location.reload();
            })
            .fail(function(error) {
                alert(apputil.T("error.NoViewerIsAvailableForThisTypeOfAssignment"));
            });
    };

    this.openWindow = function(url){
        window.open(url, '_system', 'location=no');
    };

    this.processQueryParameters = function(query){
        var params = {};

        if ( typeof(query) === 'string'){
            var pairs = query.split("&");
            var len = pairs.length;
            var idx, pair, key;

            // Iterate through each pair and build the array
            for (idx = 0; idx < len; idx += 1) {
                pair = pairs[idx].split("=");
                key = pair[0];

                switch(typeof params[key]) {
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

    this.runRequestWithAuth = function(requestData){
        var _this = this;
        var deferred = $.Deferred();

        $.ajax(requestData).then(
            function(data){
                deferred.resolve(data);
            },
            function(jqXHR){
                // fail: if it's an auth problem, re-auth and try again
                if(jqXHR.status == 401){
                    _this.reauth().then(
                        function(){
                            $.ajax(requestData).then(
                                function(data){
                                    deferred.resolve(data);
                                },
                                function(error){
                                    deferred.reject(error);
                                });
                        },
                        function(error){
                            deferred.reject(error);
                        });
                }else{
                    deferred.reject(jqXHR.status + " " + jqXHR.statusText);
                }
            });

        return deferred.promise();
    };
};