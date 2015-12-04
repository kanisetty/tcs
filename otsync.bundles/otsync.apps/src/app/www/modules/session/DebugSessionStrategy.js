angular.module('DebugSessionStrategy', [])
    .factory('DebugSessionStrategy', ['$injector', function($injector) {
        var _csToken;
        var $q = $injector.get('$q');
        var $rootScope = $injector.get('$rootScope');
        var $http = $injector.get('$http');
        var $displayMessageService = $injector.get('$displayMessageService');
        var _clientType = 'all';

        var DebugSessionStrategy = function() {

            var authenticate = function(currentStrategy) {
                var deferred = $q.defer();
                var username = appSettings.getUserName();
                var password = appSettings.getPassword();

                var requestData = {
                    method: 'POST',
                    url: currentStrategy.getGatewayURL() + '/gateway/v1/auth',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                    params: {username: username, password: password, type:'mobile'},
                    data: {username: username, password: password, type:'mobile'}
                };

                $http(requestData)
                    .success(function(response){
                        _csToken = response.cstoken;
                        deferred.resolve();
                    })
                    .error(function(errMsg, status){
                        deferred.reject(errMsg, status);
                    });

                return deferred.promise;
            };

            var runRequestWithAuth = function(requestData, requestAttemptNumber, currentStrategy){

                var deferred = $q.defer();

                $http(requestData)
                    .success(function(response){

                        if (response.ok != undefined && response.ok == false) {
                            if (response.auth == false) {

                                authenticate(currentStrategy).then(function () {
                                    requestAttemptNumber += 1;

                                    if ( requestAttemptNumber < 2 ){
                                        requestData.headers.OTCSTICKET = currentStrategy.getCSToken();
                                        runRequestWithAuth(requestData, requestAttemptNumber, currentStrategy).then(function (response) {
                                            deferred.resolve(response);

                                        });
                                    }else{
                                        $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR AUTHENTICATION FAILED')});
                                        deferred.reject(response);
                                    }
                                }, function (errMsg, status) {
                                    $rootScope.$broadcast('serverError', {errMsg: errMsg + ' ' + status});
                                    deferred.reject(response);
                                });
                            } else {
                                $rootScope.$broadcast('serverError', {errMsg: response.errMsg});
                                deferred.reject(response);
                            }
                        } else
                            deferred.resolve(response);

                    })
                    .error(function (errMsg, status) {

                        if (status == 401){
                            authenticate(currentStrategy).then(function () {
                                requestAttemptNumber += 1;

                                if ( requestAttemptNumber < 2 ){
                                    requestData.headers.OTCSTICKET = currentStrategy.getCSToken();
                                    runRequestWithAuth(requestData, requestAttemptNumber, currentStrategy).then(function (response) {
                                        deferred.resolve(response);
                                    });
                                }else{
                                    $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR AUTHENTICATION FAILED')});
                                    deferred.reject(response);
                                }
                            }, function (errMsg, status) {
                                $rootScope.$broadcast('serverError', {errMsg: errMsg + ' ' + status});
                                deferred.reject(response);
                            });
                        }else{
                            $rootScope.$broadcast('serverError', {errMsg: errMsg + ' ' + status});
                            deferred.reject(errMsg);
                        }
                    });


                return deferred.promise
            };

            this.init = function(){};

            this.canInviteExternalUsers = function(){
                return true;
            };

            this.getClientType = function(){
                return _clientType;
            };

            this.getCSToken = function() {
                return _csToken;
            };

            this.getUsername = function() {
                return appSettings.getUserName();
            };

            this.getGatewayURL = function() {
                return appSettings.getGatewayUrl();
            };

            this.getContentServerURL = function() {
                return appSettings.getContentServerURL();
            };

            this.getDefaultLanguage = function() {
                var deferred = $q.defer();

                deferred.resolve(appSettings.getDefaultLanguage());

                return deferred.promise;
            };

            this.isOnline = function() {
                return true;
            };

            this.runRequest = function(requestData){

                return runRequestWithAuth(requestData, 0, this);
            };

            this.setClientType = function(appName){
                _clientType = appName;
            };
        };

        return DebugSessionStrategy;
    }]);
