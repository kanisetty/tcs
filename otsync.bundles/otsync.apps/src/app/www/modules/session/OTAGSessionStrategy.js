angular.module('OTAGSessionStrategy', ['requestService', 'tokenService',  'Request'])
    .factory('OTAGSessionStrategy', ['$q', '$requestService', '$tokenService', 'Request', '$http',
        function($q, $requestService, $tokenService, Request, $http) {
            var _defaultLanguage = 'en';
            var _csURL = '';
            var _canInviteExternalUsers = false;
            var _clientType = 'all';
            var _appName = '';
            var _contentServerAPIPath = '/otcsapi';


            var OTAGSessionStrategy = function(appName){
                _appName = appName;

                var _initDefaultLanguage = function(){
                    var deferred = $q.defer();

                   window.appworks.globalization.getPreferredLanguage(function(lang) {
                       deferred.resolve(lang.value);
                   }, function() {
                       deferred.resolve(_defaultLanguage);
                   });

                    return deferred.promise;
                };

                var _initSystemProperties = function(currentStrategy){
                    var requestParams = {
                        method: 'GET',
                        url: currentStrategy.getGatewayURL() + '/content/v5/properties'
                    };

                    var request = new Request(requestParams);

                    return $requestService.runRequestWithAuth(request);
                };

                this.init = function(){
                    var deferred = $q.defer();
                    var currentStrategy = this;

                    $http.defaults.headers.common.OTCSTICKET = this.getOTCSTICKET();

                    _initDefaultLanguage().then(function(defaultLanguage){
                        _defaultLanguage = defaultLanguage;

                        _initSystemProperties(currentStrategy).then(function(systemProperties){
                            _canInviteExternalUsers = systemProperties.canInvite;
                            deferred.resolve();
                        }).catch(function(error){
                            deferred.reject(error);
                        });
                    }).catch(function(error){
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                this.canInviteExternalUsers = function(){
                    return _canInviteExternalUsers;
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
                    return this.getGatewayURL() + _contentServerAPIPath;
                };

                this.getOTCSTICKET = function() {
                    return $tokenService.getOTCSTICKET();
                };

                this.getDefaultLanguage = function() {
                    return _defaultLanguage
                };

                this.getGatewayURL = function() {
                    return window.gatewayUrl;
                };

                this.getUsername = function() {
                    return window.appworks.auth.getAuth().authResponse.addtl.contentServerConnector.csUsername;
                };

                this.isOnline = function() {
                    return window.appworks.network.online;
                };

                this.runRequest = function(request){

                    return $requestService.runRequestWithAuth(request);
                };
            };

            return OTAGSessionStrategy;
        }]);