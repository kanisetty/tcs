describe('OTAGSessionStrategy getDefaultLanguage tests', function(){
    var OTAGSessionStrategy, $q, $requestService, defaultLanguage, $rootScope, $appworksService;
    var properties = {};
    var gatewayURL = 'someGatewayURL';
    var otcsticket = 'someOTCSTicket';

    beforeEach(module('OTAGSessionStrategy'));

    beforeEach(function(){
        properties.csScriptName = 'someScriptName';
        $requestService = {
            runRequestWithAuth:function(){}
        };


        module(function ($provide) {
            $provide.value('$requestService', $requestService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$q_, _$rootScope_, _OTAGSessionStrategy_, _$appworksService_){
            $q = _$q_;
            defaultLanguage = '';
            OTAGSessionStrategy = _OTAGSessionStrategy_;
            $rootScope = _$rootScope_;
            $appworksService = _$appworksService_;
        });
    });

    it('should return a language if one was found', function() {
        var expectedLanguage = 'fr';
        var expectedGatewayURL = 'someURL';
        var langObject = {
            value: expectedLanguage
        };
        var defaultLanguageObject = [];
        var otagSessionStrategy = new OTAGSessionStrategy();
        defaultLanguageObject[0] = expectedLanguage;

        var alreadyCalled = false;

        spyOn($appworksService, 'execCordovaRequest').and.callFake(function() {
            if (alreadyCalled){
                var deferred = $q.defer();
                deferred.resolve(expectedGatewayURL);
                return deferred.promise;
            } else {

                alreadyCalled = true;

                var deferred = $q.defer();
                deferred.resolve(langObject);
                return deferred.promise;
            }
        });

        spyOn($requestService, 'runRequestWithAuth').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(properties);
            return deferred.promise;
        });

        spyOn($appworksService, 'getOTCSTICKET').and.returnValue(otcsticket);

        otagSessionStrategy.init();

        $rootScope.$digest();

        expect(otagSessionStrategy.getDefaultLanguage()).toEqual(expectedLanguage);
        expect(otagSessionStrategy.getGatewayURL()).toEqual(expectedGatewayURL);
    });

    it('should return en as defaultLanguage if the lang object is null', function() {
        var expectedLanguage = 'en';
        var langObject = null;
        var expectedGatewayURL = 'someURL';
        var otagSessionStrategy = new OTAGSessionStrategy();

        var alreadyCalled = false;

        spyOn($appworksService, 'execCordovaRequest').and.callFake(function() {
            if (alreadyCalled){
                var deferred = $q.defer();
                deferred.resolve(expectedGatewayURL);
                return deferred.promise;
            } else {

                alreadyCalled = true;

                var deferred = $q.defer();
                deferred.resolve(langObject);
                return deferred.promise;
            }
        });

        spyOn($requestService, 'runRequestWithAuth').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(properties);
            return deferred.promise;
        });

        spyOn($appworksService, 'getOTCSTICKET').and.returnValue(otcsticket);

        otagSessionStrategy.init();

        $rootScope.$digest();

        expect(otagSessionStrategy.getDefaultLanguage()).toEqual(expectedLanguage);
        expect(otagSessionStrategy.getGatewayURL()).toEqual(expectedGatewayURL);
    });

    it('should return en as the default language if the value in the lang object is null', function() {
        var expectedLanguage = 'en';
        var langObject = {
            value: null
        };
        var expectedGatewayURL = 'someURL';
        var otagSessionStrategy = new OTAGSessionStrategy();

        var alreadyCalled = false;

        spyOn($appworksService, 'execCordovaRequest').and.callFake(function() {
            if (alreadyCalled){
                var deferred = $q.defer();
                deferred.resolve(expectedGatewayURL);
                return deferred.promise;
            } else {

                alreadyCalled = true;

                var deferred = $q.defer();
                deferred.resolve(langObject);
                return deferred.promise;
            }
        });

        spyOn($requestService, 'runRequestWithAuth').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(properties);
            return deferred.promise;
        });

        spyOn($appworksService, 'getOTCSTICKET').and.returnValue(otcsticket);

        otagSessionStrategy.init();

        $rootScope.$digest();

        expect(otagSessionStrategy.getDefaultLanguage()).toEqual(expectedLanguage);
        expect(otagSessionStrategy.getGatewayURL()).toEqual(expectedGatewayURL);
    });

    it('should return en as the defaultLanguage if the lang object value is an empty string', function() {
        var expectedLanguage = 'en';
        var langObject = {
            value: ''
        };
        var expectedGatewayURL = 'someURL';
        var otagSessionStrategy = new OTAGSessionStrategy();

        var alreadyCalled = false;

        spyOn($appworksService, 'execCordovaRequest').and.callFake(function() {
            if (alreadyCalled){
                var deferred = $q.defer();
                deferred.resolve(expectedGatewayURL);
                return deferred.promise;
            } else {

                alreadyCalled = true;

                var deferred = $q.defer();
                deferred.resolve(langObject);
                return deferred.promise;
            }
        });

        spyOn($requestService, 'runRequestWithAuth').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve(properties);
            return deferred.promise;
        });

        spyOn($appworksService, 'getOTCSTICKET').and.returnValue(otcsticket);

        otagSessionStrategy.init();

        $rootScope.$digest();

        expect(otagSessionStrategy.getDefaultLanguage()).toEqual(expectedLanguage);
        expect(otagSessionStrategy.getGatewayURL()).toEqual(expectedGatewayURL);
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


