angular.module('nodeOpenService', ['nodeService', 'fileActionService', 'cacheService'])

    .factory('$nodeOpenService', ['$q', '$location', '$nodeService', '$displayMessageService',  '$fileActionService', '$cacheService', '$stateParams', '$navigationService',
        function($q, $location, $nodeService, $displayMessageService, $fileActionService, $cacheService, $stateParams, $navigationService) {

        var _getNodeToOpen = function(node){
            var deferred = $q.defer();

            if (node.getSubtype() == 1) {
                $nodeService.getNode(node.getOriginalID()).then(function(nodeSansIsCached){
                  $cacheService.setIsCached(nodeSansIsCached).then(function(nodeWithIsCached) {
                      deferred.resolve(nodeWithIsCached);
                  });
                });
            }else{
                deferred.resolve(node);
            }

            return deferred.promise;
        };

        var _getComponentForOpen = function(node){
            var deferred = $q.defer();
            var found = false;

            _getComponents().then(function(components){

                components.forEach(function (component) {
                    var viewTypes = _getViewTypesFromComponent(component);

                    viewTypes.forEach(function(viewType){
                        if(node.getSubtype() == parseInt(viewType)){
                            deferred.resolve(component);
                            found = true;
                        }
                    });
                });

                if (!found){
                    deferred.resolve();
                }
            });

            return deferred.promise;
        };

        var _openUsingComponent = function(component, dataForComponent){
            var destComponentName = component.name;
            var destMethod = 'onCallFromApp';
			var refreshOnReturn = false;
			
            var openCompReq = AppWorksComms.getOpenAppRequest(destComponentName, destMethod, dataForComponent, refreshOnReturn);
            AppWorksComms.openApp(openCompReq);
        };

        var _getComponents = function(){
            var deferred = $q.defer();

            try {
                successFn = function () {
                    // Convert the arguments into an array and resolve
                    var args = Array.prototype.slice.call(arguments);
                    if (args[0] != null && args[0].components != null) {
                        deferred.resolve(args[0].components);
                    } else {
                        $displayMessageService.showErrorMessage("ERROR OPEN FAILED");
                    }

                };

                AppWorks.getComponents(successFn);
            }
            catch(error) {
                deferred.resolve([]);
            }
            return deferred.promise;
        };

        var _getViewTypesFromComponent = function(component){
            var viewTypes = [];

            if (component.properties != null && component.properties.view != null){
                viewTypes = component.properties.view.split(",");
            }

            return viewTypes;
        };

        var _openContainer = function(id) {

			$stateParams.id = id;
			return $navigationService.reloadPage();
        };

        return {
            openNode: function (node, rootNode, menuItem) {
                var documentSubtype = 144;
                var emailSubtype = 749;

                return _getNodeToOpen(node).then(function(nodeToOpen){

                    if (nodeToOpen.getSubtype() != documentSubtype && nodeToOpen.getSubtype() != emailSubtype){

                        _getComponentForOpen(nodeToOpen).then(function(component){

                            if(component != null){

                                var dataForComponent = {id: nodeToOpen.getID(), parentID: rootNode.getID()};

                                if (component.name == "workflowview"){
                                    dataForComponent.action = 'view';
                                }

                                _openUsingComponent(component, dataForComponent);
                            }else if (nodeToOpen.isContainer() == true) {
                                _openContainer(nodeToOpen.getID());
                            } else {
                                $displayMessageService.showErrorMessage("ERROR OPEN FAILED");
                            }
                        });
                    }else{
                        if($cacheService.isNodeCachable(nodeToOpen) && nodeToOpen.isCached()) {
                            return $cacheService.openNodeFromCache(nodeToOpen);
                        }
                        else {
                            if(menuItem != null)
                                menuItem.setRefresh(true);

                            return $fileActionService.downloadAndCacheAction(nodeToOpen, true);
                        }
                    }
                });
            }
        }
    }]);
