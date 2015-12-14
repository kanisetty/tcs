var BlackBerryStrategy = function(){
    var appWorksSenderInfo = {};

    var encodeObject = function(obj) {
        var query = '', innerObj;
        for (var name in obj) {
            var value = obj[name];

            if (value instanceof Array) {
                for (var i = 0; i < value.length; ++i) {
                    var keyName = (name + '[' + i + ']');
                    innerObj = {};
                    innerObj[keyName] = value[i];
                    query += encodeObject(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (var subName in value) {
                    innerObj = {};
                    innerObj[(name + '[' + subName + ']')] = value[subName];
                    query += encodeObject(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    this.processQueryParameters = function(query) {

        try{
            var dataInputToComponentJSON = JSON.parse(decodeURIComponent(query));

            appWorksSenderInfo = dataInputToComponentJSON.appWorksComms;
        }catch(error){

            alert($.t("error.ErrorUnableToPerformAction") + ' ' + error);
        }

        return appWorksSenderInfo;
    };

    this.runRequest = function(app, requestData){

        if( requestData.type == null){
            requestData.type = 'GET';
        }

        if (requestData.data != null){
            requestData.data = encodeObject(requestData.data);
        }

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

                            _this.runRequestWithAuth(app, requestData, requestAttemptNumber).then(function (response) {
                                deferred.resolve(response);
                            });
                        }else{
                            errorReturn.errMsg = $.t("error.Authentication failed");
                            deferred.reject(errorReturn);
                        }
                    }, function () {
                        errorReturn.errMsg = $.t("error.Authentication failed");
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

                        _this.runRequestWithAuth(app, requestData, requestAttemptNumber).then(function (response) {

                            deferred.resolve(response);
                        });
                    }else{
                        errorReturn.errMsg = $.t("error.Authentication failed");
                        deferred.reject(errorReturn);
                    }
                }, function () {
                    errorReturn.errMsg = $.t("error.Authentication failed");
                    deferred.reject(errorReturn);
                });
            }else if(error.status == 0){
                errorReturn.errMsg = $.t("error.Unable to perform action");
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

    this.close = function(){

        var successFn = function (session) {
        };
        var errorFn = function (data) {
            window.history.back();
        };

        cordova.exec(successFn, errorFn, "Application", "closeme", []);
    };

    this.browseObject = function(app, nodeID, title, refreshOnReturn){
        var openData = {};
        var thisAppsName = appWorksSenderInfo.name;

        var destComponentName = 'bb10-ews-app';
        var destMethod = null;

        try {

            openData.nodeID = nodeID;
            openData.title = title;

            var openCompReq = AppWorksComms.getOpenAppRequest(destComponentName, destMethod, openData, refreshOnReturn);
            AppWorksComms.openApp(openCompReq);
        } catch(e) {
            alert($.t("error.Unable to perform action"));
        }
    };

    this.openComponent = function(app, openData, refreshOnReturn){

        try {
            var destComponentName = null;

            if(openData.type == "task") {
                destComponentName = 'tasksview';
            }else if(openData.type == "workflow") {
                destComponentName = 'workflowview';
            }

            var thisAppsName = 'assignments-app';

            var destMethod = 'onCallFromApp';
            openData.action = 'assignment';

            var openCompReq = AppWorksComms.getOpenAppRequest(destComponentName, destMethod, openData, refreshOnReturn);
            AppWorksComms.openApp(openCompReq);
        } catch(e) {
            alert($.t("error.NoViewerIsAvailableForThisTypeOfAssignment"));
        }
    };

    this.openWindow = function(url){
        var jsonRequest = {
            action : "openNewWindow",
            windowUrl : url,
            closeCurrent : true
        };

        AppWorks.blackberryCommunication(JSON.stringify(jsonRequest));
    };
};
