var blackBerryStrategy = function(){
    this.processQueryParameters = function(query) {
        var result = {};

        var dataToComponentJSON = JSON.parse(decodeURIComponent(query));
		
		alert(JSON.stringify(dataToComponentJSON));
		
        result.nodeID = dataToComponentJSON.appWorksComms.send.data.nodeId;
		
        return result;
    };

    this.runRequest = function(app, requestData){

        requestData.type = 'GET';
        requestData.queryParams = {cstoken:this.getCSToken()};

        return this.runRequestWithAuth(app, requestData, 0);
    };

    this.runRequestWithAuth = function(app, requestData, requestAttemptNumber){
        var deferred = $.Deferred();

        var _this = this;
        var errorReturn = {};

        errorReturn.errMsg = '';

        requestData.success = function(response){

            if (response.ok != undefined && response.ok == false) {
                if (response.auth == false) {

                    app.execRequest("Session", "authenticate").then(function () {
                        requestAttemptNumber += 1;

                        if ( requestAttemptNumber < 2 ){
                            requestData.queryParams.cstoken = _this.getCSToken();
                            _this.runRequestWithAuth(app, requestData, requestAttemptNumber).then(function (response) {
                                deferred.resolve(response);
                            });
                        }else{
                            errorReturn.errMsg = $.t("label.ErrorAuthenticationFailed");
                            deferred.reject(errorReturn);
                        }
                    }, function () {
                        errorReturn.errMsg = $.t("label.ErrorAuthenticationFailed");
                        deferred.reject(errorReturn);
                    });
                } else {
                    deferred.reject(response.errMsg);
                }
            } else{

                deferred.resolve(response);
            }
        };

        requestData.error = function(error){

            if (error.status == 401){

                app.execRequest("Session", "authenticate").then(function () {
                    requestAttemptNumber += 1;

                    if ( requestAttemptNumber < 2 ){
                        requestData.queryParams.cstoken = _this.getCSToken();
                        _this.runRequestWithAuth(app, requestData, requestAttemptNumber).then(function (response) {

                            deferred.resolve(response);
                        });
                    }else{
                        errorReturn.errMsg = $.t("label.ErrorAuthenticationFailed");
                        deferred.reject(errorReturn);
                    }
                }, function () {
                    errorReturn.errMsg = $.t("label.ErrorAuthenticationFailed");
                    deferred.reject(errorReturn);
                });
            }else if(error.status == 0){
                errorReturn.errMsg = $.t("label.ErrorUnableToPerformAction");
                deferred.reject(errorReturn);
            }else{
                errorReturn.errMsg = error.statusText + ' ' + error.status;
                deferred.reject(errorReturn);
            }
        };

        var params = [requestData];

        app.execRequest("Session", "http", params);

        return deferred.promise();
    };

    this.getCSToken = function(){
        return window.otag.auth.cstoken;
    };
};

var nonBlackBerryStrategy = function(){
    this.processQueryParameters = function(query){
        var result = {};
        var pairs = query.split("&"),len = pairs.length,
            idx, pair, key;

        // Iterate through each pair and build the array
        for (idx = 0; idx < len; idx += 1) {
            pair = pairs[idx].split("=");
            key = pair[0];

            switch(typeof result[key]) {
                // Key has not been found, create entry
                case "undefined":
                    result[key] = pair[1];
                    break;
                // Key exists, create an array
                case "string":
                    result[key] = [result[key], pair[1]];
                    break;
                // Add to the array
                default:
                    result[key].push(pair[1]);
            }
        }

        return result;
    };

    this.runRequest = function(app, requestData){
        return $.ajax(requestData).then(
            null,
            function(jqXHR){
                // fail: if it's an auth problem, re-auth and try again
                if(jqXHR.status == 401){
                    return app.execRequest("Session", "authenticate")
                        .then(function(){
                            return $.ajax(requestData);
                        });
                }
            });
    };
};
