angular.module('fileActionService', ['browseService', 'Request'])

		.factory('$fileActionService', ['$stateParams', '$sessionService', '$browseService', '$q', 'Request', '$urlEncode',
			function ($stateParams, $sessionService, $browseService, $q, Request, $urlEncode) {

				return {

					addVersionAction: function(node, file) {

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

					downloadAndCacheAction: function(node, doOpen) {
                        //TODO: cache not implemented by appworks.  Currently using HTML5 local storage.
                        var deferred = $q.defer();
                        var nodeID = node.getID();
                        var fileName = node.getName();
                        var downloadURL = $sessionService.getContentServerURL() + '/v1/nodes/' + nodeID + '/content';

                        var options = {headers:{'OTCSTICKET': $sessionService.getOTCSTICKET()}};

                        var success = function() {
                            if (doOpen) {
                                appworks.storage.getFile(fileName, function (dataURL) {
                                    window.open(dataURL, '_blank', 'EnableViewPortScale=yes');
                                    deferred.resolve();
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                deferred.resolve();
                            }
                        };

                        var error = function (error) {
                            deferred.reject(error);
                        };
                        appworks.storage.storeFile(fileName, downloadURL, success, error, options, true)

                        return deferred.promise;
					},

					downloadToDestinationAction: function(node, destination) {
                        var deferred = $q.defer();
                        var nodeID = node.getID();
                        var fileName = node.getName();
                        var downloadURL = $sessionService.getContentServerURL() + '/v1/nodes/' + nodeID + '/content';

                        var options = {headers:{'OTCSTICKET': $sessionService.getOTCSTICKET()}};

                        var success = function() {
                            deferred.resolve();
                        };

                        var error = function (error) {
                            deferred.reject(error);
                        };
                        appworks.storage.storeFile(fileName, downloadURL, success, error, options, true)

                        return deferred.promise;
					},

                    getAddNodeFormAction: function(dataForDest) {
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
