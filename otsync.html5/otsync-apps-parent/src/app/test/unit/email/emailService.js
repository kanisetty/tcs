describe('emailService IsValidEmail tests', function(){
    var $emailService;

    beforeEach(module('emailService'));

    beforeEach(function(){

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$emailService_){
            $emailService = _$emailService_;
        });
    });

    it('should return false for an empty email address', function() {
        var emailAddressToTest = '';

        expect($emailService.IsValidEmail(emailAddressToTest)).toEqual(false);
    });

    it('should return false if mike is the email address', function() {
        var emailAddressToTest = 'mike';

        expect($emailService.IsValidEmail(emailAddressToTest)).toEqual(false);
    });

    it('should return false if mike.mike@mike is the email address', function() {
        var emailAddressToTest = 'mike.mike@mike';

        expect($emailService.IsValidEmail(emailAddressToTest)).toEqual(false);
    });

    it('should return true if mike.mike@mike.com is the email address', function() {
        var emailAddressToTest = 'mike.mike@mike.com';

        expect($emailService.IsValidEmail(emailAddressToTest)).toEqual(true);
    });
});
