angular.module('appworksService', [])

    .factory('$appworksService', ['$q', '$httpParamSerializerJQLike', function ($q, $httpParamSerializerJQLike) {

        return {

            addToCache: function (key, value, usePersistentStorage) {

                var options = {
                    usePersistentStorage: usePersistentStorage
                };

                var cache = new Appworks.AWCache(options);

                cache.setItem(key, value);
            },

            authenticate: function (force) {
                var deferred = $q.defer();
                var auth = new Appworks.Auth(deferred.resolve, deferred.reject);
                auth.authenticate(force);
                return deferred.promise;
            },

            execCordovaRequest: function (namespace, func, params) {
                var deferred = $q.defer();

                var successFn = function (data) {
                    deferred.resolve(data)
                };
                var errorFn = function (error) {
                    deferred.reject(error);
                };

                cordova.exec(successFn, errorFn, namespace, func, params || []);

                return deferred.promise;
            },

            getCameraOptions: function () {
                var options = {
                    destinationType: Camera.DestinationType.DATA_URL
                };

                return options;
            },

            getComponentList: function () {
                var args = ["component"];
                return this.execCordovaRequest('AWComponent', 'list', args);
            },

            getDefaultLanguage: function () {
                var deferred = $q.defer();
                var _defaultLanguage = 'en';

                this.execCordovaRequest("AWGlobalization", "getPreferredLanguage")
                    .then(function (lang) {
                        if (lang != null && lang.value != null && lang.value != '')
                            deferred.resolve(lang.value);
                        else
                            deferred.resolve(_defaultLanguage);
                    })
                    .catch(function () {
                        deferred.resolve(_defaultLanguage);
                    });

                return deferred.promise;
            },

            getFile: function (fileName) {
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

            getFromCache: function (key) {

                var cache = new Appworks.AWCache();

                cache.getItem(key);
            },

            getGatewayURL: function () {
                var deferred = $q.defer();

                this.execCordovaRequest("AWAuth", "gateway")
                    .then(function (gatewayURL) {
                        deferred.resolve(gatewayURL);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            getOTCSTICKET: function () {
                var deferred = $q.defer();

                this.execCordovaRequest("AWAuth", "authenticate")
                    .then(function (authResponse) {
                        if (authResponse != null && authResponse.addtl && authResponse.addtl.otsync - connector && authResponse.addtl.otsync - connector.otcsticket) {
                            deferred.resolve(authResponse.addtl.otsync - connector.otcsticket);
                        } else
                            deferred.resolve('');
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            isNodeInStorage: function (node, key) {
                var isNodeInCache = false;
                var favorites = this.getFromCache(key);

                if (favorites instanceof Array) {
                    favorites.forEach(function (favorite) {
                        if (favorite.getID() == node.getID() && favorite.getVersionNumber() == node.getVersionNumber()) {
                            isNodeInCache = true;
                        }
                    });
                }
            },

            openFromAppworks: function (componentName, data, isComponent) {
                var appworksType = "component";

                if (!isComponent)
                    appworksType = "app";

                return this.execCordovaRequest("AWComponent", "open", [componentName, $httpParamSerializerJQLike(data), appworksType]);
            },

            storeFile: function (downloadURL, fileName) {
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
