angular.module('favoritesResource', ['Request', 'cacheService', 'nodeService'])

    .factory('$favoritesResource', ['$sessionService', '$q', 'Request', '$cacheService', '$nodeService', '$urlEncode',
        function ($sessionService, $q, Request, $cacheService, $nodeService, $urlEncode) {

            return {

                addFavorite: function (node) {

                    var requestParams = {
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/favorites/v5/favorites',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        data: $urlEncode({nodeID: node.getID()})
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);

                },

                getFavorites: function () {
                    var deferred = $q.defer();

                    var requestParams = {
                        method: 'GET',
                        url: $sessionService.getGatewayURL() + '/favorites/v5/favorites/',
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    var request = new Request(requestParams);

                    $sessionService.runRequest(request).then(function(response){

                        var favorites = $nodeService.processResponseForNodeChildren(response);
                        $cacheService.addFavoritesToCache(favorites);
                        deferred.resolve(favorites);
                    });

                    return deferred.promise
                },

                removeFavorite: function (node) {

                    var requestParams = {
                        method: 'DELETE',
                        url: $sessionService.getGatewayURL() + '/favorites/v5/favorites/' + node.getID(),
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                }
            };
        }]);
