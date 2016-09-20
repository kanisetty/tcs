angular
    .module('WorkflowAttachments')
    .service('AuthService', [
        '$http',
        '$ionicPlatform',
        AuthService
    ]);

function AuthService($http, $ionicPlatform) {
    var _this = this;
    var _authCredentials = {};
    var _appData = {};

    $ionicPlatform.ready(function () {
        _this.initialize();
    });

    this.initialize = function initialize() {
        if (window.Appworks) {
            new Appworks.Auth(onSuccess, onFail).authenticate();
            getAppData();
        }
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

    this.reauth = function () {
        var deferred = $q.defer();
        var auth = new Appworks.Auth(deferred.resolve, deferred.reject);
        auth.authenticate(true);
        return deferred.promise;
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

        if (typeof(query) === 'string') {
            var pairs = query.split("&");
            var len = pairs.length;
            var idx, pair, key;

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
