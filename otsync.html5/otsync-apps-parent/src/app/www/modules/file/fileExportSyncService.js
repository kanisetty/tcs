angular
    .module('ews')
    .service('$fileExportSync', [
        '$appworksService',
        '$fileResource',
        '$http',
        '$sessionService',
        '$q',
        'File',
        'Node',
        $fileExportSync
    ]);

function $fileExportSync($appworksService, $fileResource, $http, $sessionService, $q, File, Node) {
    this.sync = sync;

    function fileToDataUrl(filename) {
        var deferred = $q.defer();

        $appworksService.getSharedDocumentUrl().then(function (path) {
            // append path to filename
            window.resolveLocalFileSystemURL('file://' + path + '/' + filename, gotFileEntry, deferred.reject);

            function gotFileEntry(fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        deferred.resolve(evt.target.result);
                    };
                    reader.readAsDataURL(file);
                });
            }

        }, deferred.reject);

        return deferred.promise;
    }

    function getNodeMetadataFromFilename(filename) {
        var parts = filename.match(/^(\d+)_(\d+)/);
        parts.shift();
        return {
            nodeId: parts[0],
            version: parts[1]
        };
    }

    function getMetadataFromCacheItem(cacheItem, key) {
        var metadata = null;
        if (cacheItem.exported) {
            metadata = cacheItem.exported[key];
        }
        return metadata;
    }

    function getWorkspaceRoot() {
        var deferred = $q.defer();
        $appworksService.authenticate().then(function (authReesponse) {
            var url = authReesponse.authData.gatewayUrl + '/content/v5/properties/';
            $http.get(url, {headers: {'Content-Type': 'application/json; charset=utf8'}}).then(function (res) {
                var appname = $sessionService.getAppName();
                if (appname === 'ews') {
                    deferred.resolve(res.data.enterpriseWorkspaceRoot);
                } else if (appname === 'pws') {
                    deferred.resolve(res.data.personalWorkspaceRoot);
                } else if (appname === 'tempo') {
                    deferred.resolve(res.data.tempoBoxRoot);
                } else {
                    deferred.reject('Unknown app');
                }
            }, deferred.reject);
        });
        return deferred.promise;
    }

    function removeCachedFile(filename) {
        var deferred = $q.defer();

        if (cordova && cordova.file) {
            window.resolveLocalFileSystemURL(cordova.file.documentsDirectory + filename, gotFileEntry, deferred.reject);
        } else {
            deferred.reject('Cordova is not enabled');
        }

        return deferred.promise;

        function gotFileEntry(fileEntry) {
            fileEntry.remove(deferred.resolve, deferred.reject);
        }
    }

    function sync() {
        var finder = new Appworks.Finder(onFileListing);
        var cache = $appworksService.getFromCache('nodeCache');

        if (cache) {
            cache = JSON.parse(cache);
        } else {
            cache = {};
        }

        finder.list('');

        function onFileListing(items) {
            console.log('listing items in shared directory...');
            // iterate over each item and check if it has been modified since the last time it was flagged in our cache
            if (items && items.length) {
                items.forEach(function (item) {
                    // fetch exported file metadata from cache
                    var metadata = getMetadataFromCacheItem(cache, item.filename);
                    console.log('item: ', item);
                    console.log('cached metadata:', metadata);
                    // we only care about syncing top level files
                    if (item.type === 'file') {
                        // we dont have metadata for this file meaning it was exported straight from another app
                        // we will sync this file to the root of the current workspace
                        if (!metadata) {
                            syncToRoot(item.filename);
                        } else if (metadata.lastModified < item.lastmodified) {
                            // file has been modified, add as a version on top of previous
                            syncWithPreviousVersion(item.filename);
                        }
                    }
                });
            }
        }
    }

    function syncToRoot(filename) {
        // add a new file to the root of the workspace
        alert('will add new file to root from exported documents...');

        if ($sessionService.getRootID()) {
            performSync($sessionService.getRootID());
        } else {
            getWorkspaceRoot().then(function (workspaceRoot) {
                performSync(workspaceRoot);
            });
        }

        function performSync(workspaceRoot) {
            fileToDataUrl(filename).then(function (dataUrl) {
                var node = new Node({id: workspaceRoot});
                var file = new File(filename, dataUrl);

                $fileResource.addDocument(node, file).then(function () {
                    // add the newly added document to the cache
                    updateMetadataForFilename(filename, {
                        // use the unix EPOCH date
                        lastModified: ((new Date().getTime())/1000|0)
                    });
                }, function (err) {
                    if (err.status === 401) {
                        $appworksService.authenticate(true).then(function () {
                            syncToRoot(file);
                        });
                    }
                });
            });
        }
    }

    function syncWithPreviousVersion(filename) {
        alert('will add new version from exported documents...');

        fileToDataUrl(filename).then(function (dataUrl) {
            var metadata = getNodeMetadataFromFilename(filename);
            var node = new Node({id: metadata.nodeId, name: filename});
            var file = new File(filename, dataUrl);

            $fileResource.addVersion(node, file).then(function () {
                // update the lastModified date in the cache to reflect the new time
                // use the unix EPOCH date
                updateMetadataForFilename(filename, {lastModified: ((new Date().getTime())/1000|0)});
                // it is likely we already have the old version of this file cached on device..
                // remove it to force a fetch of the latest
                removeCachedFile(filename);
            }, function (err) {
                if (err.status === 401) {
                    $appworksService.authenticate(true).then(function () {
                        syncWithPreviousVersion(file);
                    });
                }
            });
        });
    }

    function updateMetadataForFilename(filename, data) {
        var cache = $appworksService.getFromCache('nodeCache');

        if (cache) {
            cache = JSON.parse(cache);
        } else {
            cache = {exported: {}};
        }

        cache.exported[filename] = data;

        $appworksService.addToCache('nodeCache', JSON.stringify(cache), false);
    }
}