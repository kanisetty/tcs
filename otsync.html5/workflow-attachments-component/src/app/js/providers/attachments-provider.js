angular
    .module('WorkflowAttachments')
    .service('AttachmentsProvider', [
        '$q',
        '$rootScope',
        'AuthService',
        AttachmentsProvider
    ]);

function AttachmentsProvider($q, $rootScope, authService) {

    this.addAttachment = function addAttachment(config) {
        var deferred = $q.defer();
        var formdata = new FormData();
        formdata.append('versionFile', config.file, config.name);
        formdata.append('func', 'otsync.otsyncrequest');
        formdata.append('payload', JSON.stringify({
            cstoken: authService.csToken(),
            type: 'content',
            subtype: 'upload',
            clientID: authService.clientId(),
            info: {
                parentID: authService.appData().containerId,
                name: name
            }
        }));

        var request = {
            url: authService.gatewayUrl() + '/content/ContentChannel',
            method: 'POST',
            data: formdata,
            processData: false,
            contentType: false
        };

        $.ajax(request).then(function (data) {
            deferred.resolve(data);
            $rootScope.$apply();
        }, function (err) {
            if (err.status === 401) {
                // reauth and try again
                authService.reauth().then(function () {
                    addAttachment(config).then(deferred.resolve, deferred.reject);
                });
            }
        });

        return deferred.promise;
    };

    this.getAttachments = function getAttachments() {
        var deferred = $q.defer();
        authService.initialize().then(function () {
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
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data)
            };

            $.ajax(request).then(function (data) {
                deferred.resolve(data);
                $rootScope.$apply();
            }, function (err) {
                if (err.status === 401) {
                    // reauth and try again
                    authService.reauth().then(function () {
                        getAttachments().then(deferred.resolve, deferred.reject);
                    });
                }
            });
        });
        return deferred.promise;
    };

}
