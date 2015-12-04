describe('feedBrowseDecoratingService decorateFeedItemForBrowse tests', function(){
    var $sessionService, $dummyFeedService, $feedBrowseDecoratingService, $displayMessageService, $dateService;
    var _url = 'SomeURL';

    beforeEach(function(){
        module('dummyFeedService', 'feedBrowseDecoratingService');

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
        inject(function(_$dummyFeedService_, _$feedBrowseDecoratingService_, _$dateService_){
            $dummyFeedService = _$dummyFeedService_;
            $feedBrowseDecoratingService = _$feedBrowseDecoratingService_;
			$dateService = _$dateService_;
        });
    });

    it('should be able to decorate a feed for browse if there is no indenting', function() {
		var dummyCurrentDate = "2015-10-08T20:34:57Z";
		var dummyFeedItemCreateDate = "2015-09-08T20:34:57Z";
		var feedItem = $dummyFeedService.getDummyFeedItemWithCreateDateChanged(dummyFeedItemCreateDate);
        var expectedTimeAgo = '1 MONTH AGO';

		spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

		var doIndent = false;
        var browseDecorator = $feedBrowseDecoratingService.decorateFeedItemForBrowse(feedItem, doIndent);

        expect(browseDecorator.getTitle()).toEqual(feedItem.getUsername());
        expect(browseDecorator.getIconURL()).toEqual(feedItem.getIconURL());
        expect(browseDecorator.getDecoratedObject().getCommentedOn()).toEqual(feedItem.getCommentedOn());
		expect(browseDecorator.getDecoratedObject().getMessage()).toEqual(feedItem.getMessage());
        expect(browseDecorator.getCreateDateDisplay()).toEqual(expectedTimeAgo);
		expect(browseDecorator.doIndent()).toEqual(false);
    });

	it('should be able to decorate a feed for browse if there is indenting', function() {
		var dummyCurrentDate = "2015-10-08T20:34:57Z";
		var dummyFeedItemCreateDate = "2015-09-08T20:34:57Z";
		var feedItem = $dummyFeedService.getDummyFeedItemWithCreateDateChanged(dummyFeedItemCreateDate);
		var expectedTimeAgo = '1 MONTH AGO';

		spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

		var doIndent = true;
		var browseDecorator = $feedBrowseDecoratingService.decorateFeedItemForBrowse(feedItem, doIndent);

		expect(browseDecorator.getTitle()).toEqual(feedItem.getUsername());
		expect(browseDecorator.getIconURL()).toEqual(feedItem.getIconURL());
		expect(browseDecorator.getDecoratedObject().getCommentedOn()).toEqual(feedItem.getCommentedOn());
		expect(browseDecorator.getDecoratedObject().getMessage()).toEqual(feedItem.getMessage());
		expect(browseDecorator.getCreateDateDisplay()).toEqual(expectedTimeAgo);
		expect(browseDecorator.doIndent()).toEqual(true);
	});
});

