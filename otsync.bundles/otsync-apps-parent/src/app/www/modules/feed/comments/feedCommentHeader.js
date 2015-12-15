angular.module('FeedCommentsHeader', ['Header', 'ModalMenu', 'menuItemFactory', 'feedService', 'FeedThreadHeader', 'AddToFeedCommentStrategy'])

    .factory('FeedCommentsHeader', ['$q', 'Header', 'ModalMenu', '$displayMessageService', 'menuItemFactory', '$feedService', '$navigationService', 'FeedThreadHeader', 'AddToFeedCommentStrategy',
        function ($q, Header, ModalMenu, $displayMessageService, menuItemFactory, $feedService, $navigationService, FeedThreadHeader, AddToFeedCommentStrategy) {
            var _refresh = true;
            var _hasModal = true;

            var FeedCommentsHeader = function(root) {
                this.root = root;
                this.title = root.node.getName();
            };

            FeedCommentsHeader.prototype = new FeedThreadHeader(this.title, this.root);

            FeedCommentsHeader.prototype.getHeaderMenuItems = function() {
                var feedHeaderMenuItems = [];
                var node = this.root.node;

                feedHeaderMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('REPLY TO FEED'), !_refresh, !_hasModal,
                    function () {
                        $navigationService.openPage('addtofeed', {addToFeedStrategy: new AddToFeedCommentStrategy(node)});
                    }));

                return feedHeaderMenuItems;
            };

            return FeedCommentsHeader;
        }]);
