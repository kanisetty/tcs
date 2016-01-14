angular.module('sessionService', ['appworksService', 'requestService', 'Request'])
    .factory('$sessionService', ['$q', '$appworksService', '$requestService', 'Request',
        function($q, $appworksService, $requestService, Request){
            var _contentServerAPIPath = '/otcsapi';
            var _appName = '';
            var _gatewayURL = '';
            var _defaultLanguage = '';
            var _systemProperties = null;
            var _clientType = 'all';
            var _tempoAppName = "tempo";

            return {

                init: function () {
                    var deferred = $q.defer();
                    var self = this;

                    $appworksService.getDefaultLanguage()
                        .then(function (defaultLanguage) {
                            _defaultLanguage = defaultLanguage;

                            $appworksService.getGatewayURL().then(function (gatewayURL) {
                                _gatewayURL = gatewayURL;

                                self.getProperties().then(function (systemProperties) {
                                    _systemProperties = systemProperties;

                                    deferred.resolve();
                                }).catch(function (error) {
                                    deferred.reject(error);
                                });
                            })
                                .catch(function (error) {
                                    deferred.reject(error);
                                });
                        }).catch(function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },

                canInviteExternalUsers: function () {
                    return _systemProperties.canInvite;
                },

                getAppName: function () {
                    return _appName;
                },

                getClientType: function () {

                    if (_appName === _tempoAppName) {
                        _clientType = _tempoAppName;
                    } else {
                        _clientType = "all";
                    }

                    return _clientType
                },

                getContentServerURL: function () {
                    return _gatewayURL + _contentServerAPIPath;
                },

                getDefaultLanguage: function () {
                    return _defaultLanguage
                },

                getGatewayURL: function () {
                    return _gatewayURL;
                },

                getOTCSTICKET: function () {
                    return $appworksService.getOTCSTICKET();
                },

                getProperties: function(){

                    var requestParams = {
                        method: 'GET',
                        url: this.getGatewayURL() + '/content/v5/properties/',
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    var request = new Request(requestParams);

                    return this.runRequest(request);
                },

                getRootID: function (rootName) {
                    return _systemProperties[rootName];
                },

                getUserID: function(){
                    return _systemProperties.UserID
                },

                getUsername: function () {
                    return _systemProperties.userName;
                },

                isOnline: function () {
                    return navigator.onLine;
                },

                runRequest: function (request) {

                    return $requestService.runRequestWithAuth(request);
                },

                setAppName: function(appName){
                    _appName = appName;
                }
            }
        }]);
