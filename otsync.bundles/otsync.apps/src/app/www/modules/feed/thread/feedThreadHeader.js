angular.module('FeedThreadHeader', ['Header', 'ModalMenu', 'menuItemFactory', 'feedService', 'AddToFeedProviderStrategy'])

    .factory('FeedThreadHeader', ['$q', 'Header', 'ModalMenu', '$displayMessageService', 'menuItemFactory', '$feedService', '$navigationService', 'AddToFeedProviderStrategy',
        function ($q, Header, ModalMenu, $displayMessageService, menuItemFactory, $feedService, $navigationService, AddToFeedProviderStrategy) {
            var _refresh = true;
            var _hasModal = true;

            var FeedThreadHeader = function(feedProviderName, root) {
                this.root = root;

                this.title = feedProviderName;
                this.showButton = true;
                this.showButtonCSS  = 'ion-navicon';
            };

            FeedThreadHeader.prototype = new Header(this.title, this.showButton);

            FeedThreadHeader.prototype.doButtonAction = function(scope){
                var menu = new ModalMenu(this.getHeaderMenuItems(), $displayMessageService.translate('OPTIONS'), $displayMessageService.translate('CANCEL'));
                menu.showModalMenu(scope);

                scope.menu = menu;
            };

            FeedThreadHeader.prototype.getHeaderMenuItems = function() {
                var feedHeaderMenuItems = [];
                var feedItem = this.root.feedItem;
                var goBack = true;

                feedHeaderMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('REPLY TO FEED'), !_refresh, !_hasModal,
                    function () {

                        $navigationService.openPage('addtofeed', {addToFeedStrategy: new AddToFeedProviderStrategy(feedItem, goBack)});
                    }));

                return feedHeaderMenuItems;
            };

            return FeedThreadHeader;
        }]);
