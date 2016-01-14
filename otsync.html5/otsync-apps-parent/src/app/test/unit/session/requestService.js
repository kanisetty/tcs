var unAuthHeaderWarning = "1;Session Expired";
var errorRetrievingFileHeaderWarning= "2;Error Retrieving File";

describe('requestService doRequest tests', function(){
    var $q, $displayMessageService, $rootScope, $requestService, $tokenService, $cacheService, $sessionService, $httpBackend, dummyRequestParams;

    var newToken = "someNewToken";

    beforeEach(module('requestService', 'displayMessageService'));

    beforeEach(function(){
        $cacheService = {};
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
            url: '/favorites/v5/favorites',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', OTCSTICKET: "someToken"},
            data: {nodeID: 1234}
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$tokenService', $tokenService);
            $provide.value('$cacheService', $cacheService);
            $provide.value('$sessionService', $sessionService);
            $provide.value('$tokenService', $tokenService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$q_, _$rootScope_, _$requestService_, _$httpBackend_){
            $q = _$q_;
            $rootScope = _$rootScope_;
            $requestService = _$requestService_;
            $httpBackend = _$httpBackend_;
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should return an ERROR UNABLE TO PERFORM ACTION if a staus of 0 is returned from the appworks server.', function() {
        var mockError = {
            status: 0
        };
        var _error = '';

        $httpBackend.when('POST', '/favorites/v5/favorites')
            .respond(0, '');

        $requestService.doRequest(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $httpBackend.flush();

        expect(_error.status).toEqual(0);
        expect(_error.message).toEqual('ERROR UNABLE TO PERFORM ACTION');
    });

    it('should return a 401 if the request to the server was successful but content server returned unauthorized.', function() {
        var mockResponse = {
            ok: false,
            auth: false
        };
        var _error = '';

        $httpBackend.when('POST', '/favorites/v5/favorites')
            .respond(401, '');

        $requestService.doRequest(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $httpBackend.flush();

        expect(_error.status).toEqual(401);
    });

    it('should return the error message from content server if it was not an auth failure.', function() {
        var mockResponse = {
            ok: false,
            auth: true,
            message: "SomeMessage"
        };

        var _error = '';

        $httpBackend.when('POST', '/favorites/v5/favorites')
            .respond(500, mockResponse);

        $requestService.doRequest(dummyRequestParams).then(function(){},
            function(error){
                _error = error;
            });

        $httpBackend.flush();

        expect(_error.data.message).toEqual(mockResponse.message);
    });

    it('should return the response from the server if there was no error.', function() {
        var mockResponse = {
            ok: true,
            auth: true,
            message: "SomeMessage"
        };

        var _response = '';

        $httpBackend.when('POST', '/favorites/v5/favorites')
            .respond(200, mockResponse);

        $requestService.doRequest(dummyRequestParams).then(function(response){
                _response = response;
            },
            function(error){});

        $httpBackend.flush();

        expect(_response).toEqual(mockResponse);
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

    it('should broadcast and return the ERROR UNABLE TO PERFORM ACTION message if we fail while trying to reauthenticate a failed request', function() {
        var request = new Request(dummyRequestParams);
        var mockRequestError = {
            status: 401
        };

        var mockAuthError = {
            message: "SomeAuthError"
        };

        var _error = null;

        spyOn($requestService, 'doRequest').and.callFake(function(){
            var deferred = $q.defer();
            deferred.reject(mockRequestError);
            return deferred.promise;
        });

        spyOn($displayMessageService, 'translate');

        spyOn($requestService, 'reauthUpdateTicket').and.callFake(function(){
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

    it('should broadcast and return the ERROR AUTHENTICATION FAILED message if the failing request fails again after we reauthenticate with another 401', function() {
        var request = new Request(dummyRequestParams);

        var mockRequestError = {
            status: 401
        };

        var _error = null;

        spyOn($requestService, 'doRequest').and.callFake(function(){
                var deferred = $q.defer();
                deferred.reject(mockRequestError);
                return deferred.promise;
        });

        spyOn($displayMessageService, 'translate');

        spyOn($requestService, 'reauthUpdateTicket').and.callFake(function(){
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

        spyOn($requestService, 'doRequest').and.callFake(function(){
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

        spyOn($requestService, 'reauthUpdateTicket').and.callFake(function(){
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

        spyOn($requestService, 'doRequest').and.callFake(function(){
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

        spyOn($requestService, 'doRequest').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(mockResponse);
            return deferred.promise;
        });

        spyOn($displayMessageService, 'translate');

        spyOn($requestService, 'reauthUpdateTicket').and.callFake(function(){
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

    it('should broadcast and return the content server error if a hash error was returned as in from feeds', function() {
        var request = new Request(dummyRequestParams);
        var errMsg = "Duplicate status update for user Admin.";

        var mockResponse = {
            "hash": {
                "request": "",
                "error": errMsg
            }
        };

        var _error = null;

        spyOn($requestService, 'doRequest').and.callFake(function(){
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

        expect($rootScope.$broadcast).toHaveBeenCalledWith('serverError', {errMsg: errMsg});
        expect(_error).toEqual(mockResponse);
    });
});