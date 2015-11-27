describe('browseDecorator getName tests', function(){
    var BrowseDecorator, $dummyNodeService, $sessionService, $dummyFeedService, $displayMessageService;
	var _url = 'SomeURL';

    beforeEach(module('BrowseDecorator', 'dummyNodeService', 'dummyFeedService', 'Node'));

    beforeEach(function() {

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

        inject(function (_BrowseDecorator_, _$dummyNodeService_, _$dummyFeedService_) {
            BrowseDecorator = _BrowseDecorator_;
            $dummyNodeService = _$dummyNodeService_;
            $dummyFeedService = _$dummyFeedService_;
        });
    });

    it('should allow you to call return the title as the node name and the iconURL should be the same between objects', function() {
        var node = $dummyNodeService.getDummyNode();
        var title = node.getName();
        var browseDecorator = new BrowseDecorator(node, title, '');

        expect(browseDecorator.getTitle()).toEqual(title);
        expect(browseDecorator.getIconURL()).toEqual(node.getIconURL());
    });

    it('should allow you to call return the toString function from the decorated node.', function() {
        var node = $dummyNodeService.getDummyNode();
        var title = node.getName();
        var browseDecorator = new BrowseDecorator(node, title, '');

        expect(browseDecorator.toString()).toEqual(node.toString());
    });

    it('should allow you to return the title as the FeedItem username and the iconURL should be the same between objects', function() {
        var feedItem = $dummyFeedService.getDummyFeedItem();
        var title = feedItem.getUsername();
        var browseDecorator = new BrowseDecorator(feedItem, title, '');

        expect(browseDecorator.getTitle()).toEqual(title);
        expect(browseDecorator.getIconURL()).toEqual(feedItem.getIconURL());
    });

    it('should allow you to return the toString function from the decorated feedItem.', function() {
        var feedItem = $dummyFeedService.getDummyFeedItem();
        var title = feedItem.getUsername();
        var browseDecorator = new BrowseDecorator(feedItem, title, '');

        expect(browseDecorator.toString()).toEqual(feedItem.toString());
    });
});