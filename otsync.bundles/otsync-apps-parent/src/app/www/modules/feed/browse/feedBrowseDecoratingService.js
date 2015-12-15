angular.module('feedBrowseDecoratingService', ['FeedItemBrowseDecorator', 'dateService'])

    .factory('$feedBrowseDecoratingService', ['FeedItemBrowseDecorator', '$dateService',
			function(FeedItemBrowseDecorator, $dateService){
				return{

					decorateFeedForBrowse: function(feed, isThread, templateURL){
						var browseDecorators = [];
						var self = this;
						var feedItems = feed.getFeedItems();

						if (feedItems != null && feedItems != null){

							for(var i = 0; i < feedItems.length; i++){

								var doIndent = false;
								var feedItem = feedItems[i];

								if (isThread && i != 0)
									doIndent = true;

								var browseDecorator = self.decorateFeedItemForBrowse(feedItem, doIndent, templateURL);
								browseDecorators.push(browseDecorator);
							}
						}

						return browseDecorators;
					},

					decorateFeedItemForBrowse: function(feedItem, doIndent, templateURL) {
						var title = feedItem.getDisplayName();
						var createDateDisplay = this.getCreateTime(feedItem);
						var feedItemBrowseDecorator = new FeedItemBrowseDecorator(feedItem, title, doIndent, templateURL);

						feedItemBrowseDecorator.setCreateDateDisplay(createDateDisplay);

						return feedItemBrowseDecorator;
					},

					getCreateTime: function(feedItem){
						var displayCreateTime = '';

						if ( feedItem != null){

							displayCreateTime += $dateService.getTimeAgo(feedItem.getCreateDate());
						}

						return displayCreateTime;
					}
				}
			}]);
