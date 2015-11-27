var unAuthHeaderWarning = "1;Session Expired";
var errorRetrievingFileHeaderWarning= "2;Error Retrieving File";

describe('requestService doDownloadRequest tests', function(){
    var $q, $displayMessageService, $rootScope, $requestService, $tokenService, $cacheService, $sessionService, AppWorksFacade;

    beforeEach(module('requestService', 'displayMessageService'));

    beforeEach(function(){
        $tokenService = {};
        $cacheService = {
            evictNode: function(){}
        };
        $sessionService = {
            getCSToken: function(){}
        };
        AppWorksFacade = {
            createDownloadRequest: function(){},
            downloadFile: function(){}
        };

        $displayMessageService = {
            translate: function(message){
                return message;
            }
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$tokenService', $tokenService);
            $provide.value('$cacheService', $cacheService);
            $provide.value('$sessionService', $sessionService);
            $provide.value('AppWorksFacade', AppWorksFacade);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$q_, _$rootScope_, _$requestService_){
            $q = _$q_;
            $rootScope = _$rootScope_;
            $requestService = _$requestService_;
        });
    });

    it('should return an error if createDownloadRequest throws an error', function() {
        var mockError = 'Some Error';
        var dummyDownloadURL = '';
        var dummyFileName = '';
        var dummyCacheRequest = null;
        var dummyDestination = '';
        var _error = '';

        spyOn(AppWorksFacade, 'createDownloadRequest').andCallFake(function(){
            throw new Error( mockError );
        });

        spyOn($cacheService, 'evictNode').andCallFake(function(dlRequest, success, error){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.doDownloadRequest(dummyDownloadURL, dummyFileName, dummyCacheRequest, dummyDestination).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($cacheService.evictNode).not.toHaveBeenCalled();
        expect(_error.message).toEqual(mockError);
    });

    it('should return an error if downloadFile executes the error callback an error', function() {
        var mockError = {
            message: 'Some Error'
        };
        var dummyDownloadURL = '';
        var dummyFileName = '';
        var dummyCacheRequest = null;
        var dummyDestination = '';
        var _error = null;

        spyOn(AppWorksFacade, 'downloadFile').andCallFake(function(dlRequest, success, error){
            error( mockError );
        });

        spyOn($cacheService, 'evictNode').andCallFake(function(dlRequest, success, error){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.doDownloadRequest(dummyDownloadURL, dummyFileName, dummyCacheRequest, dummyDestination).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(_error).toEqual(mockError);
    });

    it('should return a 401 if the request was successful but there was a warning header with an unauthorized message. No eviction is needed.', function() {
        var dummyDownloadURL = '';
        var dummyFileName = '';
        var dummyCacheRequest = null;
        var dummyDestination = '';
        var mockData = {
            headers: {
                Warning: unAuthHeaderWarning
            }
        };
        var _error = null;

        spyOn(AppWorksFacade, 'downloadFile').andCallFake(function(dlRequest, success, error){
            success( mockData );
        });

        spyOn($cacheService, 'evictNode').andCallFake(function(dlRequest, success, error){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.doDownloadRequest(dummyDownloadURL, dummyFileName, dummyCacheRequest, dummyDestination).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($cacheService.evictNode).not.toHaveBeenCalled();
        expect(_error.status).toEqual(401);
    });

    it('should return a 401 if the request was successful but there was a warning header with an unauthorized message. We should also evict the cache.', function() {
        var dummyDownloadURL = '';
        var dummyFileName = '';
        var dummyCacheRequest = "Some cache request";
        var dummyDestination = '';
        var mockData = {
            headers: {
                Warning: unAuthHeaderWarning
            }
        };
        var _error = null;

        spyOn(AppWorksFacade, 'downloadFile').andCallFake(function(dlRequest, success, error){
            success( mockData );
        });

        spyOn($cacheService, 'evictNode').andCallFake(function(dlRequest, success, error){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.doDownloadRequest(dummyDownloadURL, dummyFileName, dummyCacheRequest, dummyDestination).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($cacheService.evictNode).toHaveBeenCalled();
        expect(_error.status).toEqual(401);
    });

    it('should return a 404 if the request was successful but there was a warning header with an error retrieving file message. No eviction is needed.', function() {
        var dummyDownloadURL = '';
        var dummyFileName = '';
        var dummyCacheRequest = null;
        var dummyDestination = '';
        var mockData = {
            headers: {
                Warning: errorRetrievingFileHeaderWarning
            }
        };
        var _error = null;

        spyOn(AppWorksFacade, 'downloadFile').andCallFake(function(dlRequest, success, error){
            success( mockData );
        });

        spyOn($cacheService, 'evictNode').andCallFake(function(dlRequest, success, error){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.doDownloadRequest(dummyDownloadURL, dummyFileName, dummyCacheRequest, dummyDestination).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($cacheService.evictNode).not.toHaveBeenCalled();
        expect(_error.status).toEqual(404);
    });

    it('should return a 404 if the request was successful but there was a warning header with an error retrieving file message. Eviction is needed.', function() {
        var dummyDownloadURL = '';
        var dummyFileName = '';
        var dummyCacheRequest = "Some cache request";
        var dummyDestination = '';
        var mockData = {
            headers: {
                Warning: errorRetrievingFileHeaderWarning
            }
        };
        var _error = null;

        spyOn(AppWorksFacade, 'downloadFile').andCallFake(function(dlRequest, success, error){
            success( mockData );
        });

        spyOn($cacheService, 'evictNode').andCallFake(function(dlRequest, success, error){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.doDownloadRequest(dummyDownloadURL, dummyFileName, dummyCacheRequest, dummyDestination).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($cacheService.evictNode).toHaveBeenCalled();
        expect(_error.status).toEqual(404);
    });

    it('should return data if the request was successful and there were no header warnings.', function() {
        var dummyDownloadURL = '';
        var dummyFileName = '';
        var dummyCacheRequest = null;
        var dummyDestination = '';
        var mockData = {
            headers: {
                Warning: null
            }
        };
        var _data = null;

        spyOn(AppWorksFacade, 'downloadFile').andCallFake(function(dlRequest, success, error){
            success( mockData );
        });

        spyOn($cacheService, 'evictNode').andCallFake(function(dlRequest, success, error){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.doDownloadRequest(dummyDownloadURL, dummyFileName, dummyCacheRequest, dummyDestination).then(function(data){
                _data = data;
            },
            function(error){});

        $rootScope.$digest();

        expect($cacheService.evictNode).not.toHaveBeenCalled();
        expect(_data).toEqual(mockData);
    });
});

describe('requestService doRequest tests', function(){
    var $q, $displayMessageService, $rootScope, $requestService, $tokenService, $cacheService, $sessionService, AppWorksFacade, dummyRequestParams;

    var newToken = "someNewToken";

    beforeEach(module('requestService', 'displayMessageService'));

    beforeEach(function(){
        $cacheService = {};
        AppWorksFacade = {
            execCordovaRequestWithJSONCallbacks: function(){}
        };
        $sessionService = {};

        $tokenService = {
            getCSToken: function(){
                return newToken;
            }
        };

        $displayMessageService = {
            translate: function(message){
                return message;
            }
        };

        dummyRequestParams = {
            method: 'POST',
            url: '/favorites/v1/favorites',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', OTCSTICKET: "someToken"},
            data: {nodeID: 1234}
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$tokenService', $tokenService);
            $provide.value('$cacheService', $cacheService);
            $provide.value('$sessionService', $sessionService);
            $provide.value('AppWorksFacade', AppWorksFacade);
            $provide.value('$tokenService', $tokenService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$q_, _$rootScope_, _$requestService_){
            $q = _$q_;
            $rootScope = _$rootScope_;
            $requestService = _$requestService_;
        });
    });

    it('should return a 401 error if we were not authorized by the appworks server. Ticket should be updated before request is made.', function() {
        var mockError = {
            status: 401
        };
        var _error = '';

        spyOn(AppWorksFacade, 'execCordovaRequestWithJSONCallbacks').andCallFake(function(namespace, functionName, params){
            params[0].error( mockError );
        });

        $requestService.doRequest(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(dummyRequestParams.headers.OTCSTICKET).toEqual(newToken);
        expect(_error.status).toEqual(401);
    });

    it('should return an ERROR UNABLE TO PERFORM ACTION if a staus of 0 is returned from the appworks server.', function() {
        var mockError = {
            status: 0
        };
        var _error = '';

        spyOn(AppWorksFacade, 'execCordovaRequestWithJSONCallbacks').andCallFake(function(namespace, functionName, params){
            params[0].error( mockError );
        });

        $requestService.doRequest(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(dummyRequestParams.headers.OTCSTICKET).toEqual(newToken);
        expect(_error.status).toEqual(0);
        expect(_error.message).toEqual('ERROR UNABLE TO PERFORM ACTION');
    });

    it('should return a 401 if the request to the server was successful but content server returned unauthorized.', function() {
        var mockResponse = {
            ok: false,
            auth: false
        };
        var _error = '';

        spyOn(AppWorksFacade, 'execCordovaRequestWithJSONCallbacks').andCallFake(function(namespace, functionName, params){
            params[0].success( mockResponse );
        });

        $requestService.doRequest(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(dummyRequestParams.headers.OTCSTICKET).toEqual(newToken);
        expect(_error.status).toEqual(401);
    });

    it('should return the error message from content server if it was not an auth failure.', function() {
        var mockResponse = {
            ok: false,
            auth: true,
            message: "SomeMessage"
        };
        var _error = '';

        spyOn(AppWorksFacade, 'execCordovaRequestWithJSONCallbacks').andCallFake(function(namespace, functionName, params){
            params[0].success( mockResponse );
        });

        $requestService.doRequest(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(dummyRequestParams.headers.OTCSTICKET).toEqual(newToken);
        expect(_error.message).toEqual(mockResponse);
    });

    it('should return the response from the server if there was no error.', function() {
        var mockResponse = {
            ok: true,
            auth: true,
            message: "SomeMessage"
        };

        var _response = '';

        spyOn(AppWorksFacade, 'execCordovaRequestWithJSONCallbacks').andCallFake(function(namespace, functionName, params){
            params[0].success( mockResponse );
        });

        $requestService.doRequest(dummyRequestParams).then(function(response){
                _response = response;
            },
            function(error){});

        $rootScope.$digest();

        expect(dummyRequestParams.headers.OTCSTICKET).toEqual(newToken);
        expect(_response).toEqual(mockResponse);
    });
});

describe('requestService doRequestWithUpload tests', function(){
    var $q, $displayMessageService, $rootScope, $requestService, $tokenService, $cacheService, $sessionService, AppWorksFacade, dummyRequestParams;

    var newToken = "someNewToken";

    beforeEach(module('requestService', 'displayMessageService'));

    beforeEach(function(){
        $cacheService = {};
        AppWorksFacade = {
            createFormField: function(){},
            createUploadRequest: function(){},
            uploadFile: function(){}
        };

        $sessionService = {
			getCSToken: function(){}
		};
        $tokenService = {};

        $displayMessageService = {
            translate: function(message){
                return message;
            }
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$tokenService', $tokenService);
            $provide.value('$cacheService', $cacheService);
            $provide.value('$sessionService', $sessionService);
            $provide.value('AppWorksFacade', AppWorksFacade);
            $provide.value('$tokenService', $tokenService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$q_, _$rootScope_, _$requestService_){
            $q = _$q_;
            $rootScope = _$rootScope_;
            $requestService = _$requestService_;
        });
    });

    it('should return the ERROR UNABLE TO PERFORM ACTION error message if createFormField throws an error.', function() {
        var mockError = {
            status: 403
        };
        var _error = '';

        spyOn(AppWorksFacade, 'createFormField').andCallFake(function(){
            throw new Error( mockError );
        });

        $requestService.doRequestWithUpload(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(_error.message).toEqual('ERROR UNABLE TO PERFORM ACTION');
    });

    it('should return the ERROR UNABLE TO PERFORM ACTION error message if createUploadRequest throws an error.', function() {
        var mockError = {
            status: 403
        };
        var _error = '';

        spyOn(AppWorksFacade, 'createUploadRequest').andCallFake(function(){
            throw new Error( mockError );
        });

        $requestService.doRequestWithUpload(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(_error.message).toEqual('ERROR UNABLE TO PERFORM ACTION');
    });

    it('should return the error message from the upload if one was returned.', function() {
        var mockError = {
            status: 403
        };
        var _error = '';

        spyOn(AppWorksFacade, 'uploadFile').andCallFake(function(uploadRequest, successCallback, errorCallback){
            errorCallback(mockError);
        });

        $requestService.doRequestWithUpload(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(_error).toEqual(mockError);
    });

    it('should return a 401 if the request was successful but returned the unauthorized warning header.', function() {
        var mockData = {
            headers: {
                Warning: unAuthHeaderWarning
            }
        };

        var _error = '';

        spyOn(AppWorksFacade, 'uploadFile').andCallFake(function(uploadRequest, successCallback, errorCallback){
            successCallback(mockData);
        });

        $requestService.doRequestWithUpload(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(_error.status).toEqual(401);
    });

    it('should return a 404 if the request was successful but returned the error retrieving file warning header.', function() {
        var mockData = {
            headers: {
                Warning: errorRetrievingFileHeaderWarning
            }
        };

        var _error = '';

        spyOn(AppWorksFacade, 'uploadFile').andCallFake(function(uploadRequest, successCallback, errorCallback){
            successCallback(mockData);
        });

        $requestService.doRequestWithUpload(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect(_error.status).toEqual(404);
    });

    it('should return the data if no errors occurred.', function() {
        var mockData = {
            headers: {
                Warning: null
            }
        };

        var _response = '';

        spyOn(AppWorksFacade, 'uploadFile').andCallFake(function(uploadRequest, successCallback, errorCallback){
            successCallback(mockData);
        });

        $requestService.doRequestWithUpload(dummyRequestParams).then(function(response){
                _response = response;
            },
            function(error){});

        $rootScope.$digest();

        expect(_response).toEqual(mockData);
    });
});

describe('requestService getWarningHeaderError tests', function(){
	var $q, $displayMessageService, $rootScope, $requestService, $tokenService, $cacheService, $sessionService, AppWorksFacade;

	beforeEach(module('requestService', 'displayMessageService'));

	beforeEach(function(){
		$tokenService = {};
		$cacheService = {};
		$sessionService = {};
		AppWorksFacade = {};

		$displayMessageService = {
			translate: function(message){
				return message;
			}
		};

		module(function ($provide) {
			$provide.value('$displayMessageService', $displayMessageService);
			$provide.value('$tokenService', $tokenService);
			$provide.value('$cacheService', $cacheService);
			$provide.value('$sessionService', $sessionService);
			$provide.value('AppWorksFacade', AppWorksFacade);
		});

		// The injector unwraps the underscores (_) from around the parameter names when matching
		inject(function(_$q_, _$rootScope_, _$requestService_){
			$q = _$q_;
			$rootScope = _$rootScope_;
			$requestService = _$requestService_;
		});
	});

	it('should return UNAUTHORIZED_ERROR_TYPE (1) if the unauthorized header warning was returned', function() {
		var headers = {};
		var expectedErrorType = 1;

		headers.Warning = unAuthHeaderWarning;

		var errorType = $requestService.getWarningHeaderError(headers);

		expect(errorType).toEqual(expectedErrorType);
	});

	it('should return ERROR_RETRIEVING_FILE_ERROR_TYPE (2) if the error retrieving file header warning was returned', function() {
		var headers = {};
		var expectedErrorType = 2;

		headers.Warning = errorRetrievingFileHeaderWarning;

		var errorType = $requestService.getWarningHeaderError(headers);

		expect(errorType).toEqual(expectedErrorType);
	});

	it('should return null if the no header warning was returned', function() {
		var headers = {};
		var expectedErrorType = null;

		headers.Warning = null;

		var errorType = $requestService.getWarningHeaderError(headers);

		expect(errorType).toEqual(expectedErrorType);
	});
});

describe('requestService runRequestWithAuth tests', function(){
    var $q, $displayMessageService, $rootScope, $requestService, $tokenService, $cacheService, $sessionService, AppWorksFacade, dummyRequestParams, Request;

    beforeEach(module('requestService', 'displayMessageService', 'Request'));

    beforeEach(function(){
        $tokenService = {};
        $cacheService = {};
        $sessionService = {};
        AppWorksFacade = {};

        $displayMessageService = {
            translate: function(message){
                return message;
            }
        };

        dummyRequestParams = {
            method: 'POST',
            url: '/favorites/v1/favorites',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', OTCSTICKET: "someToken"},
            data: {nodeID: 1234}
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$tokenService', $tokenService);
            $provide.value('$cacheService', $cacheService);
            $provide.value('$sessionService', $sessionService);
            $provide.value('AppWorksFacade', AppWorksFacade);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$q_, _$rootScope_, _$requestService_, _Request_){
            $q = _$q_;
            $rootScope = _$rootScope_;
            $requestService = _$requestService_;
            Request = _Request_;
        });
    });

    it('should broadcast and return the ERROR UNABLE TO PERFORM ACTION message when the request function returns an error that is not a 401', function() {
        var request = new Request(dummyRequestParams);
        var mockError = {
            status: 0
        };

        var _error = null;

        spyOn($requestService, 'doRequest').andCallFake(function(){
            var deferred = $q.defer();
            deferred.reject(mockError);
            return deferred.promise;
        });

        spyOn($displayMessageService, 'translate');

        $requestService.runRequestWithAuth(request).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($displayMessageService.translate).toHaveBeenCalledWith('ERROR UNABLE TO PERFORM ACTION');
        expect(_error).toEqual(mockError);
    });

    it('should broadcast and return the ERROR UNABLE TO PERFORM ACTION message if we fail while trying to reauthenticate a failed request', function() {
        var request = new Request(dummyRequestParams);
        var mockRequestError = {
            status: 401
        };

        var mockAuthError = {
            message: "SomeAuthError"
        };

        var _error = null;

        spyOn($requestService, 'doRequest').andCallFake(function(){
            var deferred = $q.defer();
            deferred.reject(mockRequestError);
            return deferred.promise;
        });

        spyOn($displayMessageService, 'translate');

        spyOn($requestService, 'authenticate').andCallFake(function(){
            var deferred = $q.defer();
            deferred.reject(mockAuthError);
            return deferred.promise;
        });

        $requestService.runRequestWithAuth(request).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($displayMessageService.translate).toHaveBeenCalledWith('ERROR UNABLE TO PERFORM ACTION');
        expect(_error).toEqual(mockAuthError);
    });

    it('should broadcast and return the ERROR UNABLE TO PERFORM ACTION message if the failing request fails again after we reauthenticate (not a 401 failure)', function() {
        var request = new Request(dummyRequestParams);
        var numRequests = 1;

        var mockRequestError1 = {
            status: 401
        };

        var mockRequestError2 = {
            status: 0
        };

        var _error = null;

        spyOn($requestService, 'doRequest').andCallFake(function(){
            if ( numRequests == 1){
                var deferred = $q.defer();
                deferred.reject(mockRequestError1);
                numRequests ++;
                return deferred.promise;
            } else {
                var deferred = $q.defer();
                deferred.reject(mockRequestError2);
                return deferred.promise;
            }
        });

        spyOn($displayMessageService, 'translate');

        spyOn($requestService, 'authenticate').andCallFake(function(){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.runRequestWithAuth(request).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($displayMessageService.translate).toHaveBeenCalledWith('ERROR UNABLE TO PERFORM ACTION');
        expect(_error).toEqual(mockRequestError2);
    });

    it('should broadcast and return the ERROR AUTHENTICATION FAILED message if the failing request fails again after we reauthenticate with another 401', function() {
        var request = new Request(dummyRequestParams);

        var mockRequestError = {
            status: 401
        };

        var _error = null;

        spyOn($requestService, 'doRequest').andCallFake(function(){
                var deferred = $q.defer();
                deferred.reject(mockRequestError);
                return deferred.promise;
        });

        spyOn($displayMessageService, 'translate');

        spyOn($requestService, 'authenticate').andCallFake(function(){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.runRequestWithAuth(request).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($displayMessageService.translate).toHaveBeenCalledWith('ERROR AUTHENTICATION FAILED');
        expect(_error).toEqual(mockRequestError);
    });

    it('should return the response if the failing request was successful after reauthentication', function() {
        var request = new Request(dummyRequestParams);

        var mockRequestError = {
            status: 401
        };

        var mockResponse = "SomeResponse";
        var numRequests = 1;

        var _response = null;

        spyOn($requestService, 'doRequest').andCallFake(function(){
            if ( numRequests == 1){
                var deferred = $q.defer();
                deferred.reject(mockRequestError);
                numRequests ++;
                return deferred.promise;
            } else {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            }
        });

        spyOn($displayMessageService, 'translate');

        spyOn($requestService, 'authenticate').andCallFake(function(){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        $requestService.runRequestWithAuth(request).then(function(response){
            _response = response;
        });

        $rootScope.$digest();

        expect($displayMessageService.translate).not.toHaveBeenCalled();
        expect(_response).toEqual(mockResponse);
    });

    it('should broadcast and return the content server error if the request was successful and there was a non-auth error in the response', function() {
        var request = new Request(dummyRequestParams);

        var mockResponse = {
            ok: false,
            auth: true,
            errMsg: 'SomeError'
        };

        var _error = null;

        spyOn($requestService, 'doRequest').andCallFake(function(){
            var deferred = $q.defer();
            deferred.resolve(mockResponse);
            return deferred.promise;
        });

        spyOn($rootScope, '$broadcast');

        $requestService.runRequestWithAuth(request).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($rootScope.$broadcast).toHaveBeenCalledWith('serverError', {errMsg: "SomeError"});
        expect(_error).toEqual(mockResponse);
    });

    it('should return the error message from the server if the request was successful but reauthentication failed', function() {
        var request = new Request(dummyRequestParams);

        var mockResponse = {
            ok: false,
            auth: false
        };

        var mockAuthError = "SomeAuthError";
        var _error = null;

        spyOn($requestService, 'doRequest').andCallFake(function(){
            var deferred = $q.defer();
            deferred.resolve(mockResponse);
            return deferred.promise;
        });

        spyOn($displayMessageService, 'translate');

        spyOn($requestService, 'authenticate').andCallFake(function(){
            var deferred = $q.defer();
            deferred.reject(mockAuthError);
            return deferred.promise;
        });

        $requestService.runRequestWithAuth(request).then(function(){},
            function(error){
                _error = error;
            });

        $rootScope.$digest();

        expect($displayMessageService.translate).toHaveBeenCalledWith('ERROR UNABLE TO PERFORM ACTION');
        expect(_error).toEqual(mockAuthError);
    });
});