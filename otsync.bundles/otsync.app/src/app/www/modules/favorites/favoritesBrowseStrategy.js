angular.module('FavoritesBrowseStrategy', ['nodeBrowseDecoratingService', 'headerService', 'FavoritesHeader', 'NodeBrowseStrategy'])

    .factory('FavoritesBrowseStrategy', ['$q', '$sessionService', '$nodeBrowseDecoratingService', '$nodeService', '$cacheService', '$headerService', '$favoritesService', 'FavoritesHeader',
            'NodeBrowseStrategy',
        function($q, $sessionService, $nodeBrowseDecoratingService, $nodeService, $cacheService, $headerService, $favoritesService, FavoritesHeader, NodeBrowseStrategy) {
            var isOnline;

            var favdefaultHeader = new FavoritesHeader("FAVORITES", true);
            var offlineFavHeader = new FavoritesHeader("OFFLINE FAVORITES", false);

            var FavoritesBrowseStrategy = function(rootName){
                this.rootName = rootName;
            };

            var _initializeHeader = function (favorites) {
                var header = favdefaultHeader;
                var numberOfFilesToSync = 0;
                var filesToSyncSize = 0;

                favorites.forEach(function (favorite) {
                    if ($cacheService.isNodeCachable(favorite) && !favorite.isCached()) {

                        numberOfFilesToSync++;
                        filesToSyncSize += parseInt(favorite.getDataSize());
                    }
                });

                header.setNumberOfFilesToSync(numberOfFilesToSync);
                header.setFilesToSyncSize(filesToSyncSize);

				$headerService.setHeader(header);
            };

            FavoritesBrowseStrategy.prototype = new NodeBrowseStrategy('');

            FavoritesBrowseStrategy.prototype.initialize = function(){};

            FavoritesBrowseStrategy.prototype.canMoreBeLoaded = function(){
                return false;
            };

            FavoritesBrowseStrategy.prototype.getBrowseDecorators = function() {
                var deferred = $q.defer();
                var browseDecorators;

                $favoritesService.getFavorites(isOnline).then(function(favorites) {
                    if (isOnline) {
                        _initializeHeader(favorites);
                    }
                    browseDecorators = $nodeBrowseDecoratingService.decorateNodeChildrenForBrowse(favorites);
                    deferred.resolve(browseDecorators);
                });

                return deferred.promise;
            };


            FavoritesBrowseStrategy.prototype.initializeHeader = function() {
                var header = null;

                if(isOnline)
                    header = favdefaultHeader;
                else
                    header = offlineFavHeader;

                $headerService.setHeader(header);
            };

            FavoritesBrowseStrategy.prototype.getRoot = function() {
                var deferred = $q.defer();

                $q.when($sessionService.isOnline()).then(function(response) {
                    isOnline = response;
                    deferred.resolve({ hideSearch: true, isOnline: isOnline});
                });

                return deferred.promise;
            };

            FavoritesBrowseStrategy.prototype.getRootID = function() {
                return null;
            };


            return FavoritesBrowseStrategy;
    }]);