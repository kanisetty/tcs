angular.module('displayMessageService', [])

    .factory('$displayMessageService', ['$ionicLoading', '$ionicPopup', '$translate', '$timeout', function ($ionicLoading, $ionicPopup, $translate, $timeout) {
        var toastVisible = false;
        var duration = 1500;

        return {

            showToastMessage: function (message) {

                $ionicLoading.show({template: this.translate(message), duration: duration, noBackDrop: true});
                toastVisible = true;

                $timeout(function () {
                    toastVisible = false;
                    $ionicLoading.hide();
                }, duration);
            },

            showDisplayMessage: function (translationKey) {

                $ionicLoading.show({
                    template: this.translate(translationKey)
                });
            },

            showErrorMessage: function (message, titleText) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: this.translate(titleText),
                    template: this.translate(message),
                    okText: this.translate('OK')
                });
            },

            showErrorMessageFromKey: function (message, title) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: this.translate(title),
                    template: this.translate(message),
                    okText: this.translate('OK')
                });
            },

            createConfirmationPopup: function (confirmationText, confirmationMessage) {
                return $ionicPopup.confirm({
                    title: this.translate(confirmationMessage),
                    template: this.translate(confirmationText),
                    okText: this.translate('OK'),
                    cancelText: this.translate('CANCEL')
                });
            },

            createPrompt: function (promptTitle, promptMessage) {
                return $ionicPopup.prompt({
                    title: this.translate(promptTitle),
                    inputType: 'text',
                    inputPlaceholder: this.translate(promptMessage),
                    okText: this.translate('OK'),
                    cancelText: this.translate('CANCEL')
                });
            },

            hideMessage: function () {
                if (!toastVisible)
                    $ionicLoading.hide();
            },

            translate: function (key, vars) {
                return $translate.instant(key, vars);
            }
        }
    }]);
