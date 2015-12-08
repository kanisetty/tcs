angular.module('requestService', ['cacheService', 'angular-appworks', 'tokenService'])

    .factory('$requestService', ['$q', '$rootScope', '$displayMessageService', '$cacheService', '$sessionService', '$http', '$auth', '$tokenService',
			function($q, $rootScope, $displayMessageService, $cacheService, $sessionService, $http, $auth, $tokenService){

				return {

					doRequest: function(requestParams){
						var deferred = $q.defer();
						var error = {};

						requestParams.type = requestParams.method;
						requestParams.queryParams = requestParams.params;

						$http(requestParams).then(function(response) {
								if (response.ok != undefined && response.ok == false) {
									if (response.auth == false) {
										error.status = 401;
										deferred.reject(error);
									} else {
										error.message = response;
										deferred.reject(error);
									}
								} else {
									deferred.resolve(response.data);
								}
						}, function(error) {
								if (error.status == 0) {
									error.message = $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION');
								}
								deferred.reject(error);
						});

						return deferred.promise
					},

					reauthUpdateTicket: function() {

						return $auth.reauth().then(function(){
							$http.defaults.headers.common.OTCSTICKET = $tokenService.getOTCSTICKET();
						});
					},

					runRequestWithAuth: function(request) {
						var responseData;
						var deferred = $q.defer();
						var self = this;

						request.doRequest().then(function(response) {

							if (response.responseJson != null)
								responseData = response.responseJson;
							else
								responseData = response;

							if (responseData.ok != undefined && responseData.ok == false) {
								if (responseData.auth == false) {
									self.reauthUpdateTicket().then(function() {
										request.doRequest().then(function(response) {
											deferred.resolve(response);
										},function(error) {
											if(error.status != null && error.status == 401) {
												$rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR AUTHENTICATION FAILED')});
											} else if (error.status != null && error.status != 0 ){
												var errMsg = error.status + ' ' + error.statusText;
												$rootScope.$broadcast('serverError', {errMsg: errMsg});
											} else {
												$rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
											}

											deferred.reject(error);
										});
									}, function(error) {
										$rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
										deferred.reject(error);
									});
								} else {
									deferred.reject(responseData);
									$rootScope.$broadcast('serverError', {errMsg: responseData.errMsg});
								}
							} else
								deferred.resolve(responseData);
						}, function(error) {
							if(error.status != null && error.status == 401) {
								self.reauthUpdateTicket().then(function() {
									request.doRequest().then(function(response) {
										deferred.resolve(response);
									},function(error) {
										if(error.status != null && error.status == 401) {
											$rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR AUTHENTICATION FAILED')});
										} else if (error.status != null && error.status != 0 ){
											var errMsg = error.status + ' ' + error.statusText;
											$rootScope.$broadcast('serverError', {errMsg: errMsg});
										} else {
											$rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
										}

										deferred.reject(error);
									});
								}, function(error) {
									$rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
									deferred.reject(error);
								});
							} else{
								if (error.status != null && error.status != 0 ){
									var errMsg = error.status + ' ' + error.statusText;
									$rootScope.$broadcast('serverError', {errMsg: errMsg});
								} else {
									$rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
								}

								deferred.reject(error);
							}
						});

						return deferred.promise
					}
				};
			}]);

