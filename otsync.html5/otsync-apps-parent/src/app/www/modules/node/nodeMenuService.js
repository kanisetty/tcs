angular
    .module('nodeMenuService', [
        'nodeResource',
        'fileMenuService',
        'menuItemFactory',
        'nodeOpenService',
        'headerService',
        'ModalMenu',
        'favoritesResource',
        'appworksService'
    ])
    .factory('$nodeMenuService', [
        '$q',
        '$displayMessageService',
        '$nodeResource',
        '$fileMenuService',
        'menuItemFactory',
        '$nodeOpenService',
        '$navigationService',
        '$headerService',
        '$sessionService',
        'ModalMenu',
        '$favoritesResource',
        '$appworksService',
        $nodeMenuService
    ]);

/**
 * TODO code smells - too many dependencies. break down into parent/child controllers
 * @param $q
 * @param $displayMessageService
 * @param $nodeResource
 * @param $fileMenuService
 * @param menuItemFactory
 * @param $nodeOpenService
 * @param $navigationService
 * @param $headerService
 * @param $sessionService
 * @param ModalMenu
 * @param $favoritesResource
 * @param $appworksService
 * @returns {{getOpenMenuItem: getOpenMenuItem, createMenu: createMenu, getNodeMenuItems: getNodeMenuItems}}
 */
