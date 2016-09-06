$(document).ready(function () {
    "use strict";

    /* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
     strict:true, undef:true, unused:true, curly:true, browser:true */
    /* global App, moment */

    var WorkflowAttachments = new App();
    var _workflowData = WorkflowAttachments.getParameters();
    var _deviceStrategy = WorkflowAttachments.getDeviceStrategy();
    var _containerId = _workflowData.containerId;
    var _workflowTitle = _workflowData.title;
    var _clientId;
    var _csToken;
    var _gatewayUrl;
    var _attachments;

    WorkflowAttachments.init = initialize;

    document.addEventListener('deviceready', initialize);

    $('#refresh').on('click', function () {
        initialize();
    });

    function initialize() {
        var auth = new Appworks.Auth(gotAuthResponse, failed);

        setTitle();
        auth.authenticate();

        function gotAuthResponse(res) {
            var config = {};
            console.log(res);
            _gatewayUrl = res.authData.gatewayUrl;
            _clientId = res.authData.authResponse.id;
            if (res.authData.authResponse.addtl) {
                _csToken = res.authData.authResponse.addtl['otsync-connector'].otcsticket;
            }
            config.token = _csToken;
            config.clientId = _clientId;

            getContainerContents(_containerId, config).then(function (res) {
                _attachments = res.info.results.contents;
                displayContainerContents(_attachments);
            }, failed);
        }
    }

    function displayContainerContents(attachments) {
        // clear initial html
        $('#attachments-list').html('');
        // populate list with attachments
        if (attachments.length) {
            attachments.forEach(function (attachment) {
                var template = $('' +
                    '<div>' +
                    '  <h4>' + attachment.NAME + '</h4>' +
                    '  <small>' + 'Created ' + moment(attachment.CREATEDATE).fromNow() + '</small>' +
                    '</div>'
                );
                var button = $('' +
                    '<button class="btn btn-small" type="button">View &raquo;</button>'
                );

                // create a closure for the click handler to get the right attachment
                (function (attachment) {
                    button.on('click', function () {
                        viewAttachmentFor(attachment.DATAID);
                    });
                })(attachment);

                // wrap in a div to break line
                template.append($('<div></div>').append(button));

                $('#attachments-list').append(template);
            });
        } else {
            $('#attachments-list').append($('' +
                '<div>' +
                '  <h4>No attachments</h4>' +
                '</div>'
            ));
        }

    }

    function viewAttachmentFor(id) {
        alert('node id: ' + id);
    }

    function failed(err) {
        console.log(err);
    }

    function setTitle() {
        $('#node-name').text('Attachments for ' + decodeURIComponent(_workflowTitle));
    }

    function getContainerContents(id, config) {
        var data = {
            type: "request",
            subtype: "getfoldercontents",
            cstoken: config.token,
            clientID: config.clientId,
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
                containerID: id
            }
        };

        var request = {
            url: _gatewayUrl + '/content/FrontChannel',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data)
        };

        return _deviceStrategy.runRequestWithAuth(request);
    }
});