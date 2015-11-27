angular.module('menuItemFactory', ['MenuItem'])

    .factory('menuItemFactory', ['MenuItem', function (MenuItem) {
        return {
            createMenuItem: function(text, refresh, hasModal, action){

                return new MenuItem(text, refresh, hasModal, action, null, null);
            },

            createMenuItemWithConfirmation: function(text, refresh, hasModal, action, confimationText){

                return new MenuItem(text, refresh, hasModal, action, null, confimationText);
            },

            createMenuItemWithPrompt: function(text, refresh, hasModal, action, prompt, disablePromptLoading){

                return new MenuItem(text, refresh, hasModal, action, prompt, null, disablePromptLoading);
            }
        }
    }]);
