angular
    .module('cacheService', ['appworksService', 'Node', 'Sharing'])
    .factory('$cacheService', [
        '$q',
        '$appworksService',
        '$displayMessageService',
        'Node',
        'Sharing',
        $cacheService
    ]);

function $cacheService($q, $appworksService, $displayMessageService, Node) {

    var _favoritesKey = "OTSync_Favorites";

    return {

        addFavoritesToCache: function (favorites) {
            var deferred = $q.defer();
            var serialized;

            if (favorites && favorites.length) {
                serialized = favorites.map(function (favorite) {
                    return favorite.toJson();
                });
                $appworksService.addToCache(_favoritesKey, JSON.stringify(serialized), true);
            }

            deferred.resolve();

            return deferred.promise;
        },

        addNodeToStorage: function (node, downloadURL, options, doOpen, openIn) {
            var deferred = $q.defer();
            var self = this;
            var fileName = node.getFileNameForOnDeviceStorage();

            $displayMessageService.showDisplayMessage('LOADING');

            $appworksService.storeFile(downloadURL, fileName, options, openIn)
                .then(function (file) {
                    if (doOpen) {
                        self.openNodeFromStorage(node)
                            .then(function (file) {
                                if (file) {
                                    window.open(file.nativeURL, '_blank', 'EnableViewPortScale=yes,location=no');
                                    deferred.resolve();
                                    $displayMessageService.hideMessage();
                                } else {
                                    deferred.reject();
                                    $displayMessageService.hideMessage();
                                }
                            })
                            .catch(function (error) {
                                deferred.reject(error);
                                $displayMessageService.hideMessage();
                            });
                    } else if (openIn) {
                        if (file) {
                            var finder = new Appworks.Finder(deferred.resolve, deferred.reject);
                            // remove file encoding from open in call
                            finder.openDirect(file.nativeURL);
                            $displayMessageService.hideMessage();
                        } else {
                            deferred.reject();
                            $displayMessageService.hideMessage();
                        }
                    } else {
                        deferred.resolve();
                        $displayMessageService.hideMessage();
                    }
                })
                .catch(function (error) {
                    deferred.reject(error);
                    $displayMessageService.hideMessage();
                });

            return deferred.promise;
        },

        getFavoritesFromCache: function () {
            var deferred = $q.defer();
            var serialized = $appworksService.getFromCache(_favoritesKey);
            var favorites;

            if (serialized) {
                serialized = JSON.parse(serialized);

                favorites = serialized.map(function (json) {
                    return Node.fromJson(json);
                });
            }

            deferred.resolve(favorites);

            return deferred.promise;
        },

        isNodeStorable: function (node) {

            var canStore = false;

            if (node != null && node.getSubtype() != 1 && !node.isContainer())
                canStore = true;

            return canStore;
        },

        isNodeInStorage: function (node) {
            var deferred = $q.defer();
            var storageManager = new Appworks.SecureStorage(fileExistsAtPath, deferred.reject);
            var fileName = node.getFileNameForOnDeviceStorage();
            // replace spaces with four underscores to avoid problems when trying to access in web view
            fileName = fileName.replace(/ +/g, '____');

            storageManager.fileExistsAtPath(fileName);

            return deferred.promise;

            function fileExistsAtPath(doesExist) {
                deferred.resolve(doesExist);
            }
        },

        showImage: function(name, url) {
            var win = window.open('show-image.html', '_blank', 'EnableViewPortScale=yes,location=no');
            win.addEventListener( "loadstop", function() {
                win.executeScript({
                    code: "showImage('" + name + "', '" + url + "')"
                });
            });
        },

        showDoc: function(name, url) {
            window.open(url, '_blank', 'EnableViewPortScale=yes,location=no');
        },

        doOpenIn: function (node) {
            var deferred = $q.defer();
            var fileName = node.getFileNameForOnDeviceStorage();
            $appworksService.getFile(fileName).then(function (file) {
                var finder = new Appworks.Finder(deferred.resolve, deferred.reject);
                // remove file encoding from open in call
                finder.openDirect(file.nativeURL);
            });
            return deferred.promise;
        },

        openNodeFromStorage: function (node) {
            var self = this;
            var deferred = $q.defer();
            var fileName = node.getFileNameForOnDeviceStorage();

            $appworksService.getFile(fileName)
                .then(function (file) {
                    if (file) {
                        // if its an image try to open in the show-image.html page to size the image proportionately
                        if (node.isImageType()) {
                            self.showImage(node.getName(), file.nativeURL);
                        } else {
                            // otherwise its a regular document, try to open in the web view
                            self.showDoc(node.getName(), file.nativeURL);
                            //window.open(file.nativeURL, '_blank', 'EnableViewPortScale=yes,location=no');
                        }
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
}