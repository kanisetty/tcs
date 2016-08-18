angular
    .module('favoritesResource', ['Request', 'cacheService', 'nodeService'])
    .factory('$favoritesResource', [
        '$sessionService',
        '$q',
        'Request',
        '$cacheService',
        '$nodeService',
        '$urlEncode',
        '$fileResource',
        $favoritesResource
    ]);

function $favoritesResource($sessionService, $q, Request, $cacheService, $nodeService, $urlEncode, $fileResource) {

    return {

        addFavorite: function (node) {
            var request = new Request({
                method: 'POST',
                url: $sessionService.getGatewayURL() + '/favorites/v5/favorites',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $urlEncode({nodeID: node.getID()})
            });
            // make a request to add the item to favorites,
            // then download the item to the device for offline access only if it is openable in the inappbrowser
            return $sessionService.runRequest(request).then(function () {
                if (node.isImageType()) {
                    $fileResource.downloadAndStore(node, false);
                }
            });

        },

        getFavorites: function () {
            var deferred = $q.defer();
            var request = new Request({
                method: 'GET',
                url: $sessionService.getGatewayURL() + '/favorites/v5/favorites/',
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });
            var favorites;

            $sessionService.runRequest(request).then(function (response) {
                favorites = $nodeService.processResponseForNodeChildren(response);
                $cacheService.addFavoritesToCache(favorites);
                deferred.resolve(favorites);
            });

            return deferred.promise
        },

        removeFavorite: function (node) {

            var request = new Request({
                method: 'DELETE',
                url: $sessionService.getGatewayURL() + '/favorites/v5/favorites/' + node.getID(),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            });

            return $sessionService.runRequest(request);
        }
    };
}
