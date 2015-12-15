describe('OTAGSessionStrategy getDefaultLanguage tests', function(){
    var OTAGSessionStrategy, $q, $requestService, $tokenService, defaultLanguage, $rootScope, AppWorksFacade;
    var properties = {};
    var gatewayURL = 'someGatewayURL';
    var otcsticket = 'someOTCSTicket';

    beforeEach(module('OTAGSessionStrategy'));

    beforeEach(function(){
        properties.csScriptName = 'someScriptName';
        $requestService = {
            execCordovaRequest:function(){},
            runRequestWithAuth:function(){}
        };

        $tokenService = {
            getOTCSTICKET: function(){}
        };

		AppWorksFacade = {
			execCordovaRequest: function(){}
		};

        module(function ($provide) {
            $provide.value('$requestService', $requestService);
            $provide.value('$tokenService', $tokenService);
			$provide.value('AppWorksFacade', AppWorksFacade);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$q_, _$rootScope_, _OTAGSessionStrategy_){
            $q = _$q_;
            defaultLanguage = '';
            OTAGSessionStrategy = _OTAGSessionStrategy_;
            $rootScope = _$rootScope_;
        });
    });

    it('should return a language if one was found', function() {
        var expectedLanguage = 'fr';
        var defaultLanguageObject = [];
        var otagSessionStrategy = new OTAGSessionStrategy();
        defaultLanguageObject[0] = expectedLanguage;

        spyOn(AppWorksFacade, 'execCordovaRequest').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(defaultLanguageObject);
            return deferred.promise;
        });

        spyOn($requestService, 'runRequestWithAuth').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(properties);
            return deferred.promise;
        });

        spyOn($tokenService, 'getOTCSTICKET').and.returnValue(otcsticket);

        spyOn(otagSessionStrategy, 'initDefaultLanguage').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(expectedLanguage);
            return deferred.promise;
        });

        spyOn(otagSessionStrategy, 'getGatewayURL').and.returnValue(gatewayURL);

        otagSessionStrategy.init();

        $rootScope.$digest();

        expect(otagSessionStrategy.getDefaultLanguage()).toEqual(expectedLanguage);
    });

    it('should return en_US the defaultLanguageObject is null', function() {
        var expectedLanguage = 'en_US';
        var defaultLanguageObject = null;
        var otagSessionStrategy = new OTAGSessionStrategy();

        spyOn(AppWorksFacade, 'execCordovaRequest').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(defaultLanguageObject);
            return deferred.promise;
        });

        spyOn($requestService, 'runRequestWithAuth').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(properties);
            return deferred.promise;
        });

        spyOn($tokenService, 'getOTCSTICKET').and.returnValue(otcsticket);

        spyOn(otagSessionStrategy, 'getGatewayURL').and.returnValue(gatewayURL);

        spyOn(otagSessionStrategy, 'initDefaultLanguage').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(expectedLanguage);
            return deferred.promise;
        });

        otagSessionStrategy.init();

        $rootScope.$digest();

        expect(otagSessionStrategy.getDefaultLanguage()).toEqual(expectedLanguage);
    });

    it('should return en_US the defaultLanguage is null', function() {
        var expectedLanguage = 'en_US';
        var defaultLanguageObject = {};
        var otagSessionStrategy = new OTAGSessionStrategy();

        defaultLanguageObject[0] = null;

        spyOn(AppWorksFacade, 'execCordovaRequest').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(defaultLanguageObject);
            return deferred.promise;
        });

        spyOn($requestService, 'runRequestWithAuth').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(properties);
            return deferred.promise;
        });

        spyOn($tokenService, 'getOTCSTICKET').and.returnValue(otcsticket);

        spyOn(otagSessionStrategy, 'getGatewayURL').and.returnValue(gatewayURL);

        spyOn(otagSessionStrategy, 'initDefaultLanguage').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(expectedLanguage);
            return deferred.promise;
        });

        otagSessionStrategy.init();

        $rootScope.$digest();

        expect(otagSessionStrategy.getDefaultLanguage()).toEqual(expectedLanguage);
    });

    it('should return en_US the defaultLanguage is an empty string', function() {
        var expectedLanguage = 'en_US';
        var defaultLanguageObject = {};
        var otagSessionStrategy = new OTAGSessionStrategy();

        defaultLanguageObject[0] = '';

        spyOn(AppWorksFacade, 'execCordovaRequest').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(defaultLanguageObject);
            return deferred.promise;
        });

        spyOn($requestService, 'runRequestWithAuth').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(properties);
            return deferred.promise;
        });

        spyOn($tokenService, 'getOTCSTICKET').and.returnValue(otcsticket);

        spyOn(otagSessionStrategy, 'getGatewayURL').and.returnValue(gatewayURL);

        spyOn(otagSessionStrategy, 'initDefaultLanguage').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(expectedLanguage);
            return deferred.promise;
        });

        otagSessionStrategy.init();

        $rootScope.$digest();

        expect(otagSessionStrategy.getDefaultLanguage()).toEqual(expectedLanguage);
    });
});

describe('OTAGSessionStrategy getClientType tests', function(){
    var OTAGSessionStrategy, $requestService;
    var tempoClientName = 'tempo';
    var oteClientName = 'all';

    beforeEach(module('OTAGSessionStrategy'));

    beforeEach(function(){
        $requestService = {};

        module(function ($provide) {
            $provide.value('$requestService', $requestService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_OTAGSessionStrategy_){
            OTAGSessionStrategy = _OTAGSessionStrategy_;
        });
    });

    it('should set the client type to tempo if tempo is the appname', function() {
        var appName = 'tempo';
        var otagSessionStrategy = new OTAGSessionStrategy(appName);

        expect(otagSessionStrategy.getClientType()).toEqual(tempoClientName);
    });

    it('should set the client type to all if null is the appname', function() {
        var appName = null;
        var otagSessionStrategy = new OTAGSessionStrategy(appName);

        expect(otagSessionStrategy.getClientType()).toEqual(oteClientName);
    });

    it('should set the client type to all if an empty string is the appname', function() {
        var appName = '';
        var otagSessionStrategy = new OTAGSessionStrategy(appName);

        expect(otagSessionStrategy.getClientType()).toEqual(oteClientName);
    });

    it('should set the client type to all if ews is the appname', function() {
        var appName = 'ews';
        var otagSessionStrategy = new OTAGSessionStrategy(appName);

        expect(otagSessionStrategy.getClientType()).toEqual(oteClientName);
    });
});


