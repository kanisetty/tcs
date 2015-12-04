describe('$nodeBrowseDecoratingService getDisplayFileSize tests', function() {
    var _url = '/someURL/';
    var $nodeBrowseDecoratingService, $sessionService, $displayMessageService, $cacheService, $dummyNodeService;

    beforeEach(module('nodeBrowseDecoratingService', 'dummyNodeService'));

    beforeEach(function(){

        $sessionService = {
            getGatewayURL: function () {
                return _url;
            }
        };

        $displayMessageService = {
            translate: function (inputString) {
                return inputString;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$cacheService', $cacheService);

        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$nodeBrowseDecoratingService_, _$dummyNodeService_){
            $nodeBrowseDecoratingService = _$nodeBrowseDecoratingService_;
            $dummyNodeService = _$dummyNodeService_;
        });



    });

    var expectedNoBytesResponse = 'ZERO_BYTES';
    var largeThanTBResponse = '';

    it('Zero Bytes should have a 0 Bytes display value', function() {
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(0);
        expect(displaySize).toEqual(expectedNoBytesResponse);
    });

    it('Null Bytes should have a 0 Bytes display value', function() {
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(null);
        expect(displaySize).toEqual(expectedNoBytesResponse);
    });

    it('1023 Bytes should have a 1023 Bytes display value', function() {
        var lessThanKBResponse = '1023 BYTES';
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(1023);
        expect(displaySize).toEqual(lessThanKBResponse);
    });

    it('1024 Bytes should have a 1 KB display value', function() {
        var equalToKBResponse = '1 KB';
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(1024);
        expect(displaySize).toEqual(equalToKBResponse);
    });

    it('1048575 Bytes should have a 1024 KB display value', function() {
        var lessThanMBResponse = '1024 KB';
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(1048575);
        expect(displaySize).toEqual(lessThanMBResponse);
    });

    it('1048576 Bytes should have a 1 MB display value', function() {
        var equalToMBResponse = '1 MB';
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(1048576);
        expect(displaySize).toEqual(equalToMBResponse);
    });

    it('1073741823 Bytes should have a 1024 MB display value', function() {
        var lessThanGBResponse = '1024 MB';
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(1073741823);
        expect(displaySize).toEqual(lessThanGBResponse);
    });

    it('1073741824 Bytes should have a 1 GB display value', function() {
        var equalToGBResponse = '1 GB';
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(1073741824);
        expect(displaySize).toEqual(equalToGBResponse);
    });

    it('1099511627775 Bytes should have a 1024 GB display value', function() {
        var lessThanTBResponse = '1024 GB';
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(1099511627775);
        expect(displaySize).toEqual(lessThanTBResponse);
    });

    it('1099511627776 Bytes should have a 1 TB display value', function() {
        var equalToTBResponse = '1 TB';
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(1099511627776);
        expect(displaySize).toEqual(equalToTBResponse);
    });

    it('1125899906842624 Bytes should be empty', function() {
        var displaySize = $nodeBrowseDecoratingService.getDisplayFileSize(1125899906842624);
        expect(displaySize).toEqual(largeThanTBResponse);
    });
});

describe('$nodeBrowseDecoratingService getDisplayModifiedDate tests', function() {
    var _url = '/someURL/';
    var $nodeBrowseDecoratingService, $sessionService, $displayMessageService, $cacheService, $dummyNodeService;

    beforeEach(module('nodeBrowseDecoratingService', 'dummyNodeService'));

    beforeEach(function(){

        $sessionService = {
            getGatewayURL: function () {
                return _url;
            }
        };

        $displayMessageService = {
            translate: function (inputString) {
                return inputString;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$cacheService', $cacheService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$nodeBrowseDecoratingService_, _$dummyNodeService_){
            $nodeBrowseDecoratingService = _$nodeBrowseDecoratingService_;
            $dummyNodeService = _$dummyNodeService_;
        });
    });

    it('null node returns empty string', function() {
        var node = null;
        var displayModifyDate = $nodeBrowseDecoratingService.getDisplayModifiedDate(node);
        expect(displayModifyDate).toEqual('');
    });

    it('null displayModifyDate returns empty string', function() {
        var node = $dummyNodeService.getNodeWithModifyDateUpdated(null);
        var displayModifyDate = $nodeBrowseDecoratingService.getDisplayModifiedDate(node);
        expect(displayModifyDate).toEqual('');
    });

    it('Empty displayModifyDate returns empty string', function() {
        var node = $dummyNodeService.getNodeWithModifyDateUpdated('');
        var displayModifyDate = $nodeBrowseDecoratingService.getDisplayModifiedDate(node);
        expect(displayModifyDate).toEqual('');
    });

    it('2015-02-04T20:00:48Z displayModifyDate returns "updated 2015-02-04"', function() {
        var node = $dummyNodeService.getNodeWithModifyDateUpdated('2015-02-04T20:00:48Z');
        var displayModifyDate = $nodeBrowseDecoratingService.getDisplayModifiedDate(node);
        expect(displayModifyDate).toEqual('UPDATED 2015-02-04');
    });
});

