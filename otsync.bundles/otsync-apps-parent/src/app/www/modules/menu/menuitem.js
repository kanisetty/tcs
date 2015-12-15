angular.module('MenuItem', [])

    .factory('MenuItem', function () {

        var MenuItem = function(text, refresh, hasModal, action, prompt, confimationText, disablePromptLoading) {
            var _refresh = refresh;
            var _hasModal = hasModal;
            var _confimationText = confimationText;
            var _disablePromptLoading = disablePromptLoading;
            var _text = text;

            this.action = action;
            this.prompt = prompt;

            this.getText = function() {
                return _text;
            };

            this.getConfirmationText = function() {
                return _confimationText;
            };

            this.shouldRefresh = function() {
                return _refresh;
            };

            this.setRefresh = function(shouldRefresh) {
                _refresh = shouldRefresh;
            };

            this.hasModal = function() {
                return _hasModal;
            };

            this.isDisablePromptLoading = function() {
                return _disablePromptLoading;
            };
        };

        return MenuItem;
    });
