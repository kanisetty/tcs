angular.module('appworksService', [])

    .factory('$appworksService', ['$q', function($q){
        return {

            authenticate: function(){

                return this.execCordovaRequest('AWAuth', 'authenticate');
            },

            execCordovaRequest: function (namespace, func, params) {
                var deferred = $q.defer();

                var successFn = function(data) {
                    deferred.resolve(data)
                };
                var errorFn = function (error) {
                    deferred.reject(error);
                };

                cordova.exec(successFn, errorFn, namespace, func, params || []);

                return deferred.promise;
            },

            getGatewayURL: function(){
                var deferred = $q.defer();

                this.execCordovaRequest("AWAuth", "gateway")
                    .then(function(gatewayURL){
                        deferred.resolve(gatewayURL);
                    })
                    .catch(function(error){
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            getOTCSTICKET: function() {
                var otcsticket = '';

                var authObject = Appworks.Auth();

                if (authObject != null && authObject.addtl && authObject.addtl.otsync-connector && authObject.addtl.otsync-connector.otcsticket) {
                    otcsticket = authObject.addtl.otsync-connector.otcsticket;
                }

                return otcsticket;
            },

            getDefaultLanguage: function(){
                var deferred = $q.defer();
                var _defaultLanguage = 'en';

                this.execCordovaRequest("AWGlobalization", "getPreferredLanguage")
                    .then(function(lang){
                        if ( lang != null && lang.value != null && lang.value != '')
                            deferred.resolve(lang.value);
                        else
                            deferred.resolve(_defaultLanguage);
                    })
                    .catch(function(){
                        deferred.resolve(_defaultLanguage);
                    });

                return deferred.promise;
            }
        }
    }]);
