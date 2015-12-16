angular.module('OTAGSessionStrategy', ['requestService', 'appworksService',  'Request'])
    .factory('OTAGSessionStrategy', ['$q', '$requestService', '$appworksService', 'Request', '$http',
        function($q, $requestService, $appworksService, Request, $http) {
            var _contentServerAPIPath = '/otcsapi';

            var OTAGSessionStrategy = function(appName){
                var _appName = appName;
                var _gatewayURL = '';
                var _defaultLanguage = '';
                var _systemProperties = null;
                var _clientType = 'all';

                var _initSystemProperties = function(){
                    var requestParams = {
                        method: 'GET',
                        url: _gatewayURL + '/content/v5/properties'
                    };

                    var request = new Request(requestParams);

                    return $requestService.runRequestWithAuth(request);
                };

                this.init = function(rootName){
                    var deferred = $q.defer();
                    var currentStrategy = this;

                    $http.defaults.headers.common.OTCSTICKET = this.getOTCSTICKET();

                    $appworksService.getDefaultLanguage()
                        .then(function(defaultLanguage){
                            _defaultLanguage = defaultLanguage;

                            $appworksService.getGatewayURL(currentStrategy).then(function(gatewayURL){
                                _gatewayURL = gatewayURL;

                                _initSystemProperties().then(function(systemProperties){
                                    _systemProperties = systemProperties;

                                    deferred.resolve();
                                }).catch(function(error){
                                    deferred.reject(error);
                                });
                            })
                        .catch(function(error){
                            deferred.reject(error);
                        });
                    }).catch(function(error){
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                this.canInviteExternalUsers = function(){
                    return _systemProperties.canInvite;
                };

                this.getAppName = function(){
                    return _appName;
                };

                this.getClientType = function(){

                    if ( _appName === "tempo"){
                        _clientType = "tempo";
                    } else {
                        _clientType = "all";
                    }

                    return _clientType
                };

                this.getContentServerURL = function () {
                    return _gatewayURL + _contentServerAPIPath;
                };

                this.getDefaultLanguage = function() {
                    return _defaultLanguage
                };

                this.getGatewayURL = function() {
                    return _gatewayURL;
                };

                this.getOTCSTICKET = function() {
                    return $appworksService.getOTCSTICKET();
                };

                this.getRootID = function(rootName){
                    return _systemProperties[rootName];
                };

                this.getUsername = function() {
                    return _systemProperties.userName;
                };

                this.isOnline = function() {
                    return navigator.onLine;
                };

                this.runRequest = function(request){

                    return $requestService.runRequestWithAuth(request);
                };
            };

            return OTAGSessionStrategy;
        }]);