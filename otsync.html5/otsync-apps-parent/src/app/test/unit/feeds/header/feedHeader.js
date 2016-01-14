describe('feedsHeader getFilterMenuItems tests', function(){
    var $sessionService, $dummyFeedService, $feedService, $q, $rootScope, $displayMessageService, Header, $nodeMenuService, menuItemFactory, FeedHeader, $navigationService, $stateParams,
        $ionicModal,$ionicHistory;
    var _url = 'SomeURL';

    beforeEach(function(){
        module('FeedHeader','Header', 'menuItemFactory', 'feedService', 'dummyFeedService', 'urlEncodingService');
        $stateParams = {};
        $ionicModal = {};
		$nodeMenuService = {};
		$ionicHistory = {};

        $navigationService = {
            openPage: function(){}
        };

        $sessionService = {
            getGatewayURL: function() {
                return _url;
            },

            getCSToken: function(){},
            runRequest: function(){}
        };

        $displayMessageService = {
            translate: function(inputText){
                return inputText;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$nodeMenuService', $nodeMenuService);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$stateParams', $stateParams);
            $provide.value('$ionicModal', $ionicModal);
			$provide.value('$ionicHistory', $ionicHistory);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$dummyFeedService_, _$feedService_, _$q_, _$rootScope_, _FeedHeader_, _Header_, _menuItemFactory_){
            $dummyFeedService = _$dummyFeedService_;
            $feedService = _$feedService_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            Header = _Header_;
            menuItemFactory = _menuItemFactory_;
            FeedHeader = _FeedHeader_;
        });
    });

    it('should return the all filter menu if no feedProviders were found', function() {
        var _filterMenuItems;
        var expectedText = 'ALL';
        var feedHeader = new FeedHeader('dummy', false);

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve([]);
            return deferred.promise;
        });

        feedHeader.getFilterMenuItems().then(function(filterMenuItems){
            _filterMenuItems = filterMenuItems;
        });

        $rootScope.$digest();

        expect(_filterMenuItems[0].getText()).toEqual(expectedText);
    });

    it('should return a list of filterMenuItems from the feedProviders returned from the server', function() {
        var _filterMenuItems;
        var expectedFilterMenuItemText1 = "ALL";
        var expectedFilterMenuItemText2 = "Pulse Statuses";
        var expectedFilterMenuItemText3 = "Pulse Content";
        var expectedFilterMenuItemText4 = "Pulse Mentions";
        var expectedFilterMenuItemText5 = "Pulse Users I Follow";
        var feedHeader = new FeedHeader('dummy', false);

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve($dummyFeedService.getDummyFeedProviderData());
            return deferred.promise;
        });

        feedHeader.getFilterMenuItems().then(function(filterMenuItems){
            _filterMenuItems = filterMenuItems;
        });

        $rootScope.$digest();

        expect(_filterMenuItems[0].getText()).toEqual(expectedFilterMenuItemText1);
        expect(_filterMenuItems[1].getText()).toEqual(expectedFilterMenuItemText2);
        expect(_filterMenuItems[2].getText()).toEqual(expectedFilterMenuItemText3);
        expect(_filterMenuItems[3].getText()).toEqual(expectedFilterMenuItemText4);
        expect(_filterMenuItems[4].getText()).toEqual(expectedFilterMenuItemText5);
    });
});
