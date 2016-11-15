angular
    .module('ews')
    .service('$fileExportSync', [
        '$appworksService',
        '$fileResource',
        '$http',
        '$sessionService',
        '$q',
        '$displayMessageService',
        '$state',
        'File',
        'Node',
        $fileExportSync
    ]);

function $fileExportSync($appworksService, $fileResource, $http, $sessionService, $q, $dm, $state, File, Node) {
    var _this = this;
    var _filesToSync = 0;
    var _filesSynced = 0;
    var _confirmText = 'Imported files have been synced. Reload to reflect changes?';
    var _confirmTitle = 'Sync Complete';

    this.sync = sync;

    function displayReloadConfirmation() {
        if (_filesSynced === _filesToSync) {
            $dm.createConfirmationPopup(_confirmTitle, _confirmText).then(function () {
                // reload the page to show the display synced files
                $state.go('app.browse');
            });
            _filesSynced = 0;
            _filesToSync = 0;
        }
    }

    function fileToDataUrl(filename) {
        var deferred = $q.defer();

        $appworksService.getSharedDocumentUrl().then(function (path) {
            // append path to filename
            if($appworksService.deviceIsAndroid()) {
              window.resolveLocalFileSystemURL('file://' + path + '/' + filename, gotFileEntryAW, deferred.reject);
              function gotFileEntryAW(fileEntry) {
                  var finder = new Appworks.Finder(function(fileObject) {
                    var data = "data:" + fileObject.mimetype + ";" + fileObject.data;
                    deferred.resolve(data);
                  }, function (error) {
                      deferred.reject;
                  });
                  finder.filePathToData(fileEntry.nativeURL);
              }
            } else {
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
            }

        }, deferred.reject);

        return deferred.promise;
    }

    function getNodeMetadataFromFilename(filename) {
        var parts = filename.match(/^(\d+)_(\d+)/) || [];
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

        // perform file sync only if the device is online. the user can retry later if they are currently offline
        if ($sessionService.isOnline()) {
            finder.list('');
        }

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
                        } else {

                          var metaLastModified = metadata.lastModified;
                          var itemLastModified = item.lastmodified;

                          if(metaLastModified > 1000000000000) {
                            metaLastModified = metaLastModified / 1000;
                          }
                          if(itemLastModified > 1000000000000) {
                            itemLastModified = itemLastModified / 1000;
                          }

                          if (metaLastModified < itemLastModified) {
                            // file has been modified, add as a version on top of previous
                            syncWithPreviousVersion(item.filename);
                          }
                        }
                        _filesToSync += 1;
                    }
                });
            }
        }
    }

    function syncToRoot(filename) {
        // add a new file to the root of the workspace
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
                    // update the total files synced for displaying a reload message later on
                    _filesSynced += 1;
                    // display a message to the user notifying that exported files have been synced.
                    // will not display unless _filesSynced === _filesToSync
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
                // update the total files synced for displaying a reload message later on
                _filesSynced += 1;
                // display a message to the user notifying that exported files have been synced.
                // will not display unless _filesSynced === _filesToSync
                displayReloadConfirmation();
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
