angular
    .module('WorkflowAttachments')
    .service('AuthService', [
        '$q',
        '$http',
        '$ionicPlatform',
        AuthService
    ]);

function AuthService($q, $http, $ionicPlatform) {
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
        var query = window.location.search.toString().substring(1).split('data=').pop();
        _appData = processQueryParameters(query);
        return _appData;
    }

    function processQueryParameters(query) {
        var params = {};
        var idx, pairs, pair, key, len;

        if (typeof(query) === 'string') {
            pairs = query.split("&");
            len = pairs.length;

            // Iterate through each pair and build the array
            for (idx = 0; idx < len; idx += 1) {
                pair = pairs[idx].split("=");
                key = pair[0];

                switch (typeof params[key]) {
                    // Key has not been found, create entry
                    case "undefined":
                        params[key] = pair[1];
                        break;
                    // Key exists, create an array
                    case "string":
                        params[key] = [params[key], pair[1]];
                        break;
                    // Add to the array
                    default:
                        params[key].push(pair[1]);
                }
            }
        }

        return params;
    }
}
