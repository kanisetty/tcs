angular.module('favoritesService', ['nodeService', 'Request', 'fileResource', 'favoritesResource'])

    .factory('$favoritesService', [
        '$q',
        '$sessionService',
        '$nodeService',
        '$cacheService',
        '$fileResource',
        '$favoritesResource',
        $favoritesService
    ]);

function $favoritesService($q, $sessionService, $nodeService, $cacheService, $fileResource, $favoritesResource) {
    return {
        doSync: function () {
            var deferred = $q.defer();
            var self = this;

            $q.when($sessionService.isOnline()).then(function () {
                $favoritesResource.getFavorites()
                    .then(function (favorites) {
                        self.downloadAndCacheFavorites(favorites)
                            .then(function (favorites) {
                                deferred.resolve(favorites);
                            });
                    });
            });

            return deferred.promise;
        },

        downloadAndCacheFavorites: function (favorites) {
            var promises = [];

            favorites.forEach(function (favorite) {
                if ($cacheService.isNodeStorable(favorite) && !favorite.isStored()) {
                    promises.push($fileResource.downloadAndStore(favorite, false));
                }
            });

            return $q.all(promises);
        },

        getFavorites: function(isOnline){
            var deferred = $q.defer();

            if (isOnline) {
                $favoritesResource.getFavorites()
                    .then(function (nodeChildren) {
                        $nodeService.addCacheDataToNodeChildren(nodeChildren)
                            .then(function (favorites) {
                                deferred.resolve(favorites);
                            });
                    });
            } else {
                $cacheService.getFavoritesFromCache().then(function (nodeChildren) {
                    $nodeService.addCacheDataToNodeChildren(nodeChildren).then(function (favorites) {
                        var filteredFavorites = [];
                        favorites.forEach(function (fav) {
                            if ($cacheService.isNodeStorable(fav) && fav.isStored()) {
                                filteredFavorites.push(fav);
                            }
                        });
                        deferred.resolve(filteredFavorites);
                    });
                });
            }
            return deferred.promise;
        }
    }
}
