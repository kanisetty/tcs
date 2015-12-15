angular.module('headerController', ['headerService', 'ModalMenu'])

    .controller('headerController', ['$scope', '$navigationService', '$headerService', 'ModalMenu', 'menuItemFactory', '$displayMessageService',
        function ($scope, $navigationService, $headerService, ModalMenu, menuItemFactory, $displayMessageService) {

            $scope.pasteData = {itemInClipboard: false};
            $scope.header = $headerService.getHeader();

            $scope.pasteClick = function() {
                var menuItem = menuItemFactory.createMenuItem('', $scope.pasteData.refresh, false, $scope.pasteData.action);
				var menu = new ModalMenu();

				menu.menuItemClicked(menuItem).then(function(data) {
                    $headerService.clearPasteData();
                });
            };

            $scope.doButtonAction = function() {
                $scope.header.doButtonAction($scope);
            };

            $scope.menuItemClicked = function(modalMenuItem) {
				$scope.menu.menuItemClicked(modalMenuItem).then(function(modalMenuItemResponse){
                    if ($scope.menu != null)
                        $scope.menu.hide();

					if (modalMenuItem.hasModal() != null && modalMenuItem.hasModal() == true){

						var menu = new ModalMenu(modalMenuItemResponse, $displayMessageService.translate('OPTIONS'), $displayMessageService.translate('CANCEL'));
						menu.showModalMenu($scope);

						$scope.menu = menu;
					}
				});
            };

            $scope.$on('$destroy', function() {
                if ($scope.menu != null)
                    $scope.menu.remove();
            });

            $scope.$watch(function() {return $headerService.pasteData }, function(newVal) {
                if (typeof newVal !== 'undefined') {
                    $scope.pasteData = $headerService.pasteData;
                }
            });

            $scope.$watch(function() {return $headerService.header}, function (newVal) {
                if (typeof newVal !== 'undefined') {
                    $scope.header = newVal;
                }
            });
        }]);
