describe('feedsBrowseStrategy initializeHeader tests', function(){
    var FeedBrowseStrategy, $dummyFeedService, $q, $rootScope, $displayMessageService, $feedService, $feedBrowseDecoratingService, $headerService, FeedItem, $sessionService, $nodeMenuService,
			$navigationService, $stateParams, $ionicModal, $ionicHistory;
    var _url = 'SomeURL';

    beforeEach(function(){
        module('FeedBrowseStrategy','feedService', 'FeedHeader', 'feedBrowseDecoratingService', 'dummyFeedService', 'headerService');
        FeedItem = {};
		$nodeMenuService = {};
        $sessionService = {};
        $navigationService = {};
        $stateParams = {};
        $ionicModal = {};
		$ionicHistory = {};

        $displayMessageService = {
            translate: function(inputText){
                return inputText;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('FeedItem', FeedItem);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$stateParams', $stateParams);
			$provide.value('$nodeMenuService', $nodeMenuService);
            $provide.value('$ionicModal', $ionicModal);
			$provide.value('$ionicHistory', $ionicHistory);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$dummyFeedService_, _FeedBrowseStrategy_, _$q_, _$rootScope_, _$feedService_, _$feedBrowseDecoratingService_, _$headerService_){
            $dummyFeedService = _$dummyFeedService_;
            FeedBrowseStrategy = _FeedBrowseStrategy_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $feedService = _$feedService_;
            $feedBrowseDecoratingService = _$feedBrowseDecoratingService_;
            $headerService = _$headerService_;
        });
    });

    it('should set the header title to ALL if feedProviderName is null', function() {
        var root = {
            feedProviderName: null
        };

        var expectedTitle = "ALL";
        var feedBrowseStrategy = new FeedBrowseStrategy();

        feedBrowseStrategy.initializeHeader(root);

        var header = $headerService.getHeader();

        expect(header.getTitle()).toEqual(expectedTitle);
    });

    it('should set the header title to ALL if feedProviderName is empty', function() {
        var root = {
            feedProviderName: ''
        };

        var expectedTitle = "ALL";
        var feedBrowseStrategy = new FeedBrowseStrategy();

        feedBrowseStrategy.initializeHeader(root);

        var header = $headerService.getHeader();

        expect(header.getTitle()).toEqual(expectedTitle);
    });

    it('should set the header title to the passed in value if provided', function() {
        var root = {
            feedProviderName: 'Pulse Status'
        };

        var expectedTitle = 'Pulse Status';
        var feedBrowseStrategy = new FeedBrowseStrategy();

        feedBrowseStrategy.initializeHeader(root);

        var header = $headerService.getHeader();

        expect(header.getTitle()).toEqual(expectedTitle);
    });
});

describe('feedsBrowseStrategy getRoot tests', function(){
    var FeedBrowseStrategy, $dummyFeedService, $q, $rootScope, $displayMessageService, $feedService, $feedBrowseDecoratingService, $headerService, FeedItem, $sessionService, $nodeMenuService,
        $navigationService, $stateParams, $ionicModal,$ionicHistory;
    var _url = 'SomeURL';

    beforeEach(function(){
        module('FeedBrowseStrategy','feedService', 'FeedHeader', 'feedBrowseDecoratingService', 'dummyFeedService', 'headerService');
        FeedItem = {};
        $nodeMenuService = {};
        $sessionService = {};
        $navigationService = {};
        $stateParams = {};
        $ionicModal = {};
		$ionicHistory = {};

        $displayMessageService = {
            translate: function(inputText){
                return inputText;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('FeedItem', FeedItem);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$stateParams', $stateParams);
            $provide.value('$nodeMenuService', $nodeMenuService);
            $provide.value('$ionicModal', $ionicModal);
			$provide.value('$ionicHistory', $ionicHistory);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$dummyFeedService_, _FeedBrowseStrategy_, _$q_, _$rootScope_, _$feedService_, _$feedBrowseDecoratingService_, _$headerService_){
            $dummyFeedService = _$dummyFeedService_;
            FeedBrowseStrategy = _FeedBrowseStrategy_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $feedService = _$feedService_;
            $feedBrowseDecoratingService = _$feedBrowseDecoratingService_;
            $headerService = _$headerService_;
        });
    });

    it('should return a root with a null provider name if no name was passed', function() {
        var _root;

        var stateParams = {
            id: "PulseStatus"
        };

        var feedBrowseStrategy = new FeedBrowseStrategy();

        feedBrowseStrategy.getRoot(stateParams).then(function(root){
            _root = root
        });

        $rootScope.$digest();

        expect(_root.hideSearch).toEqual(false);
        expect(_root.feedProviderType).toEqual(stateParams.id);
        expect(_root.feedProviderName).toEqual(null);
    });

    it('should return a root with a provider name if a name was passed', function() {
        var _root;

        var dummyName = "dummyName";
        var stateParams = {
            id: "PulseStatus",
            additionalParams: {
                name: dummyName
            }
        };

        var feedBrowseStrategy = new FeedBrowseStrategy();

        feedBrowseStrategy.getRoot(stateParams).then(function(root){
            _root = root
        });

        $rootScope.$digest();

        expect(_root.hideSearch).toEqual(false);
        expect(_root.feedProviderType).toEqual(stateParams.id);
        expect(_root.feedProviderName).toEqual(dummyName);
    });
});