function $nodeMenuService($q, $displayMessageService, $nodeResource, $fileMenuService, menuItemFactory, $nodeOpenService, $navigationService, $headerService, $sessionService, ModalMenu, $favoritesResource, $appworksService) {
    var refresh = true;
    var hasModal = true;

    return {

        getOpenMenuItem: function (title, root, node) {
            var action = function () {
                return $nodeOpenService.openNode(node, root, this);
            };
            return menuItemFactory.createMenuItem(title, !refresh, !hasModal, action)
        },

        createMenu: function (scope, node) {
            var menu = new ModalMenu(this.getNodeMenuItems(scope.root, node), $displayMessageService.translate('OPTIONS'), $displayMessageService.translate('CANCEL'));
            menu.showModalMenu(scope);

            scope.menu = menu;
        },

        getNodeMenuItems: function (root, node) {
            var permissions = node.getPermissions();
            var modalMenuItems = [];
            var username = $sessionService.getUsername();
            var PermSeeContents = 0x09001;
            var PermModify = 0x10000;
            var PermDelete = 0x00008;
            var PermCreateNode = 0x00004;
            var hideCommentOptions = ($sessionService.getAppName() == "tempo" && node.isContainer());

            modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('OBJECT DETAILS'), !refresh, !hasModal,
                function () {
                    var deferred = $q.defer();
                    var data = {'id': node.getID()};

                    $appworksService.openFromAppworks('objectdetails-component', data, true);

                    //TODO Currently appworks doesn't fire a close-me with their x button. just return here so the loading closes properly
                    deferred.resolve();

                    return deferred.promise;
                }));

            // TODO feature request: update categories on mobile. Removed by JI on aug 1, 2016.
            //modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('CATEGORIES'), !refresh, !hasModal,
            //    function () {
            //        return null
            //    }));

            if (node.isFavorite()) {
                modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('REMOVE FROM FAVORITES'), refresh, !hasModal,
                    function () {
                        return $favoritesResource.removeFavorite(node);
                    }));
            } else {
                modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('ADD TO FAVORITES'), refresh, !hasModal,
                    function () {
                        return $favoritesResource.addFavorite(node);
                    }));
            }


            if (node.isReservable()) {
                if (node.getReservedByUserName() == null || node.getReservedByUserName() == '') {
                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('RESERVE'), refresh, !hasModal,
                        function () {
                            return $nodeResource.reserveNode(node)
                        }));
                } else if (node.getReservedByUserName().toUpperCase() == username.toUpperCase()) {
                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('UNRESERVE'), refresh, !hasModal,
                        function () {
                            return $nodeResource.unreserveNode(node)
                        }));
                }
            }

            if(!hideCommentOptions) {
              modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('COMMENTS'), !refresh, !hasModal,
                  function () {
                      var additionalParams = {node: node};
                      return $navigationService.openPage('app.browse', {
                          id: "PulseContent",
                          additionalParams: additionalParams
                      });
                  }));
            }
            //For Documents
            if (!node.isContainer() && node.isDocument()) {
                if ((permissions & PermSeeContents) == PermSeeContents) {
                    modalMenuItems.push(this.getOpenMenuItem($displayMessageService.translate('OPEN'), root, node));
                    /**
                     * TODO JI Aug 2, 2016
                     * currently download seems to be pointless, because we cant view files we have downloaded -
                     * removing for initial OTE release. I am opting for Open In functionality instead, as seen
                     * in method below. NOTE: open in is IOS only for now.
                     */
                    modalMenuItems.push($fileMenuService.getOpenInFileMenuItem(node));
                    // modalMenuItems.push($fileMenuService.getDownloadFileMenuItem(node));
                }
                if ((permissions & PermModify) == PermModify && (node.getReservedByUserName() == null || (node.getReservedByUserName() != null &&
                    node.getReservedByUserName().toUpperCase() == username.toUpperCase()))) {
                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('ADD VERSION'), !refresh, hasModal,
                        function () {
                            return $fileMenuService.getFileMenuItemsAddVersion(true, node);
                        }));
                }
            } else { //Folders
                if(!hideCommentOptions) {
                  modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('COMMENTS FROM HERE'), !refresh, !hasModal,
                      function () {
                          var additionalParams = {
                              node: node,
                              isRecursive: true
                          };
                          return $navigationService.openPage('app.browse', {
                              id: "PulseContent",
                              additionalParams: additionalParams
                          });
                      }));
                }
                if ((permissions & PermCreateNode) == PermCreateNode && node.isFolder()) {
                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('UPLOAD HERE'), !refresh, hasModal,
                        function () {
                            var shouldRefresh = true;
                            return $fileMenuService.getFileMenuItemsSendToForms(shouldRefresh, node);
                        }));
                }

                if (node.sharing().isTempo() && (node.sharing().isAShare() || node.sharing().isShareable())) {
                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('SHARE'), !refresh, !hasModal,
                        function () {
                            $navigationService.openPage('app.collaborators', {node: node});
                        }));

                    modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('TEMPO TASKS'), !refresh, !hasModal,
                        function () {
                            $navigationService.openPage('app.tempotasks', {node: node});
                        }));
                }
            }

            if ((permissions & PermDelete) == PermDelete) {

                if (node.sharing().isSharedToMe() || node.sharing().isAnEnterpriseShare()) {
                    modalMenuItems.push(menuItemFactory.createMenuItemWithConfirmation($displayMessageService.translate('REMOVE SHARE'), refresh, !hasModal,
                        function () {
                            return $nodeResource.deleteNode(node);
                        },
                        $displayMessageService.translate("REMOVE SHARE CONFIRMATION", {filename: node.getName()})));
                } else if (node.getReservedByUserName() == null) {
                    modalMenuItems.push(menuItemFactory.createMenuItemWithConfirmation($displayMessageService.translate('DELETE'), refresh, !hasModal,
                        function () {
                            return $nodeResource.deleteNode(node);
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
                                    return $nodeResource.moveNode(node);
                                }
                            });
                        }));
                }

            // TEMPO-6760
            } else {
              if (node.sharing().isSharedToMe() || node.sharing().isAnEnterpriseShare()) {
                  modalMenuItems.push(menuItemFactory.createMenuItemWithConfirmation($displayMessageService.translate('REMOVE SHARE'), refresh, !hasModal,
                      function () {
                          return $nodeResource.deleteNode(node);
                      },
                      $displayMessageService.translate("REMOVE SHARE CONFIRMATION", {filename: node.getName()})));
              }
            }

            modalMenuItems.push(menuItemFactory.createMenuItem($displayMessageService.translate('COPY'), !refresh, !hasModal,
                function () {
                    $headerService.updatePasteData({
                        itemInClipboard: true,
                        refresh: true,
                        action: function () {
                            return $nodeResource.copyNode(node);
                        }
                    });
                }));
            return modalMenuItems;
        }
    }
}
