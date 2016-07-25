angular.module('requestService', ['cacheService', 'appworksService'])

    .factory('$requestService', ['$q', '$rootScope', '$displayMessageService', '$http', '$appworksService',
        function ($q, $rootScope, $displayMessageService, $http, $appworksService) {

            return {

                doRequest: function (requestParams, forceAuth) {
                    var deferred = $q.defer();
                    var error = {};
                    var auth = new Appworks.Auth(function (authResponse) {
                        requestParams.type = requestParams.method;
                        requestParams.queryParams = requestParams.params;
                        requestParams.headers = authResponse.authData.authorizationHeader;

                        $http(requestParams).then(function (response) {
                            if (response.ok != undefined && response.ok == false) {
                                if (response.auth == false) {
                                    error.status = 401;
                                    deferred.reject(error);
                                    doRequest(requestParams, true);
                                } else {
                                    error.message = response;
                                    deferred.reject(error);
                                }
                            } else {
                                deferred.resolve(response.data);
                            }
                        }, function (error) {
                            if (error.status == 0) {
                                error.message = $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION');
                            } else if (error.status != 401 && error.status != 0) {
                                error.message = error.status + ' ' + error.statusText;
                            }

                            $rootScope.$broadcast('serverError', {errMsg: error.message});

                            deferred.reject(error);
                        });
                    });

                    auth.authenticate(forceAuth);

                    return deferred.promise
                },

                reauthUpdateTicket: function () {

                    return $appworksService.authenticate();
                },

                runRequestWithAuth: function (request) {
                    var responseData;
                    var deferred = $q.defer();
                    var self = this;

                    request.doRequest().then(function (response) {

                        if (response.responseJson != null)
                            responseData = response.responseJson;
                        else
                            responseData = response;

                        if (responseData.ok != undefined && responseData.ok == false) {
                            if (responseData.auth == false) {
                                self.reauthUpdateTicket().then(function () {
                                    request.doRequest().then(function (response) {
                                        deferred.resolve(response);
                                    }, function (error) {
                                        if (error.status != null && error.status == 401) {
                                            $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR AUTHENTICATION FAILED')});
                                        }
                                        deferred.reject(error);
                                    });
                                }, function (error) {
                                    $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
                                    deferred.reject(error);
                                });
                            } else {
                                $rootScope.$broadcast('serverError', {errMsg: responseData.errMsg});
                                deferred.reject(responseData);
                            }
                        } else if (responseData.hash != undefined && responseData.hash.error != undefined) {
                            $rootScope.$broadcast('serverError', {errMsg: responseData.hash.error});
                            deferred.reject(responseData);
                        } else {
                            deferred.resolve(responseData);
                        }
                    }, function (error) {
                        if (error.status != null && error.status == 401) {
                            self.reauthUpdateTicket().then(function () {
                                request.doRequest().then(function (response) {
                                    deferred.resolve(response);
                                }, function (error) {
                                    if (error.status != null && error.status == 401) {
                                        $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR AUTHENTICATION FAILED')});
                                    }
                                    deferred.reject(error);
                                });
                            }, function (error) {
                                $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
                                deferred.reject(error);
                            });
                        } else {
                            deferred.reject(error);
                        }
                    });

                    return deferred.promise
                }
            };
        }]);

