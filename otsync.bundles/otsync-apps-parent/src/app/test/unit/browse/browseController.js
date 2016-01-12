describe('browseController tests', function(){
    var $scope, $controller, $q, nodesURL, displayMessageServiceMock, sessionServiceMock, $browseService, $translate, ModalMenu, browseStrategyFactory,
        $nodeService, $nodeBrowseDecoratingService, $cacheService, $favoritesService, $dummyNodeService, $displayMessageService, NodeHeader,
        $nodeResource, FeedHeader,$navigationService, $ionicModal,$ionicHistory, WorkflowAttachmentFolderHeader;
    var $stateParams = {};
    var rootName = "RootName";
    var addPerms = 0x00004;
    var dummyID = 1234;

    beforeEach(module('browseController', 'pascalprecht.translate', 'browseStrategyFactory', 'dummyNodeService', 'ModalMenu'));


    beforeEach(function() {
        $nodeResource = {};
        $nodeService = {};
		$nodeBrowseDecoratingService = {};
        $cacheService = {};
        $favoritesService = {};
		NodeHeader = {};
		FeedHeader = {};
		$navigationService = {};
        $ionicModal = {};
		$ionicHistory = {};
        WorkflowAttachmentFolderHeader = {};

        $browseService = {
            initialize: function(){},
            canMoreBrowseItemsBeLoaded: function(){},
            getRoot: function(){},
            getBrowseItems: function(){},
            initializeHeader: function(){},
            setBrowseStrategy: function(){}
        };

        sessionServiceMock = {
            getGatewayURL: function() {
                return '/someURL';
            },

            getCSToken: function () {
                return 'someToken';
            },

            init: function(){
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            },

            getDefaultLanguage: function(){
                return 'en-US';
            },

            getAppName: function(){
                return 'ews';
            },

            isOnline: function(){
                return true;
            }
        };

		$displayMessageService = {
			translate: function(inputText){
				return inputText;
			}
		};

        module(function ($provide) {
            $provide.value('$sessionService', sessionServiceMock);
            $provide.value('$nodeService', $nodeService);
            $provide.value('$nodeBrowseDecoratingService', $nodeBrowseDecoratingService);
            $provide.value('$cacheService', $cacheService);
            $provide.value('$favoritesService', $favoritesService);
			$provide.value('$displayMessageService', $displayMessageService);
			$provide.value('$nodeResource', $nodeResource);
			$provide.value('NodeHeader', NodeHeader);
			$provide.value('FeedHeader', FeedHeader);
			$provide.value('$navigationService', $navigationService);
            $provide.value('$stateParams', $stateParams);
            $provide.value('$ionicModal', $ionicModal);
			$provide.value('$ionicHistory', $ionicHistory);
            $provide.value('WorkflowAttachmentFolderHeader', WorkflowAttachmentFolderHeader);
        });

        inject(function (_$controller_,_$rootScope_, _$q_, _$translate_, _browseStrategyFactory_, _$dummyNodeService_, _ModalMenu_) {
            $scope = _$rootScope_.$new();
            $controller = _$controller_;
            $q =_$q_;
            $translate = _$translate_;
            browseStrategyFactory = _browseStrategyFactory_;
            $dummyNodeService = _$dummyNodeService_;
            ModalMenu = _ModalMenu_;

            displayMessageServiceMock = jasmine.createSpyObj('displayMessageService', ['showToastMessage','hideMessage','showDisplayMessage', 'translate']);
        });

        nodesURL = sessionServiceMock.getGatewayURL() + '/content/v4/nodes/';
    });

    it('should pop an alert if you get an error from content server while trying to get the root without an id', function() {

        $browseService.getRoot = function(){
            var deferred = $q.defer();
            $scope.$broadcast('serverError', {errMsg: 'SomeError'});
            return deferred.promise;
        };

        var browseController = $controller('browseController', {$scope: $scope, $stateParams: $stateParams, $displayMessageService: displayMessageServiceMock, $ionicPlatform:null,
            ModalMenu:ModalMenu, $browseService:$browseService, browseStrategyFactory:browseStrategyFactory,
			$sessionService:sessionServiceMock, $translate:$translate, $navigationService:null});

        $scope.initialize();
        $scope.$apply();

        expect($scope.root).toEqual(null);
        expect($scope.browseDecorators).toEqual([]);
        expect(displayMessageServiceMock.showToastMessage).toHaveBeenCalled();
    });

    it('should be able to set a default root if no id was passed', function() {
        var rootMock = {};
        var browseDecoratorsMock = [];

        rootMock.name = rootName;
        rootMock.id = dummyID;
        rootMock.permissions = addPerms;

        var headerDummyMock = {showSync: true, showMenuButton: false, title: "FAVORITES"};

        $browseService.getRoot = function(){
            var deferred = $q.defer();
            deferred.resolve(rootMock);
            return deferred.promise;
        };

        $browseService.getBrowseDecorators = function(){
            var deferred = $q.defer();
            deferred.resolve(browseDecoratorsMock);
            return deferred.promise;
        };

        $browseService.canMoreBeLoaded = function(){
            return false;
        };

        var browseController = $controller('browseController', {$scope: $scope, $stateParams: $stateParams, $displayMessageService: displayMessageServiceMock, $ionicPlatform:null,
            ModalMenu:ModalMenu, $browseService:$browseService, browseStrategyFactory:browseStrategyFactory,
			$sessionService:sessionServiceMock, $translate:$translate, $navigationService:null});
        $scope.initialize();
        $scope.$apply();

        expect($scope.root).toEqual(rootMock);
    });

    it('should pop an alert if you get an error while trying to get the browse items', function() {

        $browseService.getBrowseDecorators = function(){
            var deferred = $q.defer();
            $scope.$broadcast('serverError', {errMsg: 'SomeError'});
            return deferred.promise;
        };

        var browseController = $controller('browseController', {$scope: $scope, $stateParams: $stateParams, $displayMessageService: displayMessageServiceMock, $ionicPlatform:null,
            ModalMenu:ModalMenu, $browseService:$browseService, browseStrategyFactory:browseStrategyFactory,
			$sessionService:sessionServiceMock, $translate:$translate, $navigationService:null});
        $scope.getBrowseDecorators(dummyID, '');
        $scope.$apply();

        expect(displayMessageServiceMock.showToastMessage).toHaveBeenCalled();
    });

    it('should disallow loading if the service has disallowed loading', function() {
        var browseItemsMock = [];

        $browseService.getBrowseDecorators = function(){
            var deferred = $q.defer();
            deferred.resolve(browseItemsMock);
            return deferred.promise;
        };

        $browseService.canMoreBeLoaded = function(){
            return false;
        };

        var browseController = $controller('browseController', {$scope: $scope, $stateParams: $stateParams, $displayMessageService: displayMessageServiceMock, $ionicPlatform:null,
            ModalMenu:ModalMenu, $browseService:$browseService, browseStrategyFactory:browseStrategyFactory,
			$sessionService:sessionServiceMock, $translate:$translate, $navigationService:null});

        $scope.getBrowseDecorators(dummyID, '');
        $scope.$apply();

        expect($scope.browseDecorators).toEqual([]);
        expect($scope.moreCanBeLoaded).toEqual(false);
    });

    it('should allow more loading if the service allows more loading', function() {
        var browseItemsMock = [];

        var node = $dummyNodeService.getDummyNode();

        browseItemsMock[0] = node;

        $browseService.getBrowseDecorators = function(){
            var deferred = $q.defer();
            deferred.resolve(browseItemsMock);
            return deferred.promise;
        };

        $browseService.canMoreBeLoaded = function(){
            return true;
        };

        var browseController = $controller('browseController', {$scope: $scope, $stateParams: $stateParams, $displayMessageService: displayMessageServiceMock, $ionicPlatform:null,
            ModalMenu:ModalMenu, $browseService:$browseService, browseStrategyFactory:browseStrategyFactory,
			$sessionService:sessionServiceMock, $translate:$translate, $navigationService:null});
        $scope.getBrowseDecorators(dummyID, '');
        $scope.$apply();

        expect($scope.browseDecorators).toBeDefined();
        expect($scope.moreCanBeLoaded).toEqual(true);
    });

    it('should change browseItems, lastExecutedQuery or currentQuery if a search was executed', function() {
        var keyEvent = {};
        var enterButtonCode = 13;
        var currentQuery = 'someCurrentQuery';
        var browseDecoratorsMock = [];

        var node = $dummyNodeService.getDummyNode();

        browseDecoratorsMock[0] = node;

        $browseService.getBrowseDecorators = function(){
            var deferred = $q.defer();
            deferred.resolve(browseDecoratorsMock);
            return deferred.promise;
        };

        $browseService.canMoreBeLoaded = function(){
            return false;
        };

        var browseController = $controller('browseController', {$scope: $scope, $stateParams: $stateParams, $displayMessageService: displayMessageServiceMock, $ionicPlatform:null,
            ModalMenu:ModalMenu, $browseService:$browseService, browseStrategyFactory:browseStrategyFactory,
			$sessionService:sessionServiceMock, $translate:$translate, $navigationService:null});

        keyEvent.keyCode = enterButtonCode;

        $scope.browseDecorators = [];
        $scope.lastExecutedQuery = '';
        $scope.currentQuery = currentQuery;

        $scope.doSearch(node);
        $scope.$apply();

        expect($scope.browseDecorators).toEqual(browseDecoratorsMock);
        expect($scope.lastExecutedQuery).toEqual(currentQuery);
        expect($scope.currentQuery).toEqual(currentQuery);
    });
});
