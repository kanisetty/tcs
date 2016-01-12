describe('nodeBrowseStrategy getRoot tests', function(){
    var $q, $rootScope, NodeBrowseStrategy, $sessionService, $nodeService, $nodeBrowseDecoratingService, $dummyNodeService, $headerService, NodeHeader,
        $displayMessageService, $nodeResource, $stateParams, $ionicModal, $navigationService, WorkflowAttachmentFolderHeader;

    beforeEach(module('NodeBrowseStrategy','nodeService', 'nodeBrowseDecoratingService', 'dummyNodeService'));

    beforeEach(function(){
        $stateParams = {};
        $ionicModal = {};
        $navigationService = {};
		NodeHeader = {};
        WorkflowAttachmentFolderHeader = {};
        $nodeResource = {};
        $sessionService = {};
        $headerService = {};
        $displayMessageService = {
            translate: function(inputString){
                return inputString;
            }
        };

        $nodeService = {
            getNode: function(){},
            getNodeFromQueryString: function(){}
        };

        $nodeBrowseDecoratingService = {};


        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$nodeService', $nodeService);
            $provide.value('$nodeBrowseDecoratingService', $nodeBrowseDecoratingService);
            $provide.value('$headerService', $headerService);
            $provide.value('$displayMessageService', $displayMessageService);
			$provide.value('NodeHeader', NodeHeader);
			$provide.value('$nodeResource', $nodeResource);
            $provide.value('$stateParams', $stateParams);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$ionicModal', $ionicModal);
            $provide.value('WorkflowAttachmentFolderHeader', WorkflowAttachmentFolderHeader);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$nodeService_, _$q_, _$rootScope_, _NodeBrowseStrategy_, _$dummyNodeService_, _NodeHeader_){
            $q = _$q_;
            $rootScope = _$rootScope_;
            NodeBrowseStrategy = _NodeBrowseStrategy_;
            $dummyNodeService = _$dummyNodeService_;
            NodeHeader = _NodeHeader_;
        });
    });

    it('should return a root node when no rootID is passed in', function() {
        var _root;
        var stateParams = {
			id:null
		};
        var ewsID = 2000;
        var mockRoot = $dummyNodeService.getDummyNode();
        var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');

        spyOn($nodeService, 'getNodeFromQueryString').and.returnValue(ewsID);

        spyOn($nodeService, 'getNode').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(mockRoot);
            return deferred.promise;
        });

        nodeBrowseStrategy.getRoot(stateParams).then(function(root){
            _root = root;
        });

        $rootScope.$digest();

        expect(_root.getName()).toEqual(mockRoot.getName());
        expect(_root.getID()).toEqual(mockRoot.getID());
    });

    it('should return a root node when no rootID has no length', function() {
        var _root;
		var stateParams = {
			id:''
		};
        var ewsID = 2000;
        var mockRoot = $dummyNodeService.getDummyNode();
        var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');

        spyOn($nodeService, 'getNodeFromQueryString').and.returnValue(ewsID);

        spyOn($nodeService, 'getNode').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(mockRoot);
            return deferred.promise;
        });

        nodeBrowseStrategy.getRoot(stateParams).then(function(root){
            _root = root;
        });

        $rootScope.$digest();

        expect(_root.getName()).toEqual(mockRoot.getName());
        expect(_root.getID()).toEqual(mockRoot.getID());
    });

    it('should return a root node when no rootID is valid', function() {
        var _root;
		var stateParams = {
			id:2000
		};
        var mockRoot = $dummyNodeService.getDummyNode();
        var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');

        spyOn($nodeService, 'getNode').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(mockRoot);
            return deferred.promise;
        });

        nodeBrowseStrategy.getRoot(stateParams).then(function(root){
            _root = root;
        });

        $rootScope.$digest();

        expect(_root.getName()).toEqual(mockRoot.getName());
        expect(_root.getID()).toEqual(mockRoot.getID());
    });
});

