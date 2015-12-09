describe('nodeService loadNodeChildren tests', function(){
    var $nodeService, $q, $nodeDisplayFormattingService, $navigationService, $sessionService, $rootScope, $displayMessageService, $cacheService, $dummyNodeService;
    var dummyNodeName = 'node name';
    var dummyNodeId = 1234;
    var _url = "SomeURL";

    beforeEach(module('nodeService', 'cacheStrategies', 'cacheService', 'dummyNodeService','urlEncodingService'));

    beforeEach(function(){
        $sessionService = {
            getGatewayURL: function () {
                return _url;
            },

            runRequest: function(){},
            getCSToken: function(){
                return 'SomeToken'
            },
            getClientType:function(){
                return 'all'
            }
        };

        $nodeDisplayFormattingService = {
            //just return the nodes without any changes for now
            adaptNodeChildrenForDisplay: function(nodes){
                return nodes;
            }
        };
        $navigationService = {};

        $displayMessageService = {
            translate: function (inputString) {
                return inputString;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$nodeDisplayFormattingService', $nodeDisplayFormattingService);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$displayMessageService', $displayMessageService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$nodeService_, _$q_, _$rootScope_, _$cacheService_, _$debugCacheStrategy_, _$dummyNodeService_){
            $nodeService = _$nodeService_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $displayMessageService = jasmine.createSpyObj('displayMessageService', ['translate']);
            $cacheService = _$cacheService_;
			$dummyNodeService = _$dummyNodeService_;
            $cacheService.setStrategy(_$debugCacheStrategy_);
        });
    });

    it('should return no children and disallow more loading if the server response is null', function() {
        var _nodeChildren = [];
        var moreNodesCanBeLoaded = null;

        spyOn($sessionService, 'runRequest').and.callFake(function(){
                var deferred = $q.defer();
                deferred.resolve(null);
                return deferred.promise;
        });

        $nodeService.getNodeChildren(dummyNodeId, null).then(function(nodeChildren){
            _nodeChildren = nodeChildren;
            moreNodesCanBeLoaded = $nodeService.canMoreNodesBeLoaded();
        });

        $rootScope.$digest();

        expect(_nodeChildren).toEqual([]);
        expect(moreNodesCanBeLoaded).toEqual(false);
    });

    it('should return no children and disallow more loading if the contents are null', function() {
        var _nodeChildren = [];
        var moreNodesCanBeLoaded = null;
        var mockResponse = {};

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            mockResponse.contents = null;
            deferred.resolve(mockResponse);
            return deferred.promise;
        });

        $nodeService.getNodeChildren(dummyNodeId, null).then(function(nodeChildren){
            _nodeChildren = nodeChildren;
            moreNodesCanBeLoaded = $nodeService.canMoreNodesBeLoaded();
        });

        $rootScope.$digest();

        expect(_nodeChildren).toEqual([]);
        expect(moreNodesCanBeLoaded).toEqual(false);
    });

    it('should return no children and disallow more loading if search results are empty', function() {
        var _nodeChildren = [];
        var moreNodesCanBeLoaded = null;
        var mockResponse = {};

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            mockResponse.resultList = [];
            deferred.resolve(mockResponse);
            return deferred.promise;
        });

        $nodeService.getNodeChildren(dummyNodeId, null).then(function(nodeChildren){
            _nodeChildren = nodeChildren;
            moreNodesCanBeLoaded = $nodeService.canMoreNodesBeLoaded();
        });

        $rootScope.$digest();

        expect(_nodeChildren).toEqual([]);
        expect(moreNodesCanBeLoaded).toEqual(false);
    });

    it('should return children and allow more loading if the response returned nodes', function() {
        var _nodeChildren = [];
        var moreNodesCanBeLoaded = null;
        var mockContents = [];
        var mockResponse = {};
		var contentsMock = $dummyNodeService.getNodeDataWithIDAndNameChanged(dummyNodeName, dummyNodeId);

        mockContents[0] = contentsMock;

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            mockResponse.contents = mockContents;
            deferred.resolve(mockResponse);
            return deferred.promise;
        });

        $nodeService.getNodeChildren(dummyNodeId, null).then(function(nodeChildren){
            _nodeChildren = nodeChildren;
            moreNodesCanBeLoaded = $nodeService.canMoreNodesBeLoaded();
        });

        $rootScope.$digest();

        expect(_nodeChildren[0].getName()).toEqual(dummyNodeName);
		expect(_nodeChildren[0].getID()).toEqual(dummyNodeId);
        expect(moreNodesCanBeLoaded).toEqual(true);
    });

    it('should return children and allow more loading if the search response returned nodes', function() {
        var _nodeChildren = [];
        var moreNodesCanBeLoaded = null;
        var mockContents = [];
        var mockResponse = {};
		var contentsMock = $dummyNodeService.getNodeDataWithIDAndNameChanged(dummyNodeName, dummyNodeId);

        mockContents[0] = contentsMock;

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            mockResponse.resultList = mockContents;
            deferred.resolve(mockResponse);
            return deferred.promise;
        });

        $nodeService.getNodeChildren(dummyNodeId, null).then(function(nodeChildren){
            _nodeChildren = nodeChildren;
            moreNodesCanBeLoaded = $nodeService.canMoreNodesBeLoaded();
        });

        $rootScope.$digest();

		expect(_nodeChildren[0].getName()).toEqual(dummyNodeName);
		expect(_nodeChildren[0].getID()).toEqual(dummyNodeId);
        expect(moreNodesCanBeLoaded).toEqual(true);
    });
});
