describe('dateService getTimeAgo tests', function(){
    var $userDisplayService, $displayMessageService, $dateService;

    beforeEach(function(){
        module('userDisplayService', 'dateService');

        $displayMessageService = {
            translate: function(inputText){
                return inputText;
            }
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$userDisplayService_, _$dateService_){
            $userDisplayService = _$userDisplayService_;
            $dateService = _$dateService_;
        });
    });

    it('should return 0 SECONDS AGO if the dates are the same', function() {
        var dummyCurrentDate = "2015-10-08T20:30:00Z";
        var dummyFeedItemDate = "2015-10-08T20:30:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("0 SECONDS AGO");
    });

    it('should return 44 SECONDS AGO if the dates are 44 seconds apart', function() {
        var dummyCurrentDate = "2015-10-08T20:30:44Z";
        var dummyFeedItemDate = "2015-10-08T20:30:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("44 SECONDS AGO");
    });

    it('should return 1 MINUTE AGO if the dates are 45 seconds apart', function() {
        var dummyCurrentDate = "2015-10-08T20:30:45Z";
        var dummyFeedItemDate = "2015-10-08T20:30:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 MINUTE AGO");
    });

    it('should return 1 MINUTE AGO if the dates are 89 seconds apart', function() {
        var dummyCurrentDate = "2015-10-08T20:31:29Z";
        var dummyFeedItemDate = "2015-10-08T20:30:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 MINUTE AGO");
    });

    it('should return 2 MINUTES AGO if the dates are 90 seconds apart', function() {
        var dummyCurrentDate = "2015-10-08T20:31:30Z";
        var dummyFeedItemDate = "2015-10-08T20:30:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("2 MINUTES AGO");
    });

    it('should return 44 MINUTES AGO if the dates are 44 minutes apart', function() {
        var dummyCurrentDate = "2015-10-08T20:44:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("44 MINUTES AGO");
    });

    it('should return 1 HOUR AGO if the dates are 45 minutes apart', function() {
        var dummyCurrentDate = "2015-10-08T20:45:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 HOUR AGO");
    });

    it('should return 1 HOUR AGO if the dates are 89 minutes apart', function() {
        var dummyCurrentDate = "2015-10-08T21:29:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 HOUR AGO");
    });

    it('should return 2 HOURS AGO if the dates are 90 minutes apart', function() {
        var dummyCurrentDate = "2015-10-08T21:30:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("2 HOURS AGO");
    });

    it('should return 23 HOURS AGO if the dates are 23 hours apart', function() {
        var dummyCurrentDate = "2015-10-09T19:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("23 HOURS AGO");
    });

    it('should return 1 DAY AGO if the dates are 24 hours apart', function() {
        var dummyCurrentDate = "2015-10-09T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 DAY AGO");
    });

    it('should return 1 DAY AGO if the dates are 41 hours apart', function() {
        var dummyCurrentDate = "2015-10-10T13:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 DAY AGO");
    });

    it('should return 2 DAYS AGO if the dates are 42 hours apart', function() {
        var dummyCurrentDate = "2015-10-10T14:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("2 DAYS AGO");
    });

    it('should return 29 DAYS AGO if the dates are 29 days apart', function() {
        var dummyCurrentDate = "2015-11-06T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("29 DAYS AGO");
    });

    it('should return 1 MONTH AGO if the dates are 30 days apart', function() {
        var dummyCurrentDate = "2015-11-07T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 MONTH AGO");
    });

    it('should return 1 MONTH AGO if the dates are 44 days apart', function() {
        var dummyCurrentDate = "2015-11-21T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 MONTH AGO");
    });

    it('should return 2 MONTHS AGO if the dates are 45 days apart', function() {
        var dummyCurrentDate = "2015-11-22T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("2 MONTHS AGO");
    });

    it('should return 12 MONTHS AGO if the dates are 364 days apart', function() {
        var dummyCurrentDate = "2016-10-06T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("12 MONTHS AGO");
    });

    it('should return 1 YEAR AGO if the dates are 364 days apart', function() {
        var dummyCurrentDate = "2016-10-07T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 YEAR AGO");
    });

    it('should return 1 YEAR AGO if the dates are less than 1.5 years apart', function() {
        var dummyCurrentDate = "2017-04-07T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("1 YEAR AGO");
    });

    it('should return 2 YEARS AGO if the dates are more than 1.5 years apart', function() {
        var dummyCurrentDate = "2017-04-08T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("2 YEARS AGO");
    });

    it('should return 200 YEARS AGO if the dates are 200 years apart', function() {
        var dummyCurrentDate = "2215-04-08T20:00:00Z";
        var dummyFeedItemDate = "2015-10-08T20:00:00Z";

        spyOn($dateService, 'getCurrentDate').andReturn(new Date(dummyCurrentDate));

        var displayDate = $dateService.getTimeAgo(dummyFeedItemDate);

        expect(displayDate).toEqual("200 YEARS AGO");
    });
});
