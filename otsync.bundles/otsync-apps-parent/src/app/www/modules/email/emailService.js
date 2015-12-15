angular.module('emailService', [])
    .factory('$emailService', function() {
        var _regexValidEmail;

        var _initializeEmailRegex = function(){

            // allow few special characters in email address: +-._'`
            var emailValidationStr = /^([\w]+(?:[\w`'\.\+-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

            return new RegExp( emailValidationStr );
        };

        return {

            IsValidEmail: function(emailAddress){

                if( typeof _regexValidEmail === "undefined")
                    _regexValidEmail = _initializeEmailRegex();

                return _regexValidEmail.test(emailAddress);
            }
        }
    });
