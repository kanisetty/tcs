angular.module('cacheService', [])

    .factory('$cacheService', function () {

        var _cacheStrategy;

        return {

            addFavorites: function(favorties) {
                return _cacheStrategy.addFavorites(favorties);
            },

            addNode: function (node, fileData) {
                return _cacheStrategy.addNode(node, fileData);
            },

            evictNode: function(request) {
                return _cacheStrategy.evictNode(request);
            },

            getBaseRequest: function(node) {
                return _cacheStrategy.getBaseRequest(node);
            },

            getFavoritesFromCache: function() {
                return _cacheStrategy.getFavoritesFromCache();
            },

            isNodeCachable: function (node) {
                return _cacheStrategy.isNodeCachable(node);
            },

            openNodeFromCache: function (node) {
                return _cacheStrategy.openNodeFromCache(node);
            },

            setIsCached: function (node) {
                return _cacheStrategy.setIsCached(node);
            },

            setStrategy: function (strategy) {
                _cacheStrategy = strategy;
            }
        }
    });