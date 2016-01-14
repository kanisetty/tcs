describe('feedsLikesBrowseStrategy initializeHeader tests', function(){
    var FeedLikesBrowseStrategy, $displayMessageService, $headerService, $feedResource;

    beforeEach(function(){
        module('FeedLikesBrowseStrategy', 'headerService');
        $feedResource = {};
        $displayMessageService = {
            translate: function(inputText){
                return inputText;
            }
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$feedResource', $feedResource);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_FeedLikesBrowseStrategy_, _$headerService_){
            FeedLikesBrowseStrategy = _FeedLikesBrowseStrategy_;
            $headerService = _$headerService_;
        });
    });

    it('should initialize the header to show ALL LIKES and no button', function() {
        var expectedTitle = "ALL LIKES";
        var feedLikeBrowseStrategy = new FeedLikesBrowseStrategy();

        feedLikeBrowseStrategy.initializeHeader();

        var header = $headerService.getHeader();

        expect(header.getTitle()).toEqual(expectedTitle);
        expect(header.shouldShowButton()).toEqual(false);
    });
});
