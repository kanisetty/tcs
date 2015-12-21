angular.module('FeedLikesBrowseStrategy', ['feedResource', 'feedBrowseDecoratingService', 'Header', 'headerService'])

    .factory('FeedLikesBrowseStrategy', ['$q', '$feedResource', '$feedBrowseDecoratingService', 'Header', '$headerService', '$displayMessageService',
        function($q, $feedResource, $feedBrowseDecoratingService, Header, $headerService, $displayMessageService) {

            var FeedLikesBrowseStrategy = function(rootName){
                this.rootName = rootName;
                this.templateURL = 'modules/feed/likes/likes.html';
            };

            FeedLikesBrowseStrategy.prototype.initialize = function(){};

            FeedLikesBrowseStrategy.prototype.canMoreBeLoaded = function(){
                return false;
            };

            FeedLikesBrowseStrategy.prototype.clickBrowseDecorator = function(root, browseDecorator){};

            FeedLikesBrowseStrategy.prototype.getBrowseDecorators = function(root) {
                var deferred = $q.defer();
                var feedProviderType = root.feedProviderType;
                var feedItem = root.feedItem;
                var browseDecorators;
                var self = this;

                $feedResource.getFeedLikes(feedProviderType, feedItem.getSequenceNumber()).then(function(feed) {
                    var isThread = false;
                    browseDecorators = $feedBrowseDecoratingService.decorateFeedForBrowse(feed, isThread, self.templateURL);
                    deferred.resolve(browseDecorators);
					$displayMessageService.hideMessage();
                });

                return deferred.promise
            };

            FeedLikesBrowseStrategy.prototype.getRoot = function(stateParams){
                var deferred = $q.defer();

                var root = {hideSearch: true, feedProviderType:stateParams.id, feedItem: stateParams.additionalParams.feedItem};

                deferred.resolve(root);

                return deferred.promise
            };

            FeedLikesBrowseStrategy.prototype.getRootID = function() {
                return null;
            };

            FeedLikesBrowseStrategy.prototype.initializeHeader = function(){
                var feedProviderName = $displayMessageService.translate('ALL LIKES');
                var showButtons = false;

                $headerService.setHeader(new Header(feedProviderName, showButtons));
            };

            FeedLikesBrowseStrategy.prototype.longPressBrowseDecorator = function(){
                return null;
            };

            return FeedLikesBrowseStrategy;
        }]);