describe('nodeBrowseStrategy  getRootID tests', function(){
    var $q, $rootScope, NodeBrowseStrategy, $sessionService, $nodeService, $nodeBrowseDecoratingService, $dummyNodeService, $headerService, NodeHeader,
        $displayMessageService, $nodeResource, $stateParams, $ionicModal, $navigationService, WorkflowAttachmentFolderHeader;

    beforeEach(module('NodeBrowseStrategy','nodeService', 'nodeBrowseDecoratingService', 'dummyNodeService'));

    beforeEach(function(){
        $stateParams = {};
        $ionicModal = {};
        $navigationService = {};
        NodeHeader = {};
        WorkflowAttachmentFolderHeader = {};
        $nodeResource = {};
        $sessionService = {};
        $headerService = {};
        $displayMessageService = {
            translate: function(inputString){
                return inputString;
            }
        };

        $nodeService = {
            getNode: function(){},
            getNodeFromQueryString: function(){}
        };

        $nodeBrowseDecoratingService = {};


        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$nodeService', $nodeService);
            $provide.value('$nodeBrowseDecoratingService', $nodeBrowseDecoratingService);
            $provide.value('$headerService', $headerService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('NodeHeader', NodeHeader);
            $provide.value('$nodeResource', $nodeResource);
            $provide.value('$stateParams', $stateParams);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$ionicModal', $ionicModal);
            $provide.value('WorkflowAttachmentFolderHeader', WorkflowAttachmentFolderHeader);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$nodeService_, _$q_, _$rootScope_, _NodeBrowseStrategy_, _$dummyNodeService_, _NodeHeader_){
            $q = _$q_;
            $rootScope = _$rootScope_;
            NodeBrowseStrategy = _NodeBrowseStrategy_;
            $dummyNodeService = _$dummyNodeService_;
            NodeHeader = _NodeHeader_;
        });
    });

    it('should return the rootNodeID if $stateParams is null and $nodeService.getNodeFromQueryString returns a value', function() {
        var _rootNodeID;
        var _mockID = 1234;

        $stateParams = null;

        var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');

        spyOn($nodeService, 'getNodeFromQueryString').and.returnValue(_mockID);

        $q.when(nodeBrowseStrategy.getRootID($stateParams)).then(function(rootNodeID){
            _rootNodeID = rootNodeID;
        });

        $rootScope.$digest();

        expect(_rootNodeID).toEqual(_mockID);
    });

    it('should return the root ID if the $stateParams id is null and $nodeService.getNodeFromQueryString returns a value', function() {
        var _rootNodeID;
        var _mockID = 1234;

        $stateParams.id = null;

        var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');

        spyOn($nodeService, 'getNodeFromQueryString').and.returnValue(_mockID);

        $q.when(nodeBrowseStrategy.getRootID($stateParams)).then(function(rootNodeID){
            _rootNodeID = rootNodeID;
        });

        $rootScope.$digest();

        expect(_rootNodeID).toEqual(_mockID);
    });

    it('should return the root ID if the $stateParams id has no length and $nodeService.getNodeFromQueryString returns a value', function() {
        var _rootNodeID;
        var _mockID = 1234;

        $stateParams.id = '';

        var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');

        spyOn($nodeService, 'getNodeFromQueryString').and.returnValue(_mockID);

        $q.when(nodeBrowseStrategy.getRootID($stateParams)).then(function(rootNodeID){
            _rootNodeID = rootNodeID;
        });

        $rootScope.$digest();

        expect(_rootNodeID).toEqual(_mockID);
    });

    it('should return the id from the $stateParams if one exists', function() {
        var _mockID = 1234;
        var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');

        $stateParams.id = _mockID;

        $q.when(nodeBrowseStrategy.getRootID($stateParams)).then(function(rootNodeID){
            _rootNodeID = rootNodeID;
        });

        $rootScope.$digest();

        expect(_rootNodeID).toEqual(_mockID);
    });
});

