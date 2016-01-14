angular.module('browseController', ['browseService', 'ModalMenu', 'browseService','browseStrategyFactory'])
    .controller('browseController', ['$scope', '$stateParams', '$displayMessageService','$ionicPlatform','ModalMenu', '$browseService', 'browseStrategyFactory',
        '$sessionService', '$translate', '$navigationService',
        function ($scope, $stateParams, $displayMessageService, $ionicPlatform, ModalMenu, $browseService, browseStrategyFactory, $sessionService, $translate,
                  $navigationService) {
            var initialized = false;

            $scope.currentQuery = '';
            $scope.lastExecutedQuery = '';
            $scope.root = null;
            $scope.browseDecorators = [];
            $scope.moreCanBeLoaded = false;

            $scope.onDeviceLoadInit = function(){

                $ionicPlatform.ready(function() {

                    $displayMessageService.showDisplayMessage('LOADING');
                    $scope.initialize();
                });
            };

            $scope.initialize = function () {
                initialized = true;

                $sessionService.init().then(function(){
                    $translate.use($sessionService.getDefaultLanguage())
                        .then(function(){
                            var browseStrategy = browseStrategyFactory.getBrowseStrategy($sessionService.getAppName(), $stateParams);

                            $browseService.setBrowseStrategy(browseStrategy);
                            $browseService.initialize();

                            $browseService.getRoot($stateParams).then(function (root) {
                                $browseService.initializeHeader(root);
                                $scope.root = root;
                                $scope.getBrowseDecorators(root);
                            })
                        }).catch(function () {
                            $displayMessageService.showErrorMessage('ERROR INITIALIZATION FAILED', 'ERROR');
                        });
                }).catch(function () {
                    $displayMessageService.showErrorMessage('ERROR INITIALIZATION FAILED', 'ERROR');
                });
            };

            $scope.clickBrowseDecorator = function (browseDecorator) {
                $browseService.clickBrowseDecorator($scope.root, browseDecorator);
            };

            $scope.getBrowseDecorators = function(root, filter) {

                if (root != undefined) {
                    $browseService.getBrowseDecorators(root, filter).then(function (browseDecorators) {
                        $scope.showBrowseDecorators(browseDecorators);
                    });
                } else {
                    $scope.moreCanBeLoaded = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            };

            $scope.longPressBrowseDecorator = function (browseDecorator) {
                $browseService.longPressBrowseDecorator($scope, browseDecorator)
            };

            $scope.showBrowseDecorators = function(browseDecorators) {
                $displayMessageService.hideMessage();
                $scope.browseDecorators = $scope.browseDecorators.concat(browseDecorators);
                $scope.moreCanBeLoaded = $browseService.canMoreBeLoaded();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };

            $scope.$on('serverError', function handler(event, errorArgs) {
                $displayMessageService.showToastMessage(errorArgs.errMsg);

                if ($scope.menu != null)
                    $scope.menu.hide();
            });


            $scope.$on('$destroy', function() {
                if ($scope.menu != null)
                    $scope.menu.remove();
            });

            $scope.menuItemClicked = function(modalMenuItem){
                $scope.menu.menuItemClicked(modalMenuItem).then(function(modalMenuItemResponse){
                    if ($scope.menu != null)
                        $scope.menu.hide();

                    if (modalMenuItem.hasModal() != null && modalMenuItem.hasModal() == true){

                        var menu = new ModalMenu(modalMenuItemResponse, $displayMessageService.translate('OPTIONS'), $displayMessageService.translate('CANCEL'));
                        menu.showModalMenu($scope);

                        $scope.menu = menu;
                    }
                })
            };

            $scope.reloadPage = function () {
                $navigationService.reloadPage();
            };

            $scope.doSearch = function(root) {

                $displayMessageService.showDisplayMessage('LOADING');
                $browseService.initialize();
                $scope.browseDecorators = [];
                $scope.getBrowseDecorators(root, $scope.currentQuery);
                $scope.lastExecutedQuery = $scope.currentQuery;
            };
        }]);