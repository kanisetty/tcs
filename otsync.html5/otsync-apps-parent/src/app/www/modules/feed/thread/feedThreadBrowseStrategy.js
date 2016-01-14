angular.module('FeedThreadBrowseStrategy', ['feedResource', 'feedBrowseDecoratingService', 'FeedBrowseStrategy', 'headerService', 'FeedThreadHeader'])

    .factory('FeedThreadBrowseStrategy', ['$q', '$feedResource', '$feedBrowseDecoratingService', 'FeedBrowseStrategy', '$headerService', '$displayMessageService', 'FeedThreadHeader',
        function($q, $feedResource, $feedBrowseDecoratingService, FeedBrowseStrategy, $headerService, $displayMessageService, FeedThreadHeader) {

            var FeedThreadBrowseStrategy = function(rootName){
                this.rootName = rootName;
                this.feed = null;
            };

            FeedThreadBrowseStrategy.prototype = new FeedBrowseStrategy(this.rootName);

            FeedThreadBrowseStrategy.prototype.getBrowseDecorators = function(root) {
                var deferred = $q.defer();
                var feedProviderType = root.feedProviderType;
                var feedItem = root.feedItem;
                var browseDecorators;
                var self = this;

                $feedResource.getFeedFromConversation(feedProviderType, feedItem.getConversationID()).then(function(feed) {
                    var isThread = true;
                    self.feed = feed;
                    browseDecorators = $feedBrowseDecoratingService.decorateFeedForBrowse(feed, isThread, self.templateURL);
                    deferred.resolve(browseDecorators);
					$displayMessageService.hideMessage();
                });

                return deferred.promise
            };

            FeedThreadBrowseStrategy.prototype.getRoot = function(stateParams){
                var deferred = $q.defer();

                var root = {hideSearch: true, feedProviderType:stateParams.id, feedItem: stateParams.additionalParams.feedItem};

                deferred.resolve(root);

                return deferred.promise
            };

            FeedThreadBrowseStrategy.prototype.initializeHeader = function(root){
                var feedProviderName = $displayMessageService.translate('ALL COMMENTS');

                $headerService.setHeader(new FeedThreadHeader(feedProviderName, root));
            };

            return FeedThreadBrowseStrategy;
        }]);