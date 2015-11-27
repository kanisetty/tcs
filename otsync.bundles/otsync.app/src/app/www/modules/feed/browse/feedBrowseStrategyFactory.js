angular.module('feedBrowseStrategyFactory', ['FeedBrowseStrategy', 'FeedLikesBrowseStrategy', 'FeedThreadBrowseStrategy', 'FeedCommentsBrowseStrategy'])
    .factory('feedBrowseStrategyFactory', ['FeedBrowseStrategy', 'FeedLikesBrowseStrategy', 'FeedThreadBrowseStrategy', 'FeedCommentsBrowseStrategy',
        function (FeedBrowseStrategy, FeedLikesBrowseStrategy, FeedThreadBrowseStrategy, FeedCommentsBrowseStrategy) {

            return {

                getFeedBrowseStrategy: function(stateParams){
                    var browseStrategy = null;

                    if (stateParams.additionalParams != null && stateParams.additionalParams.showUserFeed == true) {
                        browseStrategy = new FeedLikesBrowseStrategy('likes');
                    } else if (stateParams.additionalParams != null && stateParams.additionalParams.feedItem != null){
                        browseStrategy = new FeedThreadBrowseStrategy('thread');
                    } else if (stateParams.additionalParams != null && stateParams.additionalParams.node != null) {
						browseStrategy = new FeedCommentsBrowseStrategy('feeds');
					} else {
                        browseStrategy = new FeedBrowseStrategy('feeds');
                    }

                    return browseStrategy;
                }
            }
        }]);
