angular.module('nodeService', ['Node', 'Request', 'Sharing', 'nodeResource'])

.factory('$nodeService', ['$q', 'Node', '$rootScope', '$displayMessageService', '$cacheService', 'Sharing', '$nodeResource',
    function($q, Node, $rootScope, $displayMessageService, $cacheService, Sharing, $nodeResource) {
        var _pageNumber;
        var _moreNodesCanBeLoaded;

        var _processResponseForNodeChildren = function(response){
            var nodeChildrenData;
            var nodeChildren = [];

            _moreNodesCanBeLoaded = true;

            if ( response != null && response.contents != null){
				nodeChildrenData = response.contents;
            }else if (response != null && response.resultList != null){
                nodeChildrenData = response.resultList;
            }

            if(nodeChildrenData == null || nodeChildrenData != null && nodeChildrenData.length == 0){
                _moreNodesCanBeLoaded = false;
            }else{
                nodeChildrenData.forEach(function(nodeData){
					var sharing = new Sharing(nodeData);
					nodeChildren.push(new Node(nodeData, sharing));
				});
			}

            return nodeChildren;
        };

        return {

            initialize: function() {
                _pageNumber = 0;
                _moreNodesCanBeLoaded = false;
            },

            addCacheDataToNodeChildren: function(nodeChildren) {
                var promises = [];

                nodeChildren.forEach(function (node) {
                    promises.push($cacheService.setIsStored(node));
                });

                return $q.all(promises);
            },

            canMoreNodesBeLoaded: function () {
                return _moreNodesCanBeLoaded;
            },

            getNode: function (nodeId) {
                var deferred = $q.defer();

                $nodeResource.getNode(nodeId).then(function (response) {

                    if (response.contents[0] == null)
                        $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
                    else{
                        deferred.resolve(new Node(response.contents[0]));
                    }
                });
                return deferred.promise
            },

            getNodeChildren: function (nodeId, filter) {
                var self = this;
                var deferred = $q.defer();
                var pageSize = 25;

                _pageNumber += 1;

                $nodeResource.getNodeChildren(nodeId, filter, pageSize, _pageNumber).then(function(response){

                    self.addCacheDataToNodeChildren(_processResponseForNodeChildren(response)).then(function (nodes) {
                        deferred.resolve(nodes);
                    });
                });

                return deferred.promise;
            },

            getNodeFromQueryString: function(){
                var nodeID = null;
                var queryString = this.getQueryString();
                var queryStringJSON = {};

                if (queryString != null && queryString != ''){

                    if ( typeof(queryString) === 'string') {
                        var pairs = queryString.split("&");
                        var len = pairs.length;
                        var idx, pair, key;

                        // Iterate through each pair and build the array
                        for (idx = 0; idx < len; idx += 1) {
                            pair = pairs[idx].split("=");
                            key = pair[0];

                            switch (typeof queryStringJSON[key]) {
                                // Key has not been found, create entry
                                case "undefined":
                                    queryStringJSON[key] = pair[1];
                                    break;
                                // Key exists, create an array
                                case "string":
                                    queryStringJSON[key] = [queryStringJSON[key], pair[1]];
                                    break;
                                // Add to the array
                                default:
                                    queryStringJSON[key].push(pair[1]);
                            }
                        }

                        if (queryStringJSON != null && queryStringJSON != '' && queryStringJSON.nodeID != null && queryStringJSON.nodeID != 'null') {

                            nodeID = parseInt(queryStringJSON.nodeID);
                        }
                    }
                }

                return nodeID;
            },

            getQueryString: function(){
                return decodeURIComponent(window.location.search.toString().substring(1));
            },

            processResponseForNodeChildren:function(response){
                return _processResponseForNodeChildren(response);
            }
        };
    }]);
