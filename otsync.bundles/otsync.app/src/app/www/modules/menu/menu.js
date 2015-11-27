angular.module('Menu', [])
    .factory('Menu', ['$q', '$displayMessageService', '$navigationService', function($q, $displayMessageService, $navigationService) {
        var Menu = function(menuItems){
            this.menuItems = menuItems;
        };

        Menu.prototype.getMenuItems = function(){
            return this.menuItems;
        };

        Menu.prototype.menuItemClicked = function(menuItem) {
            var deferred = $q.defer();

            try {
                var confirmationText = menuItem.getConfirmationText();

                if (confirmationText != undefined && confirmationText != '') {
                    var confirmPopup = $displayMessageService.createConfirmationPopup(confirmationText, 'CONFIRMATION');
                    confirmPopup.then(function (confirmed) {
                        if (confirmed) {
                            $displayMessageService.showDisplayMessage('LOADING');

                            $q.when(menuItem.action()).then(function (actionResponse) {
                                if (menuItem.shouldRefresh()) {
                                    $navigationService.reloadPage();
                                }
                                else {
                                    $displayMessageService.hideMessage();
                                }

                                deferred.resolve(actionResponse);
                            }, function (reason) {
                                $displayMessageService.hideMessage();
                                deferred.reject(reason);
                            });
                        } else {
                            $displayMessageService.hideMessage();
                            deferred.resolve();
                        }
                    });
                } else if (menuItem.prompt) {
                    if (!menuItem.isDisablePromptLoading())
                        $displayMessageService.showDisplayMessage('LOADING');
                    $q.when(menuItem.prompt()).then(function (data) {

                        menuItem.data = data;

                        if (data != undefined) {
                            $displayMessageService.showDisplayMessage('LOADING');
                            $q.when(menuItem.action()).then(function (actionResponse) {
                                if (menuItem.shouldRefresh()) {
                                    $navigationService.reloadPage();
                                }
                                else {
                                    $displayMessageService.hideMessage();
                                }

                                deferred.resolve(actionResponse);
                            }, function (reason) {
                                $displayMessageService.hideMessage();
                                deferred.reject(reason);
                            });
                        } else {
                            $displayMessageService.hideMessage();
                            deferred.resolve()
                        }
                    }, function (reason) {
                        $displayMessageService.hideMessage();
                        deferred.reject(reason);
                    })
                } else {
                    $displayMessageService.showDisplayMessage('LOADING');

                    $q.when(menuItem.action()).then(function (actionResponse) {
                        if (menuItem.shouldRefresh()) {
                            $navigationService.reloadPage();
                        }
                        else {
                            $displayMessageService.hideMessage();
                        }

                        deferred.resolve(actionResponse);
                    }, function (reason) {
                        $displayMessageService.hideMessage();
                        deferred.reject(reason);
                    });
                }
            } catch (error) {
                deferred.reject(error);
                $displayMessageService.hideMessage();
                $displayMessageService.showErrorMessage('ERROR UNABLE TO PERFORM ACTION', 'ERROR');
            }

            return deferred.promise;
        };

        return Menu;
    }]);