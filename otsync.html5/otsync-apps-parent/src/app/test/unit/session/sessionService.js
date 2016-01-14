describe('$sessionService getDefaultLanguage tests', function(){
    var $sessionService, $q, $requestService, defaultLanguage, $rootScope, $appworksService;
    var properties = {};
    var otcsticket = 'someOTCSTicket';

    beforeEach(module('sessionService'));

    beforeEach(function(){
        properties.csScriptName = 'someScriptName';

        $requestService = {
            runRequestWithAuth:function(){}
        };

        module(function ($provide) {
            $provide.value('$requestService', $requestService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$q_, _$rootScope_, _$sessionService_, _$appworksService_){
            $q = _$q_;
            defaultLanguage = '';
            $sessionService = _$sessionService_;
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

        $sessionService.init();

        $rootScope.$digest();

        expect($sessionService.getDefaultLanguage()).toEqual(expectedLanguage);
        expect($sessionService.getGatewayURL()).toEqual(expectedGatewayURL);
    });

    it('should return en as defaultLanguage if the lang object is null', function() {
        var expectedLanguage = 'en';
        var langObject = null;
        var expectedGatewayURL = 'someURL';

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

        $sessionService.init();

        $rootScope.$digest();

        expect($sessionService.getDefaultLanguage()).toEqual(expectedLanguage);
        expect($sessionService.getGatewayURL()).toEqual(expectedGatewayURL);
    });

    it('should return en as the default language if the value in the lang object is null', function() {
        var expectedLanguage = 'en';
        var langObject = {
            value: null
        };
        var expectedGatewayURL = 'someURL';

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

        $sessionService.init();

        $rootScope.$digest();

        expect($sessionService.getDefaultLanguage()).toEqual(expectedLanguage);
        expect($sessionService.getGatewayURL()).toEqual(expectedGatewayURL);
    });

    it('should return en as the defaultLanguage if the lang object value is an empty string', function() {
        var expectedLanguage = 'en';
        var langObject = {
            value: ''
        };
        var expectedGatewayURL = 'someURL';

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

        $sessionService.init();

        $rootScope.$digest();

        expect($sessionService.getDefaultLanguage()).toEqual(expectedLanguage);
        expect($sessionService.getGatewayURL()).toEqual(expectedGatewayURL);
    });
});

describe('$sessionService getClientType tests', function(){
    var $sessionService, $requestService;
    var tempoClientName = 'tempo';
    var oteClientName = 'all';

    beforeEach(module('sessionService'));

    beforeEach(function(){
        $requestService = {};

        module(function ($provide) {
            $provide.value('$requestService', $requestService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$sessionService_){
            $sessionService = _$sessionService_;
        });
    });

    it('should set the client type to tempo if tempo is the appname', function() {
        $sessionService.setAppName('tempo');
        expect($sessionService.getClientType()).toEqual(tempoClientName);
    });

    it('should set the client type to all if null is the appname', function() {
        $sessionService.setAppName(null);
        expect($sessionService.getClientType()).toEqual(oteClientName);
    });

    it('should set the client type to all if an empty string is the appname', function() {
        $sessionService.setAppName('');
        expect($sessionService.getClientType()).toEqual(oteClientName);
    });

    it('should set the client type to all if ews is the appname', function() {
        $sessionService.setAppName('ews');
        expect($sessionService.getClientType()).toEqual(oteClientName);
    });
});


