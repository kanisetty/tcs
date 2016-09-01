angular.module('userDisplayService', [])

    .factory('$userDisplayService', function () {
        return {

            getDisplayName: function(username, firstName, lastName){
                var displayName = '';

                if (this.isValidName(firstName) && this.isValidName(lastName)) {
                    displayName = firstName + ' ' + lastName;
                } else {
                    displayName = username;
                }

                return displayName;
            },

            isValidName: function(name) {
                var invalidNames = ["null", "n/a"];
                var isValid;

                if (name == null) {
                    isValid = false;
                }
                else {
                    name = name.trim().toLowerCase();
                    isValid = (name.length > 0) && (invalidNames.indexOf(name) == -1);
                }

                return isValid;
            }
        }
    });

