angular.module('nodeOpenService', ['nodeService', 'fileResource', 'cacheService', 'appworksService'])

    .factory('$nodeOpenService', [
        '$q',
        '$nodeService',
        '$displayMessageService',
        '$fileResource',
        '$cacheService',
        '$stateParams',
        '$navigationService',
        '$appworksService',
        '$httpParamSerializerJQLike',
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
                    var dataForComponent;

                    return _getNodeToOpen(node).then(function (nodeToOpen) {

                        if (nodeToOpen.getSubtype() != documentSubtype && nodeToOpen.getSubtype() != emailSubtype) {

                            _getComponentForOpen(nodeToOpen).then(function (component) {

                                if (angular.isObject(component)) {

                                    dataForComponent = {id: nodeToOpen.getID(), parentID: rootNode.getID()};

                                    if (component.name == "workflow-component") {
                                        dataForComponent.action = 'view';
                                    }

                                    $appworksService.openFromAppworks(component.name, dataForComponent, true);

                                } else if (nodeToOpen.isContainer() == true) {
                                    _openContainer(nodeToOpen.getID());
                                } else {
                                    $displayMessageService.showErrorMessage("ERROR OPEN FAILED");
                                }
                            });
                        } else {
                            dataForComponent = {id: nodeToOpen.getID()};

                            $appworksService.openFromAppworks('dcs-component', dataForComponent, true);

                            if (menuItem) {
                                menuItem.setRefresh(true);
                            }
                        }
                    });
                }
            }
        }]);
