angular.module('FeedBrowseStrategy', ['feedService', 'feedBrowseDecoratingService', 'FeedHeader', 'headerService'])

    .factory('FeedBrowseStrategy', ['$q', '$feedService', '$feedBrowseDecoratingService', 'FeedHeader', '$headerService', '$displayMessageService', '$navigationService',
        function($q, $feedService, $feedBrowseDecoratingService, FeedHeader, $headerService, $displayMessageService, $navigationService) {

            var FeedBrowseStrategy = function(rootName){
                this.rootName = rootName;
				this.feed = null;
                this.templateURL = 'modules/feed/browse/feed.html';
            };

            FeedBrowseStrategy.prototype.initialize = function(){
				this.feed = null;
			};

            FeedBrowseStrategy.prototype.canMoreBeLoaded = function(){
                return this.feed.hasModeFeedItems();
            };

            FeedBrowseStrategy.prototype.clickBrowseDecorator = function(root, browseDecorator) {
                var feedItem = browseDecorator.getDecoratedObject();

                $navigationService.openPage('app.feeditemdetail', {feedItem: feedItem});
			};

            FeedBrowseStrategy.prototype.getBrowseDecorators = function(root, query) {
                var deferred = $q.defer();
                var feedProviderType = root.feedProviderType;
                var browseDecorators;
				var self = this;

				$feedService.getFeed(feedProviderType, query, self.feed).then(function(feed) {
					var isThread = false;
					self.feed = feed;
					browseDecorators = $feedBrowseDecoratingService.decorateFeedForBrowse(feed, isThread, self.templateURL);
					deferred.resolve(browseDecorators);
					$displayMessageService.hideMessage();
				});

                return deferred.promise
            };

            FeedBrowseStrategy.prototype.getRoot = function(stateParams){
                var deferred = $q.defer();

				var root = {hideSearch: false, feedProviderType:stateParams.id, feedProviderName: null};

                if (stateParams.additionalParams != null){
                    root.feedProviderName = stateParams.additionalParams.name;
                }

                deferred.resolve(root);

                return deferred.promise
            };

            FeedBrowseStrategy.prototype.getRootID = function() {
                return null;
            };

			FeedBrowseStrategy.prototype.initializeHeader = function(root){
				var feedProviderName = root.feedProviderName;

				if ( feedProviderName == null || feedProviderName.length == 0 ){
					feedProviderName = $displayMessageService.translate('ALL');
				}

				$headerService.setHeader(new FeedHeader(feedProviderName));
			};

			FeedBrowseStrategy.prototype.longPressBrowseDecorator = function(){
				return null;
			};

            return FeedBrowseStrategy;
        }]);
