describe('browseStrategyFactory tests', function(){
    var browseStrategyFactory, $q, $displayMessageService, NodeHeader,FeedHeader, $actionService,$navigationService, $stateParams, $ionicModal, $ionicHistory;

    beforeEach(module('browseStrategyFactory', 'sessionService', 'nodeService', 'nodeBrowseDecoratingService', 'cacheService', 'headerService',
                        'favoritesService', 'fileService', 'feedService', 'headerService'));


    beforeEach(function() {
		$stateParams = {};
		NodeHeader = {};
		FeedHeader = {};
		$actionService = {};
		$navigationService = {};
		$ionicModal = {};
		$stateParams = {};
		$ionicHistory = {};

        $displayMessageService = {
            translate: function (inputString) {
                return inputString;
            }
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
			$provide.value('NodeHeader', NodeHeader);
			$provide.value('FeedHeader', FeedHeader);
			$provide.value('$actionService', $actionService);
			$provide.value('$navigationService', $navigationService);
			$provide.value('$stateParams', $stateParams);
			$provide.value('$ionicModal', $ionicModal);
			$provide.value('$ionicHistory', $ionicHistory);
        });

        inject(function (_browseStrategyFactory_,_$rootScope_, _$q_) {
            browseStrategyFactory = _browseStrategyFactory_;
            $q = _$q_;
        });
    });

    it('should return enterpriseWorkspaceRoot as the rootName if strategyName is ews and no id was passed', function() {
        var browseStrategy = browseStrategyFactory.getBrowseStrategy('ews', $stateParams);
        expect(browseStrategy.rootName).toEqual('enterpriseWorkspaceRoot');
    });

    it('should return personalWorkspaceRoot as the rootName if strategyName is pws and no id was passed', function() {
        var browseStrategy = browseStrategyFactory.getBrowseStrategy('pws', $stateParams);
        expect(browseStrategy.rootName).toEqual('personalWorkspaceRoot');
    });

    it('should return tempoBoxRoot as the rootName if strategyName is tempo and no id was passed', function() {
        var browseStrategy = browseStrategyFactory.getBrowseStrategy('tempo', $stateParams);
        expect(browseStrategy.rootName).toEqual('tempoBoxRoot');
    });

    it('should return a FavoritesBrowseStrategy if strategyName is favorites and no id was passed', function() {
        var browseStrategy = browseStrategyFactory.getBrowseStrategy('favorites', $stateParams);
        expect(browseStrategy.rootName).toEqual('favorites');
    });

	it('should return a FeedsBrowseStrategy if strategyName is feeds', function() {
		var browseStrategy = browseStrategyFactory.getBrowseStrategy('feeds', $stateParams);
		expect(browseStrategy.rootName).toEqual('feeds');
	});

    it('should return a NodeBrowseStrategy with no rootName if strategyName is unknown and no id was passed', function() {
        var browseStrategy = browseStrategyFactory.getBrowseStrategy('DDsdSDasdSAD', $stateParams);
        expect(browseStrategy.rootName).toEqual('');
    });

    it('should return a NodeBrowseStrategy with no rootName if an id was passed and this is not the feeds app', function() {
        var stateParms = {
            id : 2000
        };

        var browseStrategy = browseStrategyFactory.getBrowseStrategy('ews', stateParms);
        expect(browseStrategy.rootName).toEqual('');
    });
});

