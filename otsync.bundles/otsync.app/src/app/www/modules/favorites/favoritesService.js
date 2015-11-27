angular.module('favoritesService', ['nodeService', 'Request', 'fileActionService'])

    .factory('$favoritesService', ['$q', '$sessionService', '$nodeService', '$cacheService', '$fileActionService', 'Request',
        function($q, $sessionService, $nodeService, $cacheService, $fileActionService, Request){

            var _getFavoritesFromServer = function () {
                var deferred = $q.defer();

                var requestParams = {
                    method: 'GET',
                    url: $sessionService.getGatewayURL() + '/favorites/v5/favorites/',
                    headers: {'Content-Type': 'application/json; charset=utf-8'}
                };

				var request = new Request(requestParams);

                $sessionService.runRequest(request).then(function(response){

                    var favorites = $nodeService.processResponseForNodeChildren(response);
                    $cacheService.addFavorites(favorites);
                    deferred.resolve(favorites);
                });

                return deferred.promise
            };

            return{

                doSync:  function() {
                    var self = this;
                    var deferred = $q.defer();

                    $q.when($sessionService.isOnline()).then(function(isOnline) {

                        self.getFavorites(isOnline).then(function (favorites) {

                            self.downloadAndCacheFavorites(favorites).then(function(favorites) {
                                deferred.resolve(favorites);
                            })
                        });
                    });

                    return deferred.promise;
                },

                downloadAndCacheFavorites: function (favorites) {
                    var promises = [];

                    favorites.forEach(function (favorite) {
                        if($cacheService.isNodeCachable(favorite) && !favorite.isCached())
                            promises.push($fileActionService.downloadAndCacheAction(favorite, false));
                    });

                    return $q.all(promises);
                },

                getFavorites: function(isOnline){
                    var deferred = $q.defer();

                    if (isOnline) {
                        _getFavoritesFromServer().then(function (nodeChildren) {

                            $nodeService.addCacheDataToNodeChildren(nodeChildren).then(function (favorites) {
                                deferred.resolve(favorites);
                            })
                        });
                    } else {

                        $cacheService.getFavoritesFromCache().then(function (nodeChildren) {

                            $nodeService.addCacheDataToNodeChildren(nodeChildren).then(function (favorites) {

                                var filteredFavorites = [];
                                favorites.forEach(function(fav) {
                                    if($cacheService.isNodeCachable(fav) && fav.isCached())
                                        filteredFavorites.push(fav);

                                });

                                deferred.resolve(filteredFavorites);
                            })
                        });
                    }
                    return deferred.promise;
                }
            }
        }]);
