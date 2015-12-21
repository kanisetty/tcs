describe('feedsService buildNodeFromFeedItemAttachment tests', function(){
	var $sessionService, $dummyFeedService, $feedService, $q, $rootScope, $displayMessageService;
	var _url = 'SomeURL';

	beforeEach(function(){
		module('feedService', 'dummyFeedService', 'urlEncodingService');

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
		});

		// The injector unwraps the underscores (_) from around the parameter names when matching
		inject(function(_$dummyFeedService_, _$feedService_, _$q_, _$rootScope_){
			$dummyFeedService = _$dummyFeedService_;
			$feedService = _$feedService_;
			$q = _$q_;
			$rootScope = _$rootScope_;
		});
	});

	it('should return a node with name, subtype and id set to valid values if the feedItem had an attachment', function() {
		var node;
		var dummyAttachementID = 1234;
		var dummyAttachementName = "dummyName";
		var dummyAttachementSubtype = 144;
		var dummyFeedItem = $dummyFeedService.getDummyFeedItemWithAttachmentUpdated(dummyAttachementID, dummyAttachementName, dummyAttachementSubtype);

		node = $feedService.buildNodeFromFeedItemAttachment(dummyFeedItem);

		expect(node.getName()).toEqual(dummyFeedItem.getAttachmentName());
		expect(node.getID()).toEqual(dummyFeedItem.getAttachmentID());
		expect(node.getSubtype()).toEqual(dummyFeedItem.getAttachmentSubtype());
	});

	it('should return a node with name, subtype and id set to null if the feedItem had an attachment', function() {
		var node;
		var dummyAttachementID = null;
		var dummyAttachementName = null;
		var dummyAttachementSubtype = null;
		var dummyFeedItem = $dummyFeedService.getDummyFeedItemWithAttachmentUpdated(dummyAttachementID, dummyAttachementName, dummyAttachementSubtype);

		node = $feedService.buildNodeFromFeedItemAttachment(dummyFeedItem);

		expect(node.getName()).toEqual(null);
		expect(node.getID()).toEqual(null);
		expect(node.getSubtype()).toEqual(null);
	});
});