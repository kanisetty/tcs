angular.module('nodeOpenService', ['nodeService', 'fileResource', 'cacheService', 'appworksService'])

    .factory('$nodeOpenService', ['$q', '$nodeService', '$displayMessageService', '$fileResource', '$cacheService', '$stateParams', '$navigationService',
        '$appworksService', '$httpParamSerializerJQLike',
        function ($q, $nodeService, $displayMessageService, $fileResource, $cacheService, $stateParams, $navigationService, $appworksService, $httpParamSerializerJQLike) {

            var _getNodeToOpen = function (node) {
                var deferred = $q.defer();

                if (node.getSubtype() == 1) {
                    $nodeService.getNode(node.getOriginalID()).then(function (nodeSansIsStored) {
                        $cacheService.setIsStored(nodeSansIsStored).then(function (nodeWithIsStored) {
                            deferred.resolve(nodeWithIsStored);
                        });
                    });
                } else {
                    deferred.resolve(node);
                }

                return deferred.promise;
            };

            var _getComponentForOpen = function (node) {
                var deferred = $q.defer();
                var found = false;

                $appworksService.getComponentList().then(function (components) {

                    components.forEach(function (component) {
                        var viewTypes = _getViewTypesFromComponent(component);

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
            };

            var _getViewTypesFromComponent = function (component) {
                var viewTypes = [];

                if (component.properties != null && component.properties.view != null) {
                    viewTypes = component.properties.view.split(",");
                }

                return viewTypes;
            };

            var _openContainer = function (id) {

                $stateParams.id = id;
                return $navigationService.reloadPage();
            };

            return {

                openNode: function (node, rootNode, menuItem) {
                    var documentSubtype = 144;
                    var emailSubtype = 749;

                    return _getNodeToOpen(node).then(function (nodeToOpen) {

                        if (nodeToOpen.getSubtype() != documentSubtype && nodeToOpen.getSubtype() != emailSubtype) {

                            _getComponentForOpen(nodeToOpen).then(function (component) {

                                if (component !== null) {

                                    var dataForComponent = {id: nodeToOpen.getID(), parentID: rootNode.getID()};
                                    var componentManager = new Appworks.AWComponent();

                                    if (component.name == "workflow-component") {
                                        dataForComponent.action = 'view';
                                    }

                                    componentManager.open(null, null, [component.name, $httpParamSerializerJQLike(dataForComponent)]);

                                } else if (nodeToOpen.isContainer() == true) {
                                    _openContainer(nodeToOpen.getID());
                                } else {
                                    $displayMessageService.showErrorMessage("ERROR OPEN FAILED");
                                }
                            });
                        } else {
                            if ($cacheService.isNodeStorable(nodeToOpen) && nodeToOpen.isStored()) {
                                return $cacheService.openNodeFromStorage(nodeToOpen);
                            } else {
                                if (menuItem != null)
                                    menuItem.setRefresh(true);

                                return $fileResource.downloadAndStore(nodeToOpen, true);
                            }
                        }
                    });
                }
            }
        }]);
