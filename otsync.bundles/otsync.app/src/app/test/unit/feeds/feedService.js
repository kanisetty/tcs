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

describe('feedsService getFeed tests', function(){
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

    it('should return a feed where getFeedItems returns [] if nothing was returned from the server', function() {
        var _feed;
        var expectedFeedItems = [];

        spyOn($sessionService, 'runRequest').andCallFake(function(){
            var deferred = $q.defer();
            deferred.resolve([]);
            return deferred.promise;
        });

        $feedService.getFeed().then(function(feed){
            _feed = feed;
        });

        $rootScope.$digest();

        expect(_feed.getFeedItems()).toEqual(expectedFeedItems);
    });

    it('should return a feed where getFeedItems returns feed if FeedItems were found', function() {
        var _feed;
        var expectedSeqNumber1 = 103;
        var expectedSeqNumber2 = 102;
        var expectedSeqNumber3 = 101;
        var expectedSeqNumber4 = 81;
        var expectedSeqNumber5 = 41;

        spyOn($sessionService, 'runRequest').andCallFake(function(){
            var deferred = $q.defer();
            deferred.resolve($dummyFeedService.getDummyFeedData());
            return deferred.promise;
        });

        $feedService.getFeed().then(function(feed){
            _feed = feed;
        });

        $rootScope.$digest();

        var feedItems = _feed.getFeedItems();

        expect(feedItems[0].getSequenceNumber()).toEqual(expectedSeqNumber1);
        expect(feedItems[1].getSequenceNumber()).toEqual(expectedSeqNumber2);
        expect(feedItems[2].getSequenceNumber()).toEqual(expectedSeqNumber3);
        expect(feedItems[3].getSequenceNumber()).toEqual(expectedSeqNumber4);
        expect(feedItems[4].getSequenceNumber()).toEqual(expectedSeqNumber5);
    });
});

describe('feedsService getFeedLikes tests', function(){
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

	it('should return a feed where getFeedLikes returns [] if nothing was returned from the server', function() {
		var _feed;
		var expectedFeedItems = [];

		spyOn($sessionService, 'runRequest').andCallFake(function(){
			var deferred = $q.defer();
			deferred.resolve([]);
			return deferred.promise;
		});

		$feedService.getFeedLikes().then(function(feed){
			_feed = feed;
		});

		$rootScope.$digest();

		expect(_feed.getFeedItems()).toEqual(expectedFeedItems);
	});

	it('should return a feed where getFeedLikes returns feed if users were found', function() {
		var _feed;
		var dummyLikeFeedData = $dummyFeedService.getDummyLikesFeedData();
		var expectedDisplayName1 = dummyLikeFeedData.users[0].displayName;
		var expectedLocation1 = dummyLikeFeedData.users[0].userLocation;
		var expectedPosition1 = dummyLikeFeedData.users[0].userTitle;
		var expectedDisplayName2 = dummyLikeFeedData.users[1].displayName;
		var expectedLocation2 = dummyLikeFeedData.users[1].userLocation;
		var expectedPosition2 = dummyLikeFeedData.users[1].userTitle;

		spyOn($sessionService, 'runRequest').andCallFake(function(){
			var deferred = $q.defer();
			deferred.resolve(dummyLikeFeedData);
			return deferred.promise;
		});

		$feedService.getFeedLikes().then(function(feed){
			_feed = feed;
		});

		$rootScope.$digest();

		var feedItems = _feed.getFeedItems();

		expect(feedItems[0].getDisplayName()).toEqual(expectedDisplayName1);
		expect(feedItems[0].getLocation()).toEqual(expectedLocation1);
		expect(feedItems[0].getPosition()).toEqual(expectedPosition1);
		expect(feedItems[1].getDisplayName()).toEqual(expectedDisplayName2);
		expect(feedItems[1].getLocation()).toEqual(expectedLocation2);
		expect(feedItems[1].getPosition()).toEqual(expectedPosition2);
	});
});

describe('feedsService getFeedProviders tests', function(){
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

    it('should return the all provider if nothing was returned from the server', function() {
        var _feedProviders;
        var expectedType = '';
		var expectedName = 'ALL';

        spyOn($sessionService, 'runRequest').andCallFake(function(){
            var deferred = $q.defer();
            deferred.resolve([]);
            return deferred.promise;
        });

        $feedService.getFeedProviders().then(function(feedProviders){
            _feedProviders = feedProviders;
        });

        $rootScope.$digest();

        expect(_feedProviders[0].getName()).toEqual(expectedName);
		expect(_feedProviders[0].getType()).toEqual(expectedType);
    });

    it('should return a list of feedProviders if data was returned from the server including the all provider', function() {
        var _feedProviders;
        var expectedType1 = "";
        var expectedType2 = "PulseStatus";
        var expectedType3 = "PulseContent";
        var expectedType4 = "PulseMentions";
        var expectedType5 = "PulseFollows";

        spyOn($sessionService, 'runRequest').andCallFake(function(){
            var deferred = $q.defer();
            deferred.resolve($dummyFeedService.getDummyFeedProviderData());
            return deferred.promise;
        });

        $feedService.getFeedProviders().then(function(feedProviders){
            _feedProviders = feedProviders;
        });

        $rootScope.$digest();

        expect(_feedProviders[0].getType()).toEqual(expectedType1);
        expect(_feedProviders[1].getType()).toEqual(expectedType2);
        expect(_feedProviders[2].getType()).toEqual(expectedType3);
        expect(_feedProviders[3].getType()).toEqual(expectedType4);
        expect(_feedProviders[4].getType()).toEqual(expectedType5);
    });
});
