angular.module('nodeMenuService', ['nodeActionService', 'fileMenuService', 'menuItemFactory', 'nodeOpenService', 'headerService', 'ModalMenu'])

    .factory('$nodeMenuService', ['$displayMessageService', '$nodeActionService', '$fileMenuService', 'menuItemFactory', '$ionicModal', '$nodeOpenService', '$navigationService',
            '$headerService', '$sessionService', 'ModalMenu',
        function ($displayMessageService, $nodeActionService, $fileMenuService, menuItemFactory, $ionicModal, $nodeOpenService, $navigationService, $headerService, $sessionService, ModalMenu) {
            var refresh = true;
            var hasModal = true;

            return {

                getOpenMenuItem: function(title, root, node) {
                    var action = function () {
                        return $nodeOpenService.openNode(node, root, this);
                    };
                    return menuItemFactory.createMenuItem(title, !refresh, !hasModal, action)
                },

                createMenu: function(scope, node) {
                    var menu = new ModalMenu(this.getNodeMenuItems(scope.root, node), $displayMessageService.translate('OPTIONS'), $displayMessageService.translate('CANCEL'));
                    menu.showModalMenu(scope);

                    scope.menu = menu;
                },

                getNodeMenuItems: function(root, node) {
                    var permissions = node.getPermissions();
                    var modalMenuItems = [];
                    var username = $sessionService.getUsername();
                    var PermSeeContents = 0x09001;
                    var PermModify = 0x10000;
                    var PermDelete = 0x00008;
                    var PermCreateNode = 0x00004;

                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('OBJECT DETAILS'), !refresh, !hasModal,
                        function () {
                            return $nodeActionService.getObjectDetailsAction(node);
                        }));

                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('CATEGORIES'), !refresh, !hasModal,
                        function () {
                            return null
                        }));

                    if (node.isFavorite())
                        modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('REMOVE FROM FAVORITES'), refresh, !hasModal,
                            function () {
                                return $nodeActionService.removeFavoriteAction(node);
                            }));
                    else
                        modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('ADD TO FAVORITES'), refresh, !hasModal,
                            function () {
                                return $nodeActionService.addFavoriteAction(node)
                            }));

                    if (node.isReservable()) {
                        if (node.getReservedByUserName() == null || node.getReservedByUserName() == '') {
                            modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('RESERVE'), refresh, !hasModal,
                                function () {
                                    return $nodeActionService.reserveNodeAction(node)
                                }));
                        } else if (node.getReservedByUserName().toUpperCase() == username.toUpperCase()) {
                            modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('UNRESERVE'), refresh, !hasModal,
                                function () {
                                    return $nodeActionService.unreserveNodeAction(node)
                                }));
                        }
                    }

                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('COMMENTS'), !refresh, !hasModal,
                        function () {
                            var additionalParams = {node: node};
                            return $navigationService.openPage('app.browse', {id: "PulseContent", additionalParams: additionalParams});
                        }));

                    //For Documents
                    if (!node.isContainer()) {
                        if ((permissions & PermSeeContents) == PermSeeContents) {
                            modalMenuItems.push(this.getOpenMenuItem($displayMessageService.translate('OPEN'), root, node));
                            modalMenuItems.push($fileMenuService.getDownloadFileMenuItem(node));
                        }
                        if ((permissions & PermModify) == PermModify && (node.getReservedByUserName() == null || (node.getReservedByUserName() != null &&
                            node.getReservedByUserName().toUpperCase() == username.toUpperCase()))) {
                            modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('ADD VERSION'), !refresh, hasModal,
                                function () {
                                    return $fileMenuService.getFileMenuItemsAddVersion(true, node);
                                }));
                        }
                    } else { //Folders
						modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('COMMENTS FROM HERE'), !refresh, !hasModal,
								function () {
									var additionalParams = {
										node: node,
										isRecursive: true
									};
									return $navigationService.openPage('app.browse', {id: "PulseContent", additionalParams: additionalParams});
								}));

                        if ((permissions & PermCreateNode) == PermCreateNode) {
                            modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('UPLOAD HERE'), !refresh, hasModal,
                                function () {
                                    var shouldRefresh = true;
                                    return $fileMenuService.getFileMenuItemsSendToForms(shouldRefresh, node);
                                }));
                        }

                        if (node.sharing().isAShare() || node.sharing().isShareable()) {
                            modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('SHARE'), !refresh, !hasModal,
                                function () {
                                    $navigationService.openPage('app.collaborators', {node: node});
                                }));
                        }
                    }

                    if ((permissions & PermDelete) == PermDelete) {

						if (node.sharing().isSharedToMe() || node.sharing().isAnEnterpriseShare()){
							modalMenuItems.push(menuItemFactory.createMenuItemWithConfirmation($displayMessageService.translate('REMOVE SHARE'), refresh, !hasModal,
									function () {
										return $nodeActionService.deleteNodeAction(node);
									},
									$displayMessageService.translate("REMOVE SHARE CONFIRMATION", {filename: node.getName()})));
						} else if (node.getReservedByUserName() == null) {
                            modalMenuItems.push(menuItemFactory.createMenuItemWithConfirmation($displayMessageService.translate('DELETE'), refresh, !hasModal,
                                function () {
                                    return $nodeActionService.deleteNodeAction(node);
                                },
                                $displayMessageService.translate("DELETE FILE CONFIRMATION", {filename: node.getName()})));
                        }

                        if (node.getReservedByUserName() == null || (node.getReservedByUserName() != null && node.getReservedByUserName().toUpperCase() == username.toUpperCase())) {
                            modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('CUT'), !refresh, !hasModal,
                                function () {
                                    $headerService.updatePasteData({
                                        itemInClipboard: true,
                                        refresh: true,
                                        action: function () {
                                            return $nodeActionService.moveNodeAction(node);
                                        }
                                    });
                                }));
                        }
                    }

                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('COPY'), !refresh, !hasModal,
                        function () {
                            $headerService.updatePasteData({
                                itemInClipboard: true,
                                refresh: true,
                                action: function () {
                                    return $nodeActionService.copyNodeAction(node);
                                }
                            });
                        }));
                    return modalMenuItems;
                }
            }
        }]);
