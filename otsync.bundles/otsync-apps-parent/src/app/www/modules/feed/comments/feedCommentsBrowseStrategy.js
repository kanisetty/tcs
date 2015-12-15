angular.module('FeedCommentsBrowseStrategy', ['feedService', 'feedBrowseDecoratingService', 'FeedBrowseStrategy', 'headerService', 'FeedCommentsHeader'])

    .factory('FeedCommentsBrowseStrategy', ['$q', '$feedService', '$feedBrowseDecoratingService', 'FeedBrowseStrategy', '$headerService', 'FeedCommentsHeader',
        function($q, $feedService, $feedBrowseDecoratingService, FeedBrowseStrategy, $headerService, FeedCommentsHeader) {

            var FeedCommentsBrowseStrategy = function(rootName){
                this.rootName = rootName;
                this.feed = null;
            };

            FeedCommentsBrowseStrategy.prototype = new FeedBrowseStrategy(this.rootName);

            FeedCommentsBrowseStrategy.prototype.getBrowseDecorators = function(root) {
                var browseDecorators;
                var deferred = $q.defer();
                var feedProviderType = root.feedProviderType;
                var node = root.node;
                var isRecursive = root.isRecursive;
                var self = this;

                $feedService.getFeedFromNode(feedProviderType, node.getID(), isRecursive).then(function(feed) {
                    var isThread = false;
                    self.feed = feed;
                    browseDecorators = $feedBrowseDecoratingService.decorateFeedForBrowse(feed, isThread, self.templateURL);
                    deferred.resolve(browseDecorators);
                });

                return deferred.promise
            };

            FeedCommentsBrowseStrategy.prototype.getRoot = function(stateParams){
                var deferred = $q.defer();

                var root = {hideSearch: true, feedProviderType:stateParams.id, node: stateParams.additionalParams.node, isRecursive: stateParams.additionalParams.isRecursive};

                deferred.resolve(root);

                return deferred.promise
            };

            FeedCommentsBrowseStrategy.prototype.initializeHeader = function(root){

                $headerService.setHeader(new FeedCommentsHeader(root));
            };

            return FeedCommentsBrowseStrategy;
        }]);