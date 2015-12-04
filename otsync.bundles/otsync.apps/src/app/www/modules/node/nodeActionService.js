angular.module('nodeActionService', ['urlEncodingService', 'browseService', 'Request'])

    .factory('$nodeActionService', ['$sessionService', '$urlEncode', '$browseService', '$stateParams', '$q', 'Request',
        function ($sessionService, $urlEncode, $browseService, $stateParams, $q, Request) {

			return {

				addFavoriteAction: function (node) {

					var requestParams = {
						method: 'POST',
						url: $sessionService.getGatewayURL() + '/favorites/v5/favorites',
						headers: {'Content-Type': 'application/x-www-form-urlencoded'},
						data: $urlEncode({nodeID: node.getID()})
					};

					var request = new Request(requestParams);

					return $sessionService.runRequest(request);

				},

				copyNodeAction: function (node) {

					return $q.when($browseService.getRootID($stateParams)).then(function(destNodeId) {

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

				deleteNodeAction: function (node) {

					var requestParams = {
						method: 'DELETE',
						url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + node.getID(),
						headers: {'Content-Type': 'application/json; charset=utf-8'}
					};

					var request = new Request(requestParams);

					return $sessionService.runRequest(request);

				},

				getPropertiesAction: function(){

					var requestParams = {
						method: 'GET',
						url: $sessionService.getGatewayURL() + '/content/v5/properties/',
						headers: {'Content-Type': 'application/json; charset=utf-8'}
					};

					var request = new Request(requestParams);

					return $sessionService.runRequest(request);
				},

				getObjectDetailsAction: function(node){
					var destComponentName = 'objectdetailsview';
					var destMethod = 'onCallFromApp';
					var dataForDest = { 'id' : node.getID() };

					var openCompReq = AppWorksComms.getOpenAppRequest(destComponentName, destMethod, dataForDest, false);
					AppWorksComms.openApp(openCompReq);
				},

				moveNodeAction: function (node) {
					return $q.when($browseService.getRootID($stateParams)).then(function(destNodeId) {

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

				removeFavoriteAction: function (node) {

					var requestParams = {
						method: 'DELETE',
						url: $sessionService.getGatewayURL() + '/favorites/v5/favorites/' + node.getID(),
						headers: {'Content-Type': 'application/json; charset=utf-8'}
					};

					var request = new Request(requestParams);

					return $sessionService.runRequest(request);
				},

				reserveNodeAction: function (node) {

					var requestParams = {
						method: 'PUT',
						url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + node.getID(),
						headers: {'Content-Type': 'application/x-www-form-urlencoded'},
						params: {reserve: true}
					};

					var request = new Request(requestParams);

					return $sessionService.runRequest(request);
				},

				unreserveNodeAction: function (node) {

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
    	}]);
