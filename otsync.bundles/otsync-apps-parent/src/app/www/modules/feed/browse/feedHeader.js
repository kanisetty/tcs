angular.module('FeedHeader', ['Header', 'ModalMenu', 'menuItemFactory', 'feedResource', 'AddToFeedStatusStrategy'])

    .factory('FeedHeader', ['$q', 'Header', 'ModalMenu', '$displayMessageService', 'menuItemFactory', '$feedResource', '$navigationService', '$stateParams',
				'AddToFeedStatusStrategy',
			function ($q, Header, ModalMenu, $displayMessageService, menuItemFactory, $feedResource, $navigationService, $stateParams, AddToFeedStatusStrategy) {
				var _refresh = true;
				var _hasModal = true;

				var _getFilterMenuItemsPromises = function(feedProviders){
					var filterMenuItemsPromises = [];

					feedProviders.forEach(function(feedProvider){
						filterMenuItemsPromises.push(menuItemFactory.createMenuItem(feedProvider.getName(), _refresh, !_hasModal,
							function () {

								var additionalParams = {
									name: feedProvider.getName()
								};

								$stateParams.id = feedProvider.getType();
								$stateParams.additionalParams = additionalParams;
								return $navigationService.reloadPage();
							}));
					});

					return $q.all(filterMenuItemsPromises);
				};

				var FeedHeader = function(feedProviderName) {
					this.title = feedProviderName;
					this.showButton = true;
					this.showButtonCSS  = 'ion-navicon';
				};

				FeedHeader.prototype = new Header(this.title, this.showButton);

				FeedHeader.prototype.doButtonAction = function(scope){
					var menu = new ModalMenu(this.getHeaderMenuItems(), $displayMessageService.translate('OPTIONS'), $displayMessageService.translate('CANCEL'));
					menu.showModalMenu(scope);

					scope.menu = menu;
				};

				FeedHeader.prototype.getFilterMenuItems = function(){
					var deferred = $q.defer();

					$feedResource.getFeedProviders().then(function(feedProviders){
						_getFilterMenuItemsPromises(feedProviders).then(function(filterMenuItems){
							deferred.resolve(filterMenuItems);
						});
					});

					return deferred.promise;
				};

				FeedHeader.prototype.getHeaderMenuItems = function() {
					var feedHeaderMenuItems = [];
					var self = this;

					feedHeaderMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('FILTER'), !_refresh, _hasModal,
						function () {
							return self.getFilterMenuItems();
						}));

					feedHeaderMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('STATUS'), !_refresh, !_hasModal,
						function () {
							$navigationService.openPage('addtofeed', {addToFeedStrategy: new AddToFeedStatusStrategy()});
						}));

					return feedHeaderMenuItems;
				};

				return FeedHeader;
			}]);