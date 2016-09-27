angular
    .module('nodeOpenService', ['nodeService', 'fileResource', 'cacheService', 'appworksService'])
    .factory('$nodeOpenService', [
        '$q',
        '$nodeService',
        '$displayMessageService',
        '$fileResource',
        '$cacheService',
        '$stateParams',
        '$navigationService',
        '$appworksService',
        '$sessionService',
        $nodeOpenService
    ]);

/**
 *
 * @param $q
 * @param $nodeService
 * @param $displayMessageService
 * @param $fileResource
 * @param $cacheService
 * @param $stateParams
 * @param $navigationService
 * @param $appworksService
 * @returns {{openNode: openNode}}
 */
function $nodeOpenService($q, $nodeService, $displayMessageService, $fileResource, $cacheService, $stateParams, $navigationService, $appworksService, $sessionService) {

    return {
        openNode: openNode
    };

    function openNode(node, rootNode, menuItem) {
        var dataForComponent = {};

        return getNodeToOpen(node).then(nodeDidLoad);

        function nodeDidLoad(nodeToOpen) {

            if (!nodeToOpen.isDocument() && !nodeToOpen.isEmail()) {
                getComponentForOpen(nodeToOpen).then(componentDidLoad);
            } else {

                dataForComponent = {id: nodeToOpen.getID()};

                // dont refresh the list whenever the view is loaded
                //if (menuItem) {
                //    menuItem.setRefresh(true);
                //}

                if (nodeToOpen.isOfflineType()) {
                    $cacheService.isNodeInStorage(nodeToOpen).then(function (nodeIsCached) {
                        if (nodeIsCached) {
                            /**
                             * we have the facility to open document types in the iOS webview, but not android
                             * if we are on android we defer to DCS by default, but first we store a copy locally
                             * so that if the device loses network connectivity we can later perform an Open In action
                             */
                            // we have the facility to open document types in the iOS webview, but not android
                            // so if we are on android we defer to DCS by default
                            if ($appworksService.deviceIsIos()) {
                                $cacheService.openNodeFromStorage(nodeToOpen);
                            } else {
                                $appworksService.openFromAppworks('dcs-component', dataForComponent, true);
                            }

                        } else if ($sessionService.isOnline()) {
                            // store offline available file types when accessing so we can access if the device
                            // later loses network connectivity
                            if ($appworksService.deviceIsIos()) {
                                $fileResource.downloadAndStore(nodeToOpen, true);
                            } else {
                                $fileResource.downloadAndStore(nodeToOpen, false);
                                $appworksService.openFromAppworks('dcs-component', dataForComponent, true);
                            }
                        } else {
                            // use OPEN IN functionality when device is offline
                            $cacheService.doOpenIn(nodeToOpen);
                        }
                    });
                } else {
                    return $appworksService.openFromAppworks('dcs-component', dataForComponent, true);
                }
            }

            function componentDidLoad(component) {
                if (angular.isObject(component)) {

                    dataForComponent = {
                        id: nodeToOpen.getID(),
                        parentID: nodeToOpen.getParentID()
                    };

                    if (component.name == "workflow-component") {
                        dataForComponent.action = 'view';
                    }

                    $appworksService.openFromAppworks(component.name, dataForComponent, true);

                } else if (nodeToOpen.isContainer()) {
                    openContainer(nodeToOpen.getID());
                } else {
                    $displayMessageService.showErrorMessage("ERROR OPEN FAILED");
                }
            }
        }
    }

    function getNodeToOpen(node) {
        var deferred = $q.defer();

        if (node.isShortcut()) {
            $nodeService.getNode(node.getOriginalID()).then(function (nodeSansIsStored) {
                $cacheService.setIsStored(nodeSansIsStored).then(function (nodeWithIsStored) {
                    deferred.resolve(nodeWithIsStored);
                });
            });
        } else {
            deferred.resolve(node);
        }

        return deferred.promise;
    }

    function openContainer(id) {
        $stateParams.id = id;
        return $navigationService.reloadPage();
    }

    function getViewTypesFromComponent(component) {
        var viewTypes = [];

        if (component.properties != null && component.properties.view != null) {
            viewTypes = component.properties.view.split(",");
        }

        return viewTypes;
    }

    function getComponentForOpen(node) {
        var deferred = $q.defer();
        var found = false;

        $appworksService.getComponentList().then(function (components) {

            components.forEach(function (component) {
                var viewTypes = getViewTypesFromComponent(component);

                viewTypes.forEach(function (viewType) {
                    if (node.getSubtype() == parseInt(viewType)) {
                        found = true;
                        deferred.resolve(component);
                    }
                });
            });

            if (!found) {
                deferred.resolve();
            }
        });

        return deferred.promise;
    }
}
