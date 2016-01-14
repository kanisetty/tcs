describe('FeedItem getCommentedOn tests', function(){
	var Feed, $sessionService, $dummyFeedService, $displayMessageService;
	var _url = 'SomeURL';

	beforeEach(function(){
		module('dummyFeedService', 'userDisplayService');

		$sessionService = {
			getGatewayURL: function () {
				return _url;
			}
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
		inject(function(_$dummyFeedService_){
			$dummyFeedService = _$dummyFeedService_;
		});
	});

	it('should return a populated commentedOn if the FeedItem type is PulseContent and there was a reply on a sequence', function() {
        var feedItem = $dummyFeedService.getDummyPulseContentFeedItemWithCommentOn();
        var expectedCommentOn = "COMMENTED ON" + " " + "test1aa adfasdfasdfasdfasdfasfasfasfasfasfdasdfasfasfsafsafasfasfasfdasfafd";

        expect(feedItem.getCommentedOn()).toEqual(expectedCommentOn);
    });

    it('should return an empty commentedOn if the FeedItem type is PulseContent but there was no reply on a sequence', function() {
        var feedItem = $dummyFeedService.getDummyPulseContentFeedItemWithoutCommentOn();
        var expectedCommentOn = "";

        expect(feedItem.getCommentedOn()).toEqual(expectedCommentOn);
    });

	it('should return a populated commentedOn if the FeedItem type is PulseStatus and there was a reply on a sequence (usename only)', function() {
		var inReplyToUserName = "test";
        var feedItem = $dummyFeedService.getDummyPulseStatusFeedItemWithCommentOn(inReplyToUserName);
        var expectedCommentOn = "COMMENTED ON" + " " + inReplyToUserName + " " + "STATUS";

        expect(feedItem.getCommentedOn()).toEqual(expectedCommentOn);
    });

	it('should return a populated commentedOn if the FeedItem type is PulseStatus and there was a reply on a sequence (usename and firstname)', function() {
		var inReplyToUserName = "test";
		var inReplyToFirstName = "Mike";
		var feedItem = $dummyFeedService.getDummyPulseStatusFeedItemWithCommentOn(inReplyToUserName, inReplyToFirstName);
		var expectedCommentOn = "COMMENTED ON" + " " + inReplyToUserName + " " + "STATUS";

		expect(feedItem.getCommentedOn()).toEqual(expectedCommentOn);
	});

	it('should return a populated commentedOn if the FeedItem type is PulseStatus and there was a reply on a sequence (usename and lastname)', function() {
		var inReplyToUserName = "test";
		var inReplyToLastName = "Fehrenbach";
		var feedItem = $dummyFeedService.getDummyPulseStatusFeedItemWithCommentOn(inReplyToUserName, null, inReplyToLastName);
		var expectedCommentOn = "COMMENTED ON" + " " + inReplyToUserName + " " + "STATUS";

		expect(feedItem.getCommentedOn()).toEqual(expectedCommentOn);
	});

	it('should return a populated commentedOn if the FeedItem type is PulseStatus and there was a reply on a sequence (usename, firstname and lastname)', function() {
		var inReplyToUserName = "test";
		var inReplyToFirstName = "Mike";
		var inReplyToLastName = "Fehrenbach";
		var feedItem = $dummyFeedService.getDummyPulseStatusFeedItemWithCommentOn(inReplyToUserName, inReplyToFirstName, inReplyToLastName);
		var expectedCommentOn = "COMMENTED ON" + " " + inReplyToFirstName + " " + inReplyToLastName + " " + "STATUS";

		expect(feedItem.getCommentedOn()).toEqual(expectedCommentOn);
	});

    it('should return an empty commentedOn if the FeedItem type is PulseStatus but there was no reply on a sequence', function() {
        var feedItem = $dummyFeedService.getDummyPulseStatusFeedItemWithoutCommentOn();
        var expectedCommentOn = "";

        expect(feedItem.getCommentedOn()).toEqual(expectedCommentOn);
    });

    it('should return an empty commentedOn if the FeedItem type is something unexpected', function() {
        var feedItem = $dummyFeedService.getDummyFeedItemWithFeedItemTypeUpdated("fsadfas");
        var expectedCommentOn = "";

        expect(feedItem.getCommentedOn()).toEqual(expectedCommentOn);
    });
});

describe('FeedItem getDisplayName tests', function(){
	var Feed, $sessionService, $dummyFeedService, $displayMessageService;
	var _url = 'SomeURL';

	beforeEach(function(){
		module('dummyFeedService', 'userDisplayService');

		$sessionService = {
			getGatewayURL: function () {
				return _url;
			}
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
		inject(function(_$dummyFeedService_){
			$dummyFeedService = _$dummyFeedService_;
		});
	});

	it('should return the userName as the display name if there is only a username', function() {
		var userName = "test";
		var feedItem = $dummyFeedService.getDummyFeedItemWithNamesUpdated(userName);

		expect(feedItem.getDisplayName()).toEqual(userName);
	});

	it('should return the userName as the display name if username and first name are passed', function() {
		var userName = "test";
		var firstName = "Mike";
		var feedItem = $dummyFeedService.getDummyFeedItemWithNamesUpdated(userName, firstName);

		expect(feedItem.getDisplayName()).toEqual(userName);
	});

	it('should return the userName as the display name if username and last name are passed', function() {
		var userName = "test";
		var lastName = "Fehrenbach";
		var feedItem = $dummyFeedService.getDummyFeedItemWithNamesUpdated(userName, null, lastName);

		expect(feedItem.getDisplayName()).toEqual(userName);
	});

	it('should return the first name plus a space and the last name as the display name if username, first name and last name are passed', function() {
		var userName = "test";
		var firstName = "Mike";
		var lastName = "Fehrenbach";
		var feedItem = $dummyFeedService.getDummyFeedItemWithNamesUpdated(userName, firstName, lastName);
		var expectedDisplayName = firstName + " " + lastName;

		expect(feedItem.getDisplayName()).toEqual(expectedDisplayName);
	});
});

describe('FeedItem getIconURL tests', function(){
	var Feed, $sessionService, $dummyFeedService, $displayMessageService;
	var _url = 'SomeURL';

	beforeEach(function(){
		module('dummyFeedService', 'userDisplayService');

		$sessionService = {
			getGatewayURL: function () {
				return _url;
			}
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
		inject(function(_$dummyFeedService_){
			$dummyFeedService = _$dummyFeedService_;
		});
	});

	it('should return a valid image URL once the FeedItem is created', function() {

		var feedItem = $dummyFeedService.getDummyFeedItem();
		var expectedIconURL = _url + '/content/v5/users/1000/photo';

		expect(feedItem.getIconURL()).toEqual(expectedIconURL);
	});
});
