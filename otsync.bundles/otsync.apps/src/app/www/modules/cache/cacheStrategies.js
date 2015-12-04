angular.module('cacheStrategies', [])

    .factory('$appworksCacheStrategy', ['$q', '$rootScope', '$displayMessageService', function ($q, $rootScope, $displayMessageService) {

        var appNamespace = "ECMEverywhere";
        var favoritesDataType = 'favorites';
        var favoritesCacheID = 'offlineFavorites';

        return {

            addFavorites: function (favorites) {
                var deferred = $q.defer();

                try {

                    var request = AppWorksStorage.getStorageRequest(favoritesDataType, appNamespace, favoritesCacheID, favorites);
                    AppWorksStorage.put(request, function(response) {
                        if(response != null && response.success) {
                            deferred.resolve(response.success);
                        }
                        else {
                            deferred.reject(response);
                        }
                    });
                }
                catch(error) {
                    deferred.reject(error);
                }
                return deferred.promise;
            },

            addNode: function (node, fileData) {
                var deferred = $q.defer();
                var self = this;

                try {
                    if (!self.isNodeCachable(node)) {
                        var response = {itemWasCached: false};
                        deferred.resolve(response);
                    }
                    else {
                        AppWorksCache.addItemToCache(self.getBaseRequest(node), fileData, function (response) {

                            if (response != null && response.itemWasCached) {
                                deferred.resolve(response);
                            }
                            else if (response != null)
                                $rootScope.$broadcast('serverError', {errMsg: response.err});

                        });
                    }
                }
                catch(error) {
                    $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
                }
                return deferred.promise;

            },

            evictNode: function (request) {
                var deferred = $q.defer();
                try{
                    AppWorksCache.evictItemFromCache(request, function(data) {
                        deferred.resolve(data);
                    });
                }
                catch(error) {
                    deferred.reject(data);
                }
                return deferred.promise;
            },

            getBaseRequest: function (node) {

                var request;

                try{
                     var cacheID = node.getID() + node.getName();
                     request = AppWorksCache.getBaseCacheRequest(cacheID, appNamespace, node.getVersionNumber());

                     if(node.isFavorite()) {
                        var expires = new Date();
                        //set expires to 10 years from now
                        expires.setDate(expires.getDate() + (10 * 365));
                        request.expires = expires.getTime();
                     }

                }
                catch(error) {

                }
                return request;
            },

            getFavoritesFromCache: function () {
                var deferred = $q.defer();

                try {
                    AppWorksStorage.getItemFromStore(appNamespace, favoritesDataType, favoritesCacheID, function (response) {
                        if (response != null && response.data != null) {
                            deferred.resolve(response.data.data);
                        }
                        else {
                            deferred.reject(response.err);
                        }
                    });
                }
                catch(error) {
                    deferred.reject(error);
                }
                return deferred.promise;
            },

            isNodeCachable: function (node) {
                var canCache = false;
                if(node != null && node.getSubtype() != 1 && !node.isContainer())
                    canCache = true;
                return canCache;
            },

            openNodeFromCache: function (node) {
                var deferred = $q.defer();
                var self = this;
                var openOnReturn = true;

                try {
                    if (!self.isNodeCachable(node)) {
                        var response = {itemWasCached: false};
                        deferred.resolve(response);
                    }

                    AppWorksCache.getCacheItem(self.getBaseRequest(node), openOnReturn, function (response) {
                        if (response != null && response.cacheItem != null) {
                            deferred.resolve(response);
                        }
                        else {
                            $rootScope.$broadcast('serverError', {errMsg: response.err});
                        }
                    });
                }
                catch(error) {
                    $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
                }
                return deferred.promise;
            },

            setIsCached: function (node) {
                var deferred = $q.defer();
                var self = this;

                try {
                    if (!self.isNodeCachable(node)) {
                        node.setIsCached(false);
                        deferred.resolve(node);
                    } else {
                        AppWorksCache.isItemInCache(self.getBaseRequest(node), function (response) {
                            if (response != null && response.itemIsInCache != null) {

                                node.setIsCached(response.itemIsInCache);

                                deferred.resolve(node);
                            }
                            else if (data != null)
                                $rootScope.$broadcast('serverError', {errMsg: response.err});
                        });
                    }
                } catch(error) {
                    node.setIsCached(false);
                    deferred.resolve(node);
                }

                return deferred.promise;
            }
        }
    }])

    .factory('$debugCacheStrategy', function () {

        return {
            getBaseRequest: function (node) {

                return "";
            },
            addNode: function (node, fileData) {
                return true;
            },
            openNodeFromCache: function (node) {
                return false;
            },

            setIsCached: function (node) {

                node.setIsCached(false);
                return node;
            },
            isNodeCachable: function(node) {
                return false;
            },
            evictNode: function (request) {
                return false;
            }
        }
    });