describe('$nodeBrowseDecoratingService decorateNodeChildrenForBrowse tests', function() {
    var _url = '/someURL/';
    var $nodeBrowseDecoratingService, $sessionService, $displayMessageService, $cacheService, $dummyNodeService;
    var iconURL = 'icons/test.png';
    var displayModifyDate = '2015-02-04T20:00:48Z';

    beforeEach(module('nodeBrowseDecoratingService', 'dummyNodeService'));

    beforeEach(function(){
        $sessionService = {
            getGatewayURL: function () {
                return _url;
            }
        };

        $displayMessageService = {
            translate: function (inputString) {
                return inputString;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$cacheService', $cacheService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$nodeBrowseDecoratingService_, _$dummyNodeService_){
            $nodeBrowseDecoratingService = _$nodeBrowseDecoratingService_;
            $dummyNodeService = _$dummyNodeService_;
        });
    });

    it('null nodeChildren returns an empty array', function() {
        var nodeChildren = null;
        var browseDecorators = $nodeBrowseDecoratingService.decorateNodeChildrenForBrowse(nodeChildren);
        expect(browseDecorators).toEqual([]);
    });

    it('Empty nodeChildren returns an empty array', function() {
        var browseDecorators = $nodeBrowseDecoratingService.decorateNodeChildrenForBrowse([]);
        expect(browseDecorators).toEqual([]);
    });

    it('nodeChildren returned has one hidden node', function() {
        var nodeChildren = new Array();
        var node = $dummyNodeService.getHiddenNode();

        nodeChildren[0] = node;

        var browseDecorators = $nodeBrowseDecoratingService.decorateNodeChildrenForBrowse(nodeChildren);
        expect(browseDecorators).toEqual([]);
    });

    it('nodeChildren returned has one displayable container node without a valid gateway URL', function() {
        var nodeChildren = new Array();
        var childCount = 50;
        var expectedIconURL = 'img/default_folder.png';
        var expectedDetail = '50 ITEMS UPDATED 2015-02-04';

        var node = $dummyNodeService.getNodeForDisplay(false, true, iconURL, childCount, displayModifyDate, null);

        spyOn($sessionService, 'getGatewayURL').andReturn(null);

        nodeChildren[0] = node;

        var browseDecorators = $nodeBrowseDecoratingService.decorateNodeChildrenForBrowse(nodeChildren);
        expect(browseDecorators[0].getIconURL()).toEqual(expectedIconURL);
        expect(browseDecorators[0].getDetail()).toEqual(expectedDetail);
        expect(browseDecorators[0].getTitle()).toEqual(node.getName());
    });

    it('nodeChildren returned has one displayable non-container node without a valid gateway URL', function() {
        var nodeChildren = new Array();
        var expectedIconURL = 'img/default_file.png';
        var expectedDetail = '1 MB UPDATED 2015-02-04';
        var bytes = 1048576;

        var node = $dummyNodeService.getNodeForDisplay(false, false, iconURL, null, displayModifyDate, bytes);

        spyOn($sessionService, 'getGatewayURL').andReturn(null);

        nodeChildren[0] = node;

        var browseDecorators = $nodeBrowseDecoratingService.decorateNodeChildrenForBrowse(nodeChildren);
        expect(browseDecorators[0].getIconURL()).toEqual(expectedIconURL);
        expect(browseDecorators[0].getDetail()).toEqual(expectedDetail);
        expect(browseDecorators[0].getTitle()).toEqual(node.getName());
    });

    it('should sort the browseDecorators coming back by name', function() {
        var nodeChildren = new Array();

        var node1 = $dummyNodeService.getNodeWithNameUpdated('test1');
        var node2 = $dummyNodeService.getNodeWithNameUpdated('test1 shortcut');
        var node3 = $dummyNodeService.getNodeWithNameUpdated('WFMap');
        var node4 = $dummyNodeService.getNodeWithNameUpdated('EnterpriseShare');
        var node5 = $dummyNodeService.getNodeWithNameUpdated('test2');
        var node6 = $dummyNodeService.getNodeWithNameUpdated('WFMap2');
        var node7 = $dummyNodeService.getNodeWithNameUpdated('OTTW Area');

        spyOn($sessionService, 'getGatewayURL').andReturn(null);

        nodeChildren[0] = node1;
        nodeChildren[1] = node2;
        nodeChildren[2] = node3;
        nodeChildren[3] = node4;
        nodeChildren[4] = node5;
        nodeChildren[5] = node6;
        nodeChildren[6] = node7;

        var browseDecorators = $nodeBrowseDecoratingService.decorateNodeChildrenForBrowse(nodeChildren);

        expect(browseDecorators[0].getTitle()).toEqual(node4.getName());
        expect(browseDecorators[1].getTitle()).toEqual(node7.getName());
        expect(browseDecorators[2].getTitle()).toEqual(node1.getName());
        expect(browseDecorators[3].getTitle()).toEqual(node2.getName());
        expect(browseDecorators[4].getTitle()).toEqual(node5.getName());
        expect(browseDecorators[5].getTitle()).toEqual(node3.getName());
        expect(browseDecorators[6].getTitle()).toEqual(node6.getName());
    });
});

describe('$nodeBrowseDecoratingService setOverlays tests', function() {
    var $nodeBrowseDecoratingService, $sessionService, $displayMessageService, $cacheService, $dummyNodeService, NodeBrowseDecorator;

    beforeEach(module('nodeBrowseDecoratingService', 'dummyNodeService', 'NodeBrowseDecorator'));

    beforeEach(function(){
        $cacheService = {
            isNodeCachable: function(){}
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$cacheService', $cacheService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$nodeBrowseDecoratingService_, _$dummyNodeService_, _NodeBrowseDecorator_){
            $nodeBrowseDecoratingService = _$nodeBrowseDecoratingService_;
            $dummyNodeService = _$dummyNodeService_;
			NodeBrowseDecorator = _NodeBrowseDecorator_;
        });
    });

    it('should set the read only overlay if the node is read only', function() {
        var node = $dummyNodeService.getReadOnlyNode();
        var browseDecorator = new NodeBrowseDecorator(node, '');

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("readonly-overlay");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getReserveIconCSS()).toEqual("");
    });

    it('should set the read only overlay if the node is read only', function() {
        var node = $dummyNodeService.getReadOnlyNode();
        var browseDecorator = new NodeBrowseDecorator(node, '');

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("readonly-overlay");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getReserveIconCSS()).toEqual("");
    });

    it('should set the read only and favorite overlays if those conditions are true and the node is not cachable', function() {
        var node = $dummyNodeService.getReadOnlyFavorite();
        var browseDecorator = new NodeBrowseDecorator(node, '');

        spyOn($cacheService, 'isNodeCachable').andReturn(false);

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("readonly-overlay");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("favorite-overlay");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getReserveIconCSS()).toEqual("");
    });

    it('should set the read only and favorite overlays if those conditions are true and the node is cached', function() {
        var node = $dummyNodeService.getReadOnlyFavorite();
        var browseDecorator = new NodeBrowseDecorator(node, '');

        spyOn($cacheService, 'isNodeCachable').andReturn(true);
        spyOn(node, 'isCached').andReturn(true);

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("readonly-overlay");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("favorite-overlay");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getReserveIconCSS()).toEqual("");
    });

    it('should set the read only, favorite and unavailable overlays if the node is read only, cachable and not cached', function() {
        var node = $dummyNodeService.getReadOnlyFavorite();
        var browseDecorator = new NodeBrowseDecorator(node, '');

        spyOn($cacheService, 'isNodeCachable').andReturn(true);
        spyOn(node, 'isCached').andReturn(false);

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("readonly-overlay");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("favorite-overlay");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("favorite-unavailable-overlay");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getReserveIconCSS()).toEqual("");
    });

    it('should set favorite overlay if the node is not read only and the node is not cachable', function() {
        var node = $dummyNodeService.getFavorite();
        var browseDecorator = new NodeBrowseDecorator(node, '');

        spyOn($cacheService, 'isNodeCachable').andReturn(false);

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("favorite-overlay");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getReserveIconCSS()).toEqual("");
    });

    it('should set favorite overlay if the node is not read only and the node is cached', function() {
        var node = $dummyNodeService.getFavorite();
        var browseDecorator = new NodeBrowseDecorator(node, '');

        spyOn($cacheService, 'isNodeCachable').andReturn(true);
        spyOn(node, 'isCached').andReturn(true);

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("favorite-overlay");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getReserveIconCSS()).toEqual("");
    });

    it('should set favorite and unavailable overlay if the node is not read only, is cachable but is not cached', function() {
        var node = $dummyNodeService.getFavorite();
        var browseDecorator = new NodeBrowseDecorator(node, '');

        spyOn($cacheService, 'isNodeCachable').andReturn(true);
        spyOn(node, 'isCached').andReturn(false);

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("favorite-overlay");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("favorite-unavailable-overlay");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getReserveIconCSS()).toEqual("");
    });

    it('should set the shortcut overlay if the node is a shortcut', function() {
        var shortcutSubtype = 1;
        var node = $dummyNodeService.getNodeWithSubtypeUpdated(shortcutSubtype);
        var browseDecorator = new NodeBrowseDecorator(node, '');

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("overlay-shortcut");
        expect(browseDecorator.getReserveIconCSS()).toEqual("");
    });

    it('should set the reserved icon if the node is reserved', function() {
        var node = $dummyNodeService.getDummyNode();
        var browseDecorator = new NodeBrowseDecorator(node, '');

        spyOn(node, 'getReservedByUserName').andReturn("Admin");

        $nodeBrowseDecoratingService.setOverlays(browseDecorator, node);

        expect(browseDecorator.getBottomRightOverlayCSS()).toEqual("");
        expect(browseDecorator.getBottomMiddleOverlayCSS()).toEqual("");
        expect(browseDecorator.getBottomLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getTopLeftOverlayCSS()).toEqual("");
        expect(browseDecorator.getReserveIconCSS()).toEqual("reserve-icon");
    });
});