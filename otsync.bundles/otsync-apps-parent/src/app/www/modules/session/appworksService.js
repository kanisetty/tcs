angular.module('appworksService', [])

    .factory('$appworksService', ['$q', function($q){
        return {

            addToCache: function(key, value, usePersistentStorage){

                var options = {
                    usePersistentStorage: usePersistentStorage
                };

                var cache = new Appworks.AWCache(options);

                cache.setItem(key, value);
            },

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
            },

            getFile: function(fileName){
                var deferred = $q.defer();

                var storage = new Appworks.SecureStorage(success, failure);

                function success(file) {
                    deferred.resolve(file);
                }

                function failure(error) {
                    deferred.reject(error);
                }

                storage.retrieve(fileName);

                return deferred.promise;
            },

            getFromCache: function(key){

                var cache = new Appworks.AWCache();

                cache.getItem(key);
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

            isNodeInCache: function(node, key){
                var isNodeInCache = false;
                var favorites = this.getFromCache(key);

                favorites.forEach(function (favorite) {
                    if(favorite.getID() == node.getID() && favorite.getVersionNumber() == node.getVersionNumber()) {
                        isNodeInCache = true;
                    }
                });
            },

            storeFile: function(downloadURL, fileName){
                var deferred = $q.defer();
                var storage = new Appworks.SecureStorage(success, failure);

                function success(file) {
                    deferred.resolve(file);
                }

                function failure(error) {
                    deferred.reject(error);
                }

                storage.store(downloadURL, fileName);

                return deferred.promise;
            }
        }
    }]);
