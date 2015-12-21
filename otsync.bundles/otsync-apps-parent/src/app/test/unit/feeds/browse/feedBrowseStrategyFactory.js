describe('feedsBrowseStrategyFactory getFeedBrowseStrategy tests', function(){
    var $displayMessageService, FeedBrowseStrategy, FeedLikesBrowseStrategy, FeedThreadBrowseStrategy, feedBrowseStrategyFactory, $feedResource, ModalMenu, $navigationService, FeedHeader,
			$ionicHistory, $fileMenuService;

    beforeEach(function(){
        module('feedBrowseStrategyFactory', 'FeedBrowseStrategy', 'FeedLikesBrowseStrategy', 'FeedThreadBrowseStrategy');

        $feedResource = {};
        ModalMenu = {};
        $navigationService = {};
        FeedHeader = {};
		$ionicHistory = {};
		$fileMenuService = {};

        $displayMessageService = {
            translate: function(inputText){
                return inputText;
            }
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$feedResource', $feedResource);
            $provide.value('ModalMenu', ModalMenu);
            $provide.value('$navigationService', $navigationService);
            $provide.value('FeedHeader', FeedHeader);
			$provide.value('$ionicHistory', $ionicHistory);
			$provide.value('$fileMenuService', $fileMenuService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_feedBrowseStrategyFactory_){
            feedBrowseStrategyFactory = _feedBrowseStrategyFactory_;
        });
    });

    it('should return the FeedLikesBrowseStrategy if stateParams.additionalParams.showUserFeed is true', function() {
        var stateParams = {
            additionalParams: {
                showUserFeed: true,
                feedItem: {}
            }
        };

        var feedBrowseStrategy = feedBrowseStrategyFactory.getFeedBrowseStrategy(stateParams);
        expect(feedBrowseStrategy.rootName).toEqual('likes');
    });

    it('should return the FeedThreadBrowseStrategy if stateParams.additionalParams.feedItem is there', function() {
        var stateParams = {
            additionalParams: {
                feedItem: {}
            }
        };

        var feedBrowseStrategy = feedBrowseStrategyFactory.getFeedBrowseStrategy(stateParams);
        expect(feedBrowseStrategy.rootName).toEqual('thread');
    });

    it('should return the FeedBrowseStrategy if the default condition is executed', function() {
        var stateParams = {
            additionalParams: {}
        };

        var feedBrowseStrategy = feedBrowseStrategyFactory.getFeedBrowseStrategy(stateParams);
        expect(feedBrowseStrategy.rootName).toEqual('feeds');
    });
});