describe('feedBrowseDecoratingService decorateFeedForBrowse tests', function(){
    var $sessionService, $dummyFeedService, $feedBrowseDecoratingService, $displayMessageService, $dateService;
    var _url = 'SomeURL';

    beforeEach(function(){
        module('dummyFeedService', 'feedBrowseDecoratingService');

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
        inject(function(_$dummyFeedService_, _$feedBrowseDecoratingService_, _$dateService_){
            $dummyFeedService = _$dummyFeedService_;
            $feedBrowseDecoratingService = _$feedBrowseDecoratingService_;
			$dateService = _$dateService_;
        });
    });

    it('should be able to decorate a non thread feed for browse and it should be ordered properly', function() {
        var feed = $dummyFeedService.getDummyFeed();
		var dummyCurrentDate = "2015-10-08T20:34:57Z";
		var expectedTimeAgo1 = '2 MONTHS AGO';
		var expectedTimeAgo2 = '3 MONTHS AGO';

		spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

		var isThread = false;
        var browseDecorators = $feedBrowseDecoratingService.decorateFeedForBrowse(feed, isThread);
        var feedItems = feed.getFeedItems();

        expect(browseDecorators[0].getTitle()).toEqual(feedItems[0].getUsername());
        expect(browseDecorators[0].getIconURL()).toEqual(feedItems[0].getIconURL());
        expect(browseDecorators[0].getDecoratedObject().getCommentedOn()).toEqual(feedItems[0].getCommentedOn());
		expect(browseDecorators[0].getDecoratedObject().getMessage()).toEqual(feedItems[0].getMessage());
        expect(browseDecorators[0].getCreateDateDisplay()).toEqual(expectedTimeAgo1);
		expect(browseDecorators[0].doIndent()).toEqual(false);
        expect(browseDecorators[1].getTitle()).toEqual(feedItems[1].getUsername());
        expect(browseDecorators[1].getIconURL()).toEqual(feedItems[1].getIconURL());
		expect(browseDecorators[1].getDecoratedObject().getCommentedOn()).toEqual(feedItems[1].getCommentedOn());
		expect(browseDecorators[1].getDecoratedObject().getMessage()).toEqual(feedItems[1].getMessage());
        expect(browseDecorators[1].getCreateDateDisplay()).toEqual(expectedTimeAgo1);
		expect(browseDecorators[1].doIndent()).toEqual(false);
        expect(browseDecorators[2].getTitle()).toEqual(feedItems[2].getUsername());
        expect(browseDecorators[2].getIconURL()).toEqual(feedItems[2].getIconURL());
		expect(browseDecorators[2].getDecoratedObject().getCommentedOn()).toEqual(feedItems[2].getCommentedOn());
		expect(browseDecorators[2].getDecoratedObject().getMessage()).toEqual(feedItems[2].getMessage());
        expect(browseDecorators[2].getCreateDateDisplay()).toEqual(expectedTimeAgo1);
		expect(browseDecorators[2].doIndent()).toEqual(false);
        expect(browseDecorators[3].getTitle()).toEqual(feedItems[3].getUsername());
        expect(browseDecorators[3].getIconURL()).toEqual(feedItems[3].getIconURL());
		expect(browseDecorators[3].getDecoratedObject().getCommentedOn()).toEqual(feedItems[3].getCommentedOn());
		expect(browseDecorators[3].getDecoratedObject().getMessage()).toEqual(feedItems[3].getMessage());
        expect(browseDecorators[3].getCreateDateDisplay()).toEqual(expectedTimeAgo1);
		expect(browseDecorators[3].doIndent()).toEqual(false);
        expect(browseDecorators[4].getTitle()).toEqual(feedItems[4].getUsername());
        expect(browseDecorators[4].getIconURL()).toEqual(feedItems[4].getIconURL());
		expect(browseDecorators[4].getDecoratedObject().getCommentedOn()).toEqual(feedItems[4].getCommentedOn());
		expect(browseDecorators[4].getDecoratedObject().getMessage()).toEqual(feedItems[4].getMessage());
        expect(browseDecorators[4].getCreateDateDisplay()).toEqual(expectedTimeAgo2);
		expect(browseDecorators[4].doIndent()).toEqual(false);
    });

	it('should be able to decorate a thread feed for browse and it should be ordered properly', function() {
		var feed = $dummyFeedService.getDummyFeed();
		var dummyCurrentDate = "2015-10-08T20:34:57Z";
		var expectedTimeAgo1 = '2 MONTHS AGO';
		var expectedTimeAgo2 = '3 MONTHS AGO';

		spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

		var isThread = true;
		var browseDecorators = $feedBrowseDecoratingService.decorateFeedForBrowse(feed, isThread);
		var feedItems = feed.getFeedItems();

		expect(browseDecorators[0].getTitle()).toEqual(feedItems[0].getUsername());
		expect(browseDecorators[0].getIconURL()).toEqual(feedItems[0].getIconURL());
		expect(browseDecorators[0].getDecoratedObject().getCommentedOn()).toEqual(feedItems[0].getCommentedOn());
		expect(browseDecorators[0].getDecoratedObject().getMessage()).toEqual(feedItems[0].getMessage());
		expect(browseDecorators[0].getCreateDateDisplay()).toEqual(expectedTimeAgo1);
		expect(browseDecorators[0].doIndent()).toEqual(false);
		expect(browseDecorators[1].getTitle()).toEqual(feedItems[1].getUsername());
		expect(browseDecorators[1].getIconURL()).toEqual(feedItems[1].getIconURL());
		expect(browseDecorators[1].getDecoratedObject().getCommentedOn()).toEqual(feedItems[1].getCommentedOn());
		expect(browseDecorators[1].getDecoratedObject().getMessage()).toEqual(feedItems[1].getMessage());
		expect(browseDecorators[1].getCreateDateDisplay()).toEqual(expectedTimeAgo1);
		expect(browseDecorators[1].doIndent()).toEqual(true);
		expect(browseDecorators[2].getTitle()).toEqual(feedItems[2].getUsername());
		expect(browseDecorators[2].getIconURL()).toEqual(feedItems[2].getIconURL());
		expect(browseDecorators[2].getDecoratedObject().getCommentedOn()).toEqual(feedItems[2].getCommentedOn());
		expect(browseDecorators[2].getDecoratedObject().getMessage()).toEqual(feedItems[2].getMessage());
		expect(browseDecorators[2].getCreateDateDisplay()).toEqual(expectedTimeAgo1);
		expect(browseDecorators[2].doIndent()).toEqual(true);
		expect(browseDecorators[3].getTitle()).toEqual(feedItems[3].getUsername());
		expect(browseDecorators[3].getIconURL()).toEqual(feedItems[3].getIconURL());
		expect(browseDecorators[3].getDecoratedObject().getCommentedOn()).toEqual(feedItems[3].getCommentedOn());
		expect(browseDecorators[3].getDecoratedObject().getMessage()).toEqual(feedItems[3].getMessage());
		expect(browseDecorators[3].getCreateDateDisplay()).toEqual(expectedTimeAgo1);
		expect(browseDecorators[3].doIndent()).toEqual(true);
		expect(browseDecorators[4].getTitle()).toEqual(feedItems[4].getUsername());
		expect(browseDecorators[4].getIconURL()).toEqual(feedItems[4].getIconURL());
		expect(browseDecorators[4].getDecoratedObject().getCommentedOn()).toEqual(feedItems[4].getCommentedOn());
		expect(browseDecorators[4].getDecoratedObject().getMessage()).toEqual(feedItems[4].getMessage());
		expect(browseDecorators[4].getCreateDateDisplay()).toEqual(expectedTimeAgo2);
		expect(browseDecorators[4].doIndent()).toEqual(true);
	});
});
