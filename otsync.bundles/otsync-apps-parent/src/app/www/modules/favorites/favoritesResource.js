angular.module('favoritesResource', ['Request', 'cacheService', 'nodeService'])

    .factory('$favoritesResource', ['$sessionService', '$q', 'Request', '$cacheService', '$nodeService',
        function ($sessionService, $q, Request, $cacheService, $nodeService) {

            return {

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
                }
            };
        }]);
