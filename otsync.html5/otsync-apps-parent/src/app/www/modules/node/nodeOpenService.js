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

                dataForComponent = {id: nodeToOpen.getID(), name: encodeURI(nodeToOpen.getName())};

                if (nodeToOpen.isOfflineType()) {
                    $cacheService.isNodeInStorage(nodeToOpen).then(function (documentIsStoredOnDevice) {
                        if ($sessionService.isOnline()) {
                            if ($appworksService.deviceIsIos()) {
                                if (documentIsStoredOnDevice) {
                                    // open in webview straight away
                                    $cacheService.openNodeFromStorage(nodeToOpen);
                                } else {
                                    // download first, then open in webview
                                    $fileResource.downloadAndStore(nodeToOpen, true);
                                }
                            } else {
                                // store the file for later use TODO should it be stored for favorites only?
                                $fileResource.downloadAndStore(nodeToOpen, false);
                                // fallback is to use the dcs component to render the file
                                $appworksService.openFromAppworks('dcs-component', dataForComponent, true);
                            }
                        } else {
                            if (documentIsStoredOnDevice) {
                                if ($appworksService.deviceIsIos()) {
                                    // open in webview straight away
                                    $cacheService.openNodeFromStorage(nodeToOpen);
                                } else {
                                    // invoke open in to open this file in another application
                                    $cacheService.doOpenIn(nodeToOpen);
                                }
                            } else {
                                // display an error message to the user
                                $displayMessageService.showErrorMessage('You must get online to view this file', 'Offline');
                            }
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
