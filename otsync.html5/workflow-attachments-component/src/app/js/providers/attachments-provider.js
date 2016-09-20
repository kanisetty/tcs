angular
    .module('WorkflowAttachments')
    .service('AttachmentsProvider', [
        '$http',
        '$q',
        'AuthService',
        AttachmentsProvider
    ]);

function AttachmentsProvider($http, $q, authService) {
    var self = this;

    this.getAttachments = function getAttachments() {
        var deferred = $q.defer();
        var data = {
            type: "request",
            subtype: "getfoldercontents",
            cstoken: authService.csToken(),
            clientID: authService.clientId(),
            info: {
                sort: "NAME",
                pageSize: 100,
                page: 1,
                virtual: "true",
                fields: [
                    "CHILDCOUNT",
                    "CREATEDATE",
                    "DISPLAYCREATEDATE",
                    "DATAID",
                    "DATASIZE",
                    "ISFAVORITE",
                    "ISREADONLY",
                    "ISSHARED",
                    "ISCONTAINER",
                    "ISROOTSHARE",
                    "ISSHAREABLE",
                    "ISSHARED",
                    "ISSUBSCRIBED",
                    "MIMETYPE",
                    "MODIFYDATE",
                    "DISPLAYMODIFYDATE",
                    "NAME",
                    "ORIGINDATAID",
                    "ORIGINSUBTYPE",
                    "PARENTID",
                    "PERMISSIONS",
                    "ROOTTYPE",
                    "SUBTYPE",
                    "SHAREDFOLDER",
                    "SHARECLASS",
                    "ISRESERVABLE",
                    "ISHIDDEN",
                    "RESERVEDBYUSERNAME"
                ],
                containerID: authService.appData().containerId
            }
        };

        var request = {
            url: authService.gatewayUrl() + '/content/FrontChannel',
            method: 'POST',
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: data
        };

        $http(request).then(function (data) {
            deferred.resolve(data.data);
        }, function (err) {
            if (err.status === 401) {
                // reauth and try again
                authService.reauth().then(function () {
                    getAttachments().then(deferred.resolve, deferred.reject);
                });
            }
        });
        return deferred.promise;
    };

}
