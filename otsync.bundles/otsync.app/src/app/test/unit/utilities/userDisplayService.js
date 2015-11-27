describe('userDisplayService getDisplayName tests', function(){
    var $userDisplayService;

    beforeEach(function(){
        module('userDisplayService');

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$userDisplayService_){
            $userDisplayService = _$userDisplayService_;
        });
    });

    it('should return the userName as the display name if there is only a username', function() {
        var userName = "test";
        var displayName = $userDisplayService.getDisplayName(userName);

        expect(displayName).toEqual(userName);
    });

    it('should return the userName as the display name if username and first name are passed', function() {
        var userName = "test";
        var firstName = "Mike";
        var displayName = $userDisplayService.getDisplayName(userName, firstName);

        expect(displayName).toEqual(userName);
    });

    it('should return the userName as the display name if username and last name are passed', function() {
        var userName = "test";
        var lastName = "Fehrenbach";
        var displayName = $userDisplayService.getDisplayName(userName, null, lastName);

        expect(displayName).toEqual(userName);
    });

    it('should return the first name plus a space and the last name as the display name if username, first name and last name are passed', function() {
        var userName = "test";
        var firstName = "Mike";
        var lastName = "Fehrenbach";
        var displayName = $userDisplayService.getDisplayName(userName, firstName, lastName);
        var expectedDisplayName = firstName + " " + lastName;

        expect(displayName).toEqual(expectedDisplayName);
    });
});
