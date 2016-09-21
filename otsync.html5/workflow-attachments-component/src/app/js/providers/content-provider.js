angular
    .module('WorkflowAttachments')
    .service('ContentProvider', [
        '$q',
        'AuthService',
        '$http',
        ContentProvider
    ]);

function ContentProvider($q, authService, $http) {
    var _this = this;

    this.getEWSRoot = function getEWSRoot() {
        var deferred = $q.defer();
        authService.initialize().then(function () {
            var url = authService.gatewayUrl() + '/content/v5/properties';
            $http.get(url).then(function (res) {
                deferred.resolve(res.data.enterpriseWorkspaceRoot);
            }, function (err) {
                if (err.status === 401) {
                    authService.reauth().then(function () {
                        _this.getEWSRoot().then(deferred.resolve, deferred.reject);
                    });
                } else {
                    deferred.reject(err);
                }
            });
        });
        return deferred.promise;
    };

    this.getPWSRoot = function getPWSRoot() {
        var deferred = $q.defer();
        authService.initialize().then(function () {
            var url = authService.gatewayUrl() + '/content/v5/properties';
            $http.get(url).then(function (res) {
                deferred.resolve(res.data.personalWorkspaceRoot);
            }, function (err) {
                if (err.status === 401) {
                    authService.reauth().then(function () {
                        _this.getPWSRoot().then(deferred.resolve, deferred.reject);
                    });
                } else {
                    deferred.reject(err);
                }
            });
        });
        return deferred.promise;
    };

    this.getChildren = function getChildren(parentId) {
        var deferred = $q.defer();
        authService.initialize().then(function () {
            var url = authService.gatewayUrl() + '/content/v5/nodes/' + parentId + '/children';
            $http.get(url).then(function (res) {
                deferred.resolve(res.data.contents);
            }, function (err) {
                if (err.status === 401) {
                    authService.reauth().then(function () {
                        _this.getChildren(parentId).then(deferred.resolve, deferred.reject);
                    });
                } else {
                    deferred.reject(err);
                }
            });
        });
        return deferred.promise;
    };

}
