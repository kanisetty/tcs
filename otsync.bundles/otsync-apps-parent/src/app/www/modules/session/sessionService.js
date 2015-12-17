angular.module('sessionService', ['appworksService', 'requestService', 'Request'])
    .factory('$sessionService', ['$q', '$appworksService', '$requestService', 'Request',
        function($q, $appworksService, $requestService, Request){
            var _contentServerAPIPath = '/otcsapi';
            var _appName = '';
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

            return {

                init: function () {
                    var deferred = $q.defer();
                    var currentStrategy = this;

                    $appworksService.getDefaultLanguage()
                        .then(function (defaultLanguage) {
                            _defaultLanguage = defaultLanguage;

                            $appworksService.getGatewayURL(currentStrategy).then(function (gatewayURL) {
                                _gatewayURL = gatewayURL;

                                _initSystemProperties().then(function (systemProperties) {
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

                    if (_appName === "tempo") {
                        _clientType = "tempo";
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

                getRootID: function (rootName) {
                    return _systemProperties[rootName];
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
