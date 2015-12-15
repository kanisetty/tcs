angular.module('AddToFeedStatusStrategy', ['feedService', 'ModalMenu', 'fileMenuService'])
    .factory('AddToFeedStatusStrategy', ['$q', '$feedService', '$ionicHistory', '$displayMessageService', 'ModalMenu', '$fileMenuService',
        function($q, $feedService, $ionicHistory, $displayMessageService, ModalMenu, $fileMenuService) {
            var AddToFeedStatusStrategy = function(){
                this.type = 'status';
            };

            AddToFeedStatusStrategy.prototype.doPost = function(file, message){
                var deferred = $q.defer();

                if (file == null){
                    $feedService.addFeedStatus(message).then(function(){
                        $ionicHistory.goBack();
                        deferred.resolve();
                    }, function () {
                        $displayMessageService.showToastMessage("STATUS WAS NOT ADDED SUCCESSFULLY");
                        deferred.reject();
                    });
                } else {
                    $feedService.addFeedStatusWithAttachment(file, message).then(function(){
                        $ionicHistory.goBack();
                        deferred.resolve();
                    }, function () {
                        $displayMessageService.showToastMessage("STATUS WAS NOT ADDED SUCCESSFULLY");
                        deferred.reject();
                    });
                }

                return deferred.promise;
            };

            AddToFeedStatusStrategy.prototype.getFile = function(scope){
                var shouldRefresh = false;

                var menu = new ModalMenu($fileMenuService.getFileMenuItemsReturnsFile(shouldRefresh), $displayMessageService.translate('OPTIONS'), $displayMessageService.translate('CANCEL'));
                menu.showModalMenu(scope);

                scope.menu = menu;
            };

            AddToFeedStatusStrategy.prototype.getType = function(){
                return type;
            };

            AddToFeedStatusStrategy.prototype.selectFile = function(scope, modalMenuItem){
                var deferred = $q.defer();

                scope.menu.menuItemClicked(modalMenuItem).then(function(file){
                    if (scope.menu != null)
                        scope.menu.hide();

                    deferred.resolve(file);
                });

                return deferred.promise
            };

            return AddToFeedStatusStrategy;
        }]);
