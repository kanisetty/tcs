angular.module('cacheService', ['appworksService'])
    .factory('$cacheService', ['$q', '$appworksService', function ($q, $appworksService) {

        var _favoritesKey = "OTSync_Favorites";

        return {

            addFavoritesToCache: function (favorites) {
                var deferred = $q.defer();

                $appworksService.addToCache(_favoritesKey, favorites, true);

                deferred.resolve();

                return deferred.promise;
            },

            addNodeToStorage: function (node, downloadURL, options, doOpen, openIn) {
                var deferred = $q.defer();
                var self = this;
                var fileName = node.getID() + "_" + node.getVersionNumber() + "_" + node.getName();

                $appworksService.storeFile(downloadURL, fileName, options)
                    .then(function (file) {
                        if (doOpen) {
                            self.openNodeFromStorage(node)
                                .then(function (file) {
                                    if (file) {
                                        window.open(encodeURI(file.nativeURL), '_blank', 'EnableViewPortScale=yes,location=no');
                                        deferred.resolve();
                                    } else {
                                        deferred.reject();
                                    }
                                })
                                .catch(function (error) {
                                    deferred.reject(error);
                                });
                        } else if (openIn) {
                            if (file) {
                                var finder = new Appworks.Finder(deferred.resolve, deferred.reject);
                                finder.openDirect(encodeURI(file.nativeURL));
                            } else {
                                deferred.reject();
                            }
                        } else {
                            deferred.resolve();
                        }
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            getFavoritesFromCache: function () {
                var deferred = $q.defer();

                $appworksService.getFromCache(_favoritesKey);

                deferred.resolve();

                return deferred.promise;
            },

            isNodeStorable: function (node) {

                var canStore = false;

                if (node != null && node.getSubtype() != 1 && !node.isContainer())
                    canStore = true;

                return canStore;
            },

            openNodeFromStorage: function (node) {
                var deferred = $q.defer();

                var fileName = node.getID() + "_" + node.getVersionNumber() + "_" + node.getName();

                $appworksService.getFile(fileName)
                    .then(function (file) {
                        if (file) {
                            window.open(encodeURI(file.nativeURL), '_blank', 'EnableViewPortScale=yes,location=no');
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            setIsStored: function (node) {
                var deferred = $q.defer();
                var self = this;

                try {
                    if (!self.isNodeStorable(node)) {
                        node.setIsStored(false);
                        deferred.resolve(node);
                    } else {
                        node.setIsStored($appworksService.isNodeInStorage(node, _favoritesKey));

                        deferred.resolve(node);
                    }
                } catch (error) {
                    node.setIsStored(false);
                    deferred.resolve(node);
                }

                return deferred.promise;
            }
        }
    }]);