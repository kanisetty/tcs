angular.module('fileResource', ['browseService', 'Request', 'cacheService', 'appworksService'])

		.factory('$fileResource', ['$stateParams', '$sessionService', '$browseService', '$q', 'Request', '$cacheService', '$navigationService','$appworksService',
			function ($stateParams, $sessionService, $browseService, $q, Request, $cacheService, $navigationService, $appworksService) {

				return {

                    addDocument: function(node, file) {
                        var formData = new FormData();
                        formData.append('file', file.getFileBlob(), file.getName());

                        var params = {
                            method: 'POST',
                            url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + node.getID() + '/children',
                            data: formData,
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        };

                        var uploadRequest = new Request(params);

                        return $sessionService.runRequest(uploadRequest);
                    },

					addVersion: function(node, file) {

                        var formData = new FormData();
                        formData.append('file', file.getFileBlob(), file.getName());

                        var params = {
                            method: 'POST',
                            url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + node.getID() + '/content',
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

                    getAddNodeForm: function(dataForDest, refresh) {
                        var destComponentName = 'forms-component';

                        if(dataForDest.id == undefined) {
                            return $q.when($browseService.getRootID($stateParams)).then(function (id) {

                                dataForDest.id = id;

                                $appworksService.openFromAppworks(destComponentName, dataForDest, true).then(function() {
                                        if (refresh)
                                            $navigationService.reloadPage();
                                    }
                                );

                            });
                        }
                        else {
                           $appworksService.openFromAppworks(destComponentName, dataForDest, true).then(function() {
                                    if (refresh)
                                        $navigationService.reloadPage();
                                }
                            );
                        }
                    }
                };
			}]);
