angular
    .module('WorkflowAttachments')
    .service('AuthService', [
        '$q',
        '$ionicPlatform',
        '$rootScope',
        AuthService
    ]);

function AuthService($q, $ionicPlatform, $rootScope) {
    var _this = this;
    var _authCredentials = null;
    var _appData = null;

    $ionicPlatform.ready(function () {
        _this.initialize();
    });

    this.initialize = function initialize() {
        var deferred = $q.defer();
        // get component data from params
        getAppData();
        // use cached auth credentials
        if (_authCredentials) {
            deferred.resolve(_authCredentials);
        } else if (window.Appworks) {
            _this.authenticate().then(deferred.resolve, deferred.reject);
        }
        return deferred.promise;
    };

    this.appData = function () {
        return _appData;
    };

    this.gatewayUrl = function () {
        return _authCredentials.gatewayUrl;
    };

    this.clientId = function () {
        return _authCredentials.authResponse.id
    };

    this.csToken = function () {
        if (_authCredentials && _authCredentials.authResponse.addtl) {
            return _authCredentials.authResponse.addtl['otsync-connector'].otcsticket;
        }
    };

    this.authenticate = function (force) {
        var deferred = $q.defer();
        var auth = new Appworks.Auth(function (res) {
            onSuccess(res);
            deferred.resolve(res);
        }, function (err) {
            onFail(err);
            deferred.reject(err);
        });
        auth.authenticate(force);
        return deferred.promise;
    };

    this.reauth = function () {
        return _this.authenticate(true);
    };

    function onSuccess(res) {
        _authCredentials = res.authData;
    }

    function onFail(err) {
        console.log(err);
    }

    function getAppData() {
        _appData = $rootScope._appData;
        return _appData;
    }
}
