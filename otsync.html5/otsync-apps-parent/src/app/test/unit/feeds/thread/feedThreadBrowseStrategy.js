describe('feedsThreadBrowseStrategy initializeHeader tests', function(){
    var FeedThreadBrowseStrategy, $displayMessageService, $headerService, $feedResource, $navigationService, $ionicModal, FeedHeader, $ionicHistory, $fileMenuService;

    beforeEach(function(){
        module('FeedThreadBrowseStrategy', 'headerService');
        $feedResource = {};
        $navigationService = {};
        $ionicModal = {};
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
            $provide.value('$navigationService', $navigationService);
            $provide.value('$ionicModal', $ionicModal);
            $provide.value('FeedHeader', FeedHeader);
			$provide.value('$ionicHistory', $ionicHistory);
			$provide.value('$fileMenuService', $fileMenuService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_FeedThreadBrowseStrategy_, _$headerService_){
            FeedThreadBrowseStrategy = _FeedThreadBrowseStrategy_;
            $headerService = _$headerService_;
        });
    });

    it('should initialize the header to show ALL COMMENTS and show a button', function() {
        var expectedTitle = "ALL COMMENTS";
        var feedThreadBrowseStrategy = new FeedThreadBrowseStrategy();
        var root = {
            feedItem: {}
        };

        feedThreadBrowseStrategy.initializeHeader(root);

        var header = $headerService.getHeader();

        expect(header.getTitle()).toEqual(expectedTitle);
        expect(header.shouldShowButton()).toEqual(true);
    });
});
