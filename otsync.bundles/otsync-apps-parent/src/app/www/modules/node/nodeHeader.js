angular.module('NodeHeader', ['Header', 'ModalMenu', 'menuItemFactory', 'fileMenuService', 'fileResource'])

    .factory('NodeHeader', ['Header', 'ModalMenu', '$displayMessageService', 'menuItemFactory', '$fileMenuService', '$fileResource',
			function (Header, ModalMenu, $displayMessageService, menuItemFactory, $fileMenuService, $fileResource) {
				var _refresh = true;
				var _hasModal = true;

				var NodeHeader = function(title, showButton) {
					this.title = title;
					this.showButton = showButton;
					this.showButtonCSS  = 'ion-plus-round';
				};

				NodeHeader.prototype = new Header(this.title, this.showButton);

				NodeHeader.prototype.doButtonAction = function(scope){

					var menu = new ModalMenu(this.getHeaderMenuItems(), $displayMessageService.translate('OPTIONS'), $displayMessageService.translate('CANCEL'));
					menu.showModalMenu(scope);

					scope.menu = menu;
				};

				NodeHeader.prototype.getHeaderMenuItems = function() {
					var addMenuItems = [];
					var FOLDER_SUBTYPE = '0';

                    addMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('FOLDER'), !_refresh, !_hasModal,
                            function () {

                                return $fileResource.getAddNodeForm({'type':FOLDER_SUBTYPE});
                            }
                    ));

                    addMenuItems = addMenuItems.concat($fileMenuService.getFileMenuItemsSendToForms(_refresh, null));

					return addMenuItems;
				};

				return NodeHeader;
			}]);