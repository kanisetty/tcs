angular.module('userDisplayService', [])

    .factory('$userDisplayService', function () {
        return {

            getDisplayName: function(username, firstName, lastName){
                var displayName = '';

                if (firstName != null && firstName.length != 0 && lastName != null && lastName.length != 0) {
                    displayName = firstName + ' ' + lastName;
                } else {
                    displayName = username;
                }

                return displayName;
            }
        }
    });

