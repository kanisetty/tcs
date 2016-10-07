angular
    .module('appworksService', [])
    .factory('$appworksService', [
        '$q',
        '$httpParamSerializerJQLike',
        '$displayMessageService',
        $appworksService
    ]);

function $appworksService($q, $httpParamSerializerJQLike, $displayMessageService) {

    var appworksService = {

        addToCache: function addToCache(key, value, usePersistentStorage) {
            var cache = new Appworks.AWCache({
                usePersistentStorage: usePersistentStorage
            });

            cache.setItem(key, value);
        },

        authenticate: function authenticate(force) {
            var deferred = $q.defer();
            var auth = new Appworks.Auth(deferred.resolve, deferred.reject);
            auth.authenticate(force);
            return deferred.promise;
        },

        execCordovaRequest: function execCordovaRequest(namespace, func, params) {
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

        getCameraOptions: function getCameraOptions() {
            return {
                destinationType: Camera.DestinationType.DATA_URL
            };
        },

        getComponentList: function getComponentList() {
            var args = ["component"];
            return this.execCordovaRequest('AWComponent', 'list', args);
        },

        getDefaultLanguage: function getDefaultLanguage() {
            var deferred = $q.defer();
            var _defaultLanguage = 'en';

            this.execCordovaRequest("AWGlobalization", "getPreferredLanguage").then(
                function (lang) {
                    if (lang != null && lang.value != null && lang.value != '')
                        deferred.resolve(lang.value);
                    else
                        deferred.resolve(_defaultLanguage);
                }
            ).catch(
                function () {
                    deferred.resolve(_defaultLanguage);
                }
            );

            return deferred.promise;
        },

        getFile: function getFile(fileName) {
            var deferred = $q.defer();

            var storage = new Appworks.SecureStorage(success, failure);

            // replace spaces with four underscores to avoid problems when trying to access in web view
            fileName = fileName.replace(/ +/g, '____');
            storage.retrieve(fileName);

            return deferred.promise;

            function success(file) {
                deferred.resolve(file);
            }

            function failure(error) {
                var errorMsg;
                if (typeof error === 'object' && error.body) {
                    errorMsg = JSON.parse(error.body);
                    errorMsg = errorMsg.error || errorMsg;
                    $displayMessageService.showErrorMessage(errorMsg);
                }
                deferred.reject(error);
            }
        },

        getFromCache: function getFromCache(key) {
            var cache = new Appworks.AWCache();
            return cache.getItem(key);
        },

        getGatewayURL: function getGatewayURL() {
            var deferred = $q.defer();

            this.execCordovaRequest("AWAuth", "gateway").then(
                function (gatewayURL) {
                    deferred.resolve(gatewayURL);
                }
            ).catch(
                function (error) {
                    deferred.reject(error);
                }
            );

            return deferred.promise;
        },

        getSharedDocumentUrl: function getSharedDocumentUrl() {
            var deferred = $q.defer();
            this.authenticate().then(function (authResponse) {
                deferred.resolve(authResponse.authData.sharedDocumentUrl);
            }, deferred.reject);
            return deferred.promise;
        },

        getOTCSTICKET: function getOTCSTICKET() {
            var deferred = $q.defer();

            this.execCordovaRequest("AWAuth", "authenticate")
                .then(function (authResponse) {
                    if (authResponse != null &&
                        authResponse.addtl &&
                        authResponse.addtl['otsync-connector'] &&
                        authResponse.addtl['otsync-connector'].otcsticket) {

                        deferred.resolve(authResponse.addtl['otsync-connector'].otcsticket);

                    } else
                        deferred.resolve('');
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        },

        isNodeInStorage: function isNodeInStorage(node, key) {
            var isNodeInCache = false;
            var favorites = this.getFromCache(key);

            if (favorites) {
                favorites = JSON.parse(favorites);
            }

            if (favorites instanceof Array) {
                favorites.forEach(function (favorite) {
                    if (favorite.id === node.getID() && favorite.versionNum === node.getVersionNumber()) {
                        isNodeInCache = true;
                    }
                });
            }
            return isNodeInCache;
        },

        closeCurrentComponent: function closeCurrentComponent() {
            this.execCordovaRequest('AWComponent', 'close');
        },

        openFromAppworks: function openFromAppworks(componentName, data, isComponent) {
            var appworksType = "component";

            if (!isComponent) {
                appworksType = "app";
            }

            return this.execCordovaRequest("AWComponent", "open", [
                componentName,
                $httpParamSerializerJQLike(data),
                appworksType
            ]);
        },

        storeFile: function storeFile(downloadURL, fileName, options, share) {
            var deferred = $q.defer();
            var storage = new Appworks.SecureStorage(success, failure);
            var sharedStorage = new Appworks.AWFileTransfer(success, failure);

            if (share) {
                storeShared();
            } else {
                store();
            }

            function success(file) {
                deferred.resolve(file);
            }

            function failure(error) {
                var errorMsg;
                if (typeof error === 'object' && error.body) {
                    errorMsg = JSON.parse(error.body);
                    errorMsg = errorMsg.error || errorMsg;
                    $displayMessageService.showErrorMessage(errorMsg);
                }
                deferred.reject(error);
            }

            function storeShared() {
                // keep a record of when items were added to shared storage
                var nodeCache = appworksService.getFromCache('nodeCache');
                // replace spaces with four underscores to avoid problems when trying to access in web view
                fileName = fileName.replace(/ +/g, '____');
                sharedStorage.download(downloadURL, fileName, null, true);

                if (nodeCache) {
                    nodeCache = JSON.parse(nodeCache);
                } else {
                    nodeCache = {};
                }

                /**
                 * when we export a file to the shared document area we set a timestamp
                 * 1. if the document gets used by another application and exported back into the shared
                 * area, then the lastmodified field will differ from what is stored in our private cache
                 * 2. if we detect a change (i.e. file.lastmodified !== cache.lastModified) then we
                 * upload the document to content server as a version
                 * 3. if no changes are detected then we dont do anything
                 */
                nodeCache.exported = nodeCache.exported || {};
                // use the unix EPOCH date
                nodeCache.exported[fileName] = {lastModified: ((new Date().getTime())/1000|0)};

                appworksService.addToCache('nodeCache', JSON.stringify(nodeCache));

            }

            function store() {
                // replace spaces with four underscores to avoid problems when trying to access in web view
                fileName = fileName.replace(/ +/g, '____');
                storage.store(downloadURL, fileName);
            }

            return deferred.promise;
        },

        deviceIsIos: function deviceIsIos() {
            var device = new Appworks.AWDevice();
            return device.platform === 'iOS';
        },

        deviceIsAndroid: function deviceIsAndroid() {
            var device = new Appworks.AWDevice();
            return device.platform === 'Android';
        }
    };

    return appworksService;
}
