angular.module('Feed', [])
    .factory('Feed', function () {

        var Feed = function(feedData, items) {
            var _hasMoreFeedItems = feedData.isMoreData;
            var _items = items;
            var _newestFeedItemSeqNum = feedData.newest;
            var _oldestFeedItemSeqNum = feedData.oldest;

            this.getFeedItems = function(){
                return _items;
            };

            this.getNewestFeedItemSeqNum = function(){
                return _newestFeedItemSeqNum;
            };

            this.getOldestFeedItemSeqNum = function(){
                return _oldestFeedItemSeqNum;
            };

            this.hasModeFeedItems = function(){
                return _hasMoreFeedItems;
            };
        };

        return Feed;
    });
