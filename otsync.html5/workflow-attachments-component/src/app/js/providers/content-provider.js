angular
    .module('WorkflowAttachments')
    .service('ContentProvider', [
        '$q',
        'AuthService',
        '$http',
        ContentProvider
    ]);

function ContentProvider($q, authService, $http) {

    this.getEWSRoot = function getEWSRoot() {
        var deferred = $q.defer();
        authService.initialize().then(function () {
            var url = authService.gatewayUrl() + '/content/v5/properties';
            $http.get(url).then(function (res) {
                deferred.resolve(res.data.enterpriseWorkspaceRoot);
            }, deferred.reject);
        });
        return deferred.promise;
    };

    this.getPWSRoot = function getPWSRoot() {
        var deferred = $q.defer();
        authService.initialize().then(function () {
            var url = authService.gatewayUrl() + '/content/v5/properties';
            $http.get(url).then(function (res) {
                deferred.resolve(res.data.personalWorkspaceRoot);
            }, deferred.reject);
        });
        return deferred.promise;
    };

    this.getChildren = function getChildren(parentId) {
        var deferred = $q.defer();
        authService.initialize().then(function () {
            var url = authService.gatewayUrl() + '/content/v5/nodes/' + parentId + '/children';
            $http.get(url).then(function (res) {
                deferred.resolve(res.data.contents);
            }, deferred.reject);
        });
        return deferred.promise;
    };

}
