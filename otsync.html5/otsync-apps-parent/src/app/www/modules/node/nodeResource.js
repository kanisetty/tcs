angular
    .module('nodeResource', [
        'urlEncodingService',
        'browseService',
        'Request'
    ])
    .factory('$nodeResource', [
        '$sessionService',
        '$urlEncode',
        '$browseService',
        '$stateParams',
        '$q',
        'Request',
        $nodeResource
    ]);

function $nodeResource($sessionService, $urlEncode, $browseService, $stateParams, $q, Request) {

    return {

        addFolder: function (root, name) {

            var requestParams = {
                method: 'POST',
                url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + root.getID() + '/children',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $urlEncode({name: name})
            };

            var request = new Request(requestParams);

            return $sessionService.runRequest(request);
        },

        copyNode: function (node) {

            return $q.when($browseService.getRootID($stateParams)).then(function (destNodeId) {

                var requestParams = {
                	method: 'POST',
                	url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + destNodeId + '/children',
                	headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                	data: $urlEncode({
                		copyFrom: node.getID(),
                		name: node.getName()
                	})
                };

                var request = new Request(requestParams);

                return $sessionService.runRequest(request);
            });
        },

        deleteNode: function (node) {

            var requestParams = {
                method: 'DELETE',
                url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + node.getID(),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            };

            var request = new Request(requestParams);

            return $sessionService.runRequest(request);

        },

        getNode: function (nodeId) {

            var requestParams = {
                method: 'GET',
                url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + nodeId,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            };

            var request = new Request(requestParams);

            return $sessionService.runRequest(request);
        },

        getNodeChildren: function (nodeId, filter, pageSize, pageNumber) {

            var fields = "?fields=id,parentID,name,subtype,mimeType,childCount,dataSize,modifyDate,isShared,modifyUserName,modifyUser,modifyUserID,sharedFolder,isShareable,isRootShare,isReadOnly,versionNum,dataHash,isNotifySet,isSubscribed,isContainer,originSubtype,originTypeName,originDataID,thumbnailEnabled,rootType,numComments,isFavorite,permissions,userID,ownerUser,ownerName,createdByUser,shareClass,isReservable,reservedByUserName,displayCreateDate,displayModifyDate,nodeCreatedDate,nodeModifiedDate,parentCreatedDate,parentModifiedDate,isHidden,iconURL,HASTASKS";

            var requestParams = {
                method: 'GET',
                url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + nodeId + '/children' + fields,
                headers: {'Content-Type': 'application/json; charset=utf-8'},
                params: {pageNumber: pageNumber, pageSize: pageSize, type: $sessionService.getClientType()}
            };

            if (filter != null && filter.length > 0) {
                requestParams.params.filter = filter;
            }

            $urlEncode(requestParams.params);

            var request = new Request(requestParams);

            return $sessionService.runRequest(request);
        },

        moveNode: function (node) {
            return $q.when($browseService.getRootID($stateParams)).then(function (destNodeId) {

                var requestParams = {
                    method: 'PUT',
                    url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + node.getID(),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    params: {parentID: destNodeId, name: node.getName()}
                };

                var request = new Request(requestParams);

                return $sessionService.runRequest(request);
            });
        },

        reserveNode: function (node) {

            var requestParams = {
                method: 'PUT',
                url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + node.getID(),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: {reserve: true}
            };

            var request = new Request(requestParams);

            return $sessionService.runRequest(request);
        },

        unreserveNode: function (node) {

            var requestParams = {
                method: 'PUT',
                url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + node.getID(),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: {reserve: false}
            };

            var request = new Request(requestParams);

            return $sessionService.runRequest(request);
        }
    };
}
