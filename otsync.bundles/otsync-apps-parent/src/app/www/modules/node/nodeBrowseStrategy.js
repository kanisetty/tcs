angular.module('NodeBrowseStrategy', ['nodeService', 'nodeBrowseDecoratingService', 'NodeHeader', 'headerService', 'nodeMenuService', 'Menu',
                    'WorkflowAttachmentFolderHeader'])
    .factory('NodeBrowseStrategy', ['$q', '$sessionService', '$nodeService', '$nodeBrowseDecoratingService', 'NodeHeader', '$headerService',
        '$nodeMenuService', 'Menu', 'WorkflowAttachmentFolderHeader',
        function($q, $sessionService, $nodeService, $nodeBrowseDecoratingService, NodeHeader, $headerService, $nodeMenuService, Menu,
                 WorkflowAttachmentFolderHeader) {
            var _rootNodeID;
            var _workflowAttachmentFolderSubtype = 154;

            var NodeBrowseStrategy = function(rootName) {
                this.rootName = rootName;
            };

            NodeBrowseStrategy.prototype.initialize = function(){
                $nodeService.initialize();
            };

            NodeBrowseStrategy.prototype.canMoreBeLoaded = function(){
                return $nodeService.canMoreNodesBeLoaded();
            };

			NodeBrowseStrategy.prototype.clickBrowseDecorator = function(root, browseDecorator) {
                var menu = new Menu();
                menu.menuItemClicked($nodeMenuService.getOpenMenuItem("", root, browseDecorator.getDecoratedObject()));
			};

            NodeBrowseStrategy.prototype.getBrowseDecorators = function(root, filter){
                var deferred = $q.defer();
                var browseDecorators;

                $nodeService.getNodeChildren(root.getID(), filter).then(function (nodeChildren) {
                    browseDecorators = $nodeBrowseDecoratingService.decorateNodeChildrenForBrowse(nodeChildren);
                    deferred.resolve(browseDecorators);
                });

                return deferred.promise
            };

            NodeBrowseStrategy.prototype.initializeHeader = function(root){
                var header;
                var addPerms = 0x00004;

                if (root.getSubtype() == _workflowAttachmentFolderSubtype){
                    header = new WorkflowAttachmentFolderHeader(root);
                } else {
                    header = new NodeHeader(root.getName(), (root.getPermissions() & addPerms) == addPerms);
                }

                $headerService.setHeader(header);
            };

			NodeBrowseStrategy.prototype.longPressBrowseDecorator = function(scope, browseDecorator){
                $q.when($sessionService.isOnline()).then(function(isOnline){
					if(isOnline != null && isOnline == false) {

						//do nothing if offline, because all actions other then open are unavailable.
					} else {
						$nodeMenuService.createMenu(scope, browseDecorator.getDecoratedObject());
					}
				});
			};

            NodeBrowseStrategy.prototype.getRoot = function(stateParams){
                var deferred = $q.defer();
				var rootID = stateParams.id;

                if( rootID == null || rootID.length == 0) {

                    $q.when(this.getRootID(stateParams)).then(function(id) {
                        $nodeService.getNode(id).then(function (root) {

                            deferred.resolve(root);
                        });
                    })
                } else {

                    $nodeService.getNode(rootID).then(function (root) {

                        deferred.resolve(root);
                    });
                }

                return deferred.promise
            };

            NodeBrowseStrategy.prototype.getRootID = function(stateParams) {
                var rootName = this.rootName;
                var deferred = $q.defer();

				if(stateParams == null || stateParams.id == null  || stateParams.id.length == 0) {

					_rootNodeID = $nodeService.getNodeFromQueryString();

					if(_rootNodeID != null) {

						deferred.resolve(_rootNodeID);
					} else {

                        deferred.resolve($sessionService.getRootID(rootName));
					}
				} else {
					deferred.resolve(stateParams.id);
				}

				return deferred.promise
            };

            return NodeBrowseStrategy;
        }]);
