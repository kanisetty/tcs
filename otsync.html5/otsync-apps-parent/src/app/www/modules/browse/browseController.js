angular
    .module('browseController', ['browseService', 'ModalMenu', 'browseService', 'browseStrategyFactory'])
    .controller('browseController', [
        '$scope',
        '$stateParams',
        '$displayMessageService',
        '$ionicPlatform',
        'ModalMenu',
        '$browseService',
        'browseStrategyFactory',
        '$sessionService',
        '$translate',
        '$navigationService',
        '$q',
        browseController
    ]);


/**
 * TODO code smell -- too many args to this controller. needs to be broken down into parent/child controllers
 * @param $scope
 * @param $stateParams
 * @param $displayMessageService
 * @param $ionicPlatform
 * @param ModalMenu
 * @param $browseService
 * @param browseStrategyFactory
 * @param $sessionService
 * @param $translate
 * @param $navigationService
 * @param $q
 * @param $timeout
 */
function browseController($scope, $stateParams, $displayMessageService, $ionicPlatform, ModalMenu, $browseService, browseStrategyFactory, $sessionService, $translate, $navigationService, $q) {

    $scope.currentQuery = '';
    $scope.lastExecutedQuery = '';
    $scope.root = null;
    $scope.browseDecorators = [];
    $scope.moreCanBeLoaded = false;
    $scope.showingSearchResults = false;

    $scope.clickBrowseDecorator = clickBrowseDecorator;
    $scope.doSearch = doSearch;
    $scope.clearSearch = clearSearch;
    $scope.getBrowseDecorators = getBrowseDecorators;
    $scope.initialize = initialize;
    $scope.longPressBrowseDecorator = longPressBrowseDecorator;
    $scope.menuItemClicked = menuItemClicked;
    $scope.reloadPage = reloadPage;
    $scope.showBrowseDecorators = showBrowseDecorators;

    $scope.onDeviceLoadInit = function () {
        $ionicPlatform.ready(function () {
            $displayMessageService.showDisplayMessage('LOADING');
            $scope.initialize();
            document.addEventListener('offline', function () {
                hideOfflineUnavailableBrowseDecorators();
                $scope.$apply();
            }, false);
            document.addEventListener('online', function () {
                getRootForBrowse();
                $scope.$apply();
            }, false);
        });
    };

    $scope.$on('serverError', function handler(event, errorArgs) {
        if ($scope.menu != null) {
            $scope.menu.hide();
        }
        $displayMessageService.showToastMessage(errorArgs.errMsg);
    });

    $scope.$on('$destroy', function () {
        if ($scope.menu != null) {
            $scope.menu.remove();
        }
    });

    function getRootForBrowse() {
        var deferred = $q.defer();
        $browseService.getRoot($stateParams).then(function (root) {
            $browseService.initializeHeader(root);
            $scope.root = root;
            $scope.getBrowseDecorators(root).then(deferred.resolve);
        });
        return deferred.promise;
    }

    function initialize() {

        // skip translation service initialization if we are currently offline
        if ($sessionService.isOnline()) {
            $sessionService.init().then(onInit).catch(onInitFail);
        } else {
            onInit();
        }

        function onInit() {
            var appName = $sessionService.getAppName();
            var browseStrategy = browseStrategyFactory.getBrowseStrategy(appName, $stateParams);

            $browseService.setBrowseStrategy(browseStrategy);
            $browseService.initialize();

            // skip translation service initialization if strategy has offline strategy
            if (!$sessionService.isOnline() && browseStrategy.hasOfflineStrategy()) {
                getRootForBrowse().then(hideOfflineUnavailableBrowseDecorators);
            } else {
                $translate.use($sessionService.getDefaultLanguage()).then(getRootForBrowse).catch(
                    function () {
                        $translate.use(appSettings.getDefaultLanguage()).then(getRootForBrowse).catch(onInitFail);
                        onInitFail();
                    }
                );
                // check for pending share requests and present the user the user with option to accept/decline
                $browseService.getPendingShareRequests().then(function (shareRequests) {
                    // this function is recursive
                    // any time a share is accepted or rejected, we wil refresh the page and
                    // process the next share in the shares array
                    var share = (shareRequests.shares || [])[0];
                    var title, text;
                    if (share) {
                        title = 'Share Request';
                        text = '' +
                            share.user_name + ' has shared the folder "' + share.name + '" with you. ' +
                            'Would you like to accept it?';

                        $displayMessageService.createConfirmationPopup(text, title).then(
                            function (accepted) {
                                if (accepted) {
                                    $browseService.acceptShare(share).then(reloadPage);
                                } else {
                                    $browseService.rejectShare(share).then(reloadPage);
                                }
                            }
                        );
                    }
                });
            }
        }

        function onInitFail() {
            console.error($displayMessageService.translate('ERROR INITIALIZATION FAILED', 'ERROR'));
        }
    }

    function clickBrowseDecorator(browseDecorator) {
        $browseService.clickBrowseDecorator($scope.root, browseDecorator);
    }

    function getBrowseDecorators(root, filter) {
        var deferred = $q.defer();
        if (root != undefined) {
            $browseService.getBrowseDecorators(root, filter).then(function (browseDecorators) {
                $scope.showBrowseDecorators(browseDecorators);
                deferred.resolve(browseDecorators);
            });
        } else {
            $scope.moreCanBeLoaded = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        return deferred.promise;
    }

    function longPressBrowseDecorator(browseDecorator) {
        $browseService.longPressBrowseDecorator($scope, browseDecorator)
    }

    function showBrowseDecorators(browseDecorators) {
        $displayMessageService.hideMessage();
        $scope.browseDecorators = $scope.browseDecorators.concat(browseDecorators);
        $scope.moreCanBeLoaded = $browseService.canMoreBeLoaded();
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    function menuItemClicked(modalMenuItem) {
        $scope.menu.menuItemClicked(modalMenuItem).then(function (modalMenuItemResponse) {
            var menu;

            if ($scope.menu != null) {
                $scope.menu.hide();
            }

            if (modalMenuItem.hasModal() != null && modalMenuItem.hasModal() == true) {
                menu = new ModalMenu(
                    modalMenuItemResponse,
                    $displayMessageService.translate('OPTIONS'),
                    $displayMessageService.translate('CANCEL')
                );
                menu.showModalMenu($scope);
                $scope.menu = menu;
            }
        })
    }

    function reloadPage() {
        $navigationService.reloadPage();
    }

    function doSearch(root) {
        $scope.showingSearchResults = true;
        $displayMessageService.showDisplayMessage('LOADING');
        $browseService.initialize();
        $scope.browseDecorators = [];
        $scope.getBrowseDecorators(root, $scope.currentQuery);
        $scope.lastExecutedQuery = $scope.currentQuery;
    }

    function clearSearch(root) {
        $scope.currentQuery = "";
        doSearch(root);
        $scope.showingSearchResults = false;
    }

    function hideOfflineUnavailableBrowseDecorators() {
        $scope.browseDecorators = $scope.browseDecorators.filter(function (decorator) {
            return decorator.decoratedObject.canViewOffline();
        });
    }
}
