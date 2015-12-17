angular.module('fileResource', ['browseService', 'Request', 'cacheService'])

		.factory('$fileResource', ['$stateParams', '$sessionService', '$browseService', '$q', 'Request', '$cacheService',
			function ($stateParams, $sessionService, $browseService, $q, Request, $cacheService) {

				return {

					addVersion: function(node, file) {

                        var formData = new FormData();
                        formData.append('file', file.getFileBlob());

                        var params = {
                            method: 'POST',
                            url:$sessionService.getContentServerURL() + '/v1/nodes/' + node.getID() + '/versions',
                            data: formData,
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        };

						var uploadRequest = new Request(params);

						return $sessionService.runRequest(uploadRequest);
					},

					downloadAndStore: function(node, doOpen) {
                        var deferred = $q.defer();
                        var nodeID = node.getID();
                        var downloadURL = $sessionService.getContentServerURL() + '/v1/nodes/' + nodeID + '/content';

                        var options = {headers:{'OTCSTICKET': $sessionService.getOTCSTICKET()}};

                        $cacheService.addNodeToStorage(node, downloadURL, options, doOpen);

                        return deferred.promise;
					},

                    getAddNodeForm: function(dataForDest) {
                        var destComponentName = 'forms';
                        var destMethod = 'onCallFromApp';

                        if(dataForDest.id == undefined) {
                            return $q.when($browseService.getRootID($stateParams)).then(function (id) {

                                dataForDest.id = id;

                                var openCompReq = AppWorksComms.getOpenAppRequest(destComponentName, destMethod, dataForDest, true);
                                AppWorksComms.openApp(openCompReq);

                            });
                        }
                        else {
                            var openCompReq = AppWorksComms.getOpenAppRequest(destComponentName, destMethod, dataForDest, true);
                            AppWorksComms.openApp(openCompReq);
                        }
                    }
                };
			}]);