describe('nodeBrowseStrategy initializeHeader tests', function(){
    var $q, $rootScope, NodeBrowseStrategy, $sessionService, $nodeService, $nodeBrowseDecoratingService, $dummyNodeService, $headerService, $displayMessageService, NodeHeader, NodeMenuStrategy,
        $stateParams, $ionicModal, $navigationService, $nodeResource;

    beforeEach(module('NodeBrowseStrategy','nodeService', 'nodeBrowseDecoratingService', 'dummyNodeService', 'headerService'));

    beforeEach(function(){
        $stateParams = {};
        $ionicModal = {};
        $navigationService = {};
		NodeMenuStrategy = {};
        $sessionService = {};
        $nodeService = {};
        $nodeBrowseDecoratingService = {};
        $nodeResource = {};

        $displayMessageService = {
            translate: function(inputString){
                return inputString;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$nodeService', $nodeService);
            $provide.value('$nodeBrowseDecoratingService', $nodeBrowseDecoratingService);
            $provide.value('$displayMessageService', $displayMessageService);
			$provide.value('NodeMenuStrategy', NodeMenuStrategy);
			$provide.value('$nodeResource', $nodeResource);
            $provide.value('$stateParams', $stateParams);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$ionicModal', $ionicModal);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$nodeService_, _$q_, _$rootScope_, _NodeBrowseStrategy_, _$dummyNodeService_, _$headerService_, _NodeHeader_){
            $q = _$q_;
            $rootScope = _$rootScope_;
            NodeBrowseStrategy = _NodeBrowseStrategy_;
            $dummyNodeService = _$dummyNodeService_;
            $headerService = _$headerService_;
            NodeHeader = _NodeHeader_;
        });
    });

    it('should return header with the button disabled', function() {
        var noPermissions = 128;

        var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');
        var root = $dummyNodeService.getNodeWithNameAndPermsUpdated('Test', noPermissions);

        nodeBrowseStrategy.initializeHeader(root);

        var header = $headerService.getHeader();
        expect(header.getTitle()).toEqual(root.getName());
        expect(header.shouldShowButton()).toEqual(false);
    });

    it('should return headerData with the button enabled', function() {
        var editPermissions = -2147225441;

        var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');
        var root = $dummyNodeService.getNodeWithNameAndPermsUpdated('Test', editPermissions);

        var header = nodeBrowseStrategy.initializeHeader(root);

        var header = $headerService.getHeader();
        expect(header.getTitle()).toEqual(root.getName());
        expect(header.shouldShowButton()).toEqual(true);
    });
});

describe('nodeBrowseStrategy longPressBrowseDecorator tests', function(){
	var NodeMenuStrategy, NodeBrowseStrategy, $sessionService, $nodeService, $nodeBrowseDecoratingService, $nodeResource, $displayMessageService, $q, $rootScope, $menuService, $stateParams,
        $navigationService, $ionicModal;
	beforeEach(module('NodeBrowseStrategy','nodeService', 'nodeBrowseDecoratingService', 'dummyNodeService', 'headerService'));

	beforeEach(function(){
        $stateParams = {};
        $ionicModal = {};
        $navigationService = {};
		NodeMenuStrategy = {};
		$sessionService = {
			isOnline: function(){}
		};
		$nodeService = {};
		$nodeBrowseDecoratingService = {};
        $nodeResource = {};

		$displayMessageService = {
			translate: function(inputString){
				return inputString;
			}
		};

		$menuService = {
			getDisplayMenuItems: function(){},
			createMenu: function(){}
		};

		module(function ($provide) {
			$provide.value('$sessionService', $sessionService);
			$provide.value('$nodeService', $nodeService);
			$provide.value('$nodeBrowseDecoratingService', $nodeBrowseDecoratingService);
			$provide.value('$displayMessageService', $displayMessageService);
			$provide.value('NodeMenuStrategy', NodeMenuStrategy);
			$provide.value('$nodeResource', $nodeResource);
            $provide.value('$stateParams', $stateParams);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$ionicModal', $ionicModal);
		});

		// The injector unwraps the underscores (_) from around the parameter names when matching
		inject(function(_$nodeService_, _$q_, _$rootScope_, _NodeBrowseStrategy_){
			$q = _$q_;
			$rootScope = _$rootScope_;
			NodeBrowseStrategy = _NodeBrowseStrategy_;
		});
	});

	it('should not pop the menu if offline', function() {

		spyOn($sessionService, 'isOnline').and.callFake(function(){
			var deferred = $q.defer();
			deferred.resolve(false);
			return deferred.promise;
		});

		spyOn($menuService, 'createMenu');

		var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');

		nodeBrowseStrategy.longPressBrowseDecorator(null,null);

		$rootScope.$digest();

		expect($menuService.createMenu).not.toHaveBeenCalled();
	});

	it('should pop the menu if online', function() {

		var browseDecorator = {
			getDecoratedObject: function () {
				return [];
			}
		};

		var scope = {
			root: 'test'
		};

		spyOn($sessionService, 'isOnline').and.callFake(function(){
			var deferred = $q.defer();
			deferred.resolve(false);
			return deferred.promise;
		});

		spyOn($menuService, 'createMenu');

		var nodeBrowseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');

		nodeBrowseStrategy.longPressBrowseDecorator(scope, browseDecorator);

		$rootScope.$digest();

		expect($menuService.createMenu).not.toHaveBeenCalled();
	});
});
