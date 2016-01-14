angular.module('feedResource', ['urlEncodingService', 'Feed', 'FeedItem', 'FeedProvider', 'Request'])

    .factory('$feedResource', ['$sessionService', '$urlEncode', 'Feed', 'FeedItem', 'FeedProvider', '$displayMessageService', 'Request',
        function($sessionService, $urlEncode, Feed, FeedItem, FeedProvider, $displayMessageService, Request){

            var _processLikesResponseForFeed = function(response){
                var feedItems = [];

                var usersData = response.users;

                if ( usersData != null ) {
                    usersData.forEach(function(userData){

                        feedItems.push(new FeedItem(userData));
                    });
                }

                var feed = new Feed(response, feedItems);

                return feed;
            };

            var _processResponseForFeed = function(response){
                var feedItems = [];
                var feedItemsData = response.items;

                if ( feedItemsData != null ){
                    feedItemsData.forEach(function(feedItemData){
                        feedItems.push(new FeedItem(feedItemData));
                    });
                }

                var feed = new Feed(response, feedItems);

                return feed;
            };

            var _processResponseForFeedProviders = function(response){
                var feedProviders = [];
                var feedProvidersData = response;

                feedProviders.push(new FeedProvider({localizedName:$displayMessageService.translate('ALL'), name: ''}));

                if ( feedProvidersData != null ){
                    feedProvidersData.forEach(function(feedProviderData){
                        feedProviders.push(new FeedProvider(feedProviderData));
                    });
                }

                return feedProviders;
            };

            return {

                addFeedStatus: function(feedStatus){

                    var requestParams = {
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/feeds',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        data: $urlEncode({status: feedStatus})
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                },

                addFeedStatusWithAttachment: function(file, feedStatus){

                    var formData = new FormData();

                    formData.append('status', feedStatus);
                    formData.append('file', file.getFileBlob(), file.getName());

                    var requestParams = {
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/feeds',
                        data: formData,
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                },

                addToFeedForNode: function(feedMessage, providerType, nodeID){

                    var requestParams = {
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/nodes/' + providerType + "/" + nodeID,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        data: $urlEncode({status: feedMessage})
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                },

                addToFeedForNodeWithAttachment: function(file, feedMessage, providerType, nodeID){

                    var formData = new FormData();

                    formData.append('status', feedMessage);
                    formData.append('file', file.getFileBlob(), file.getName());

                    var requestParams = {
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/nodes/' + providerType + "/" + nodeID,
                        data: formData,
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                },

                addToFeedProvider: function(feedMessage, providerType, sequenceNumber){

                    var requestParams = {
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/feeds/' + providerType + "/" + sequenceNumber,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        data: $urlEncode({status: feedMessage})
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                },

                addToFeedProviderWithAttachment: function(file, feedMessage, providerType, sequenceNumber){

                    var formData = new FormData();

                    formData.append('status', feedMessage);
                    formData.append('file', file.getFileBlob(), file.getName());

                    var requestParams = {
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/feeds/' + providerType + "/" + sequenceNumber,
                        data: formData,
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);

                },

                doFollow: function(userName){

                    var requestParams = {
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/users/' + userName + '/followers',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                },

                doUnfollow: function(userName){

                    var requestParams = {
                        method: 'DELETE',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/users/' + userName + '/followers',
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                },

                doLike: function(feedProviderType, sequenceNumber){

                    var requestParams = {
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/feeds/' + feedProviderType +'/' + sequenceNumber + '/likes',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                },

                doUnlike: function(feedProviderType, sequenceNumber){

                    var requestParams = {
                        method: 'DELETE',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/feeds/' + feedProviderType +'/' + sequenceNumber + '/likes',
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request);
                },

                getFeed: function(feedProviderType, query, currentFeed){
                    var url = $sessionService.getGatewayURL() + '/feeds/v5/feeds';

                    if ( feedProviderType != null ){
                        url = url + '/' + feedProviderType;
                    }

                    var requestParams = {
                        method: 'GET',
                        url: url,
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    if ( query != null && query.length > 0 ){
                        if(requestParams.params == undefined)
                            requestParams.params = {};

                        requestParams.params.query = query;
                    }

                    if (currentFeed != null){
                        if(requestParams.params == undefined)
                            requestParams.params = {};

                        requestParams.params.before = JSON.stringify(currentFeed.getOldestFeedItemSeqNum());
                    }

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request).then(_processResponseForFeed);
                },

                getFeedFromConversation: function(feedProviderType, feedConversationID){
                    var requestParams = {
                        method: 'GET',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/conversations/' + feedProviderType + '/' + feedConversationID,
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request).then(_processResponseForFeed);
                },

                getFeedFromNode: function(feedProviderType, nodeID, isRecursive){
                    var requestParams = {
                        method: 'GET',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/nodes/' + feedProviderType + '/' + nodeID,
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    if ( isRecursive == true ) {
                        if(requestParams.params == undefined)
                            requestParams.params = {};

                        requestParams.params.isRecursive = true;
                    }
                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request).then(_processResponseForFeed);
                },

                getFeedLikes: function(feedProviderType, sequenceNumber){

                    var requestParams = {
                        method: 'GET',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/feeds/' + feedProviderType + '/' + sequenceNumber + '/likes',
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request).then(_processLikesResponseForFeed);
                },

                getFeedProviders: function(){
                    var requestParams = {
                        method: 'GET',
                        url: $sessionService.getGatewayURL() + '/feeds/v5/providers',
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    };

                    var request = new Request(requestParams);

                    return $sessionService.runRequest(request).then(_processResponseForFeedProviders);
                }
            }
        }]);