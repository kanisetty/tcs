var appSettings, request, cordovaRequest;

var initialize = function () {

    appSettings = getSettings();
    request = appworksRequest();
    cordovaRequest = CordovaRequest();

      cordovaRequest.authenticate().done(function (authResponse) {

          var opts = {fallbackLng: "en"};

          appSettings.serverURL = authResponse.authData.gatewayUrl;
          appSettings.authResponse = authResponse;

          cordovaRequest.getDefaultLanguage().done(function (lng) {
              opts.lng = lng.value;
          }).always(function () {
              i18n.init(opts).done(function () {

                  //translate submit button
                  $(".btnSubmit").i18n();

                  AddCustomAlpacaFields();

                  if (isFile(appSettings.nodeType)) {
                    var getFileTimeout = setTimeout(function(){
                        request.getFile(appSettings.fileSource).progress(function (progress) {
                          $("#progress-wrapper").css({display:"block"});
                          $("#progress").css({width:(Math.round((progress.loaded / progress.total) * 100))+"%"});
                        }).done(function (data) {
                          $("#progress-wrapper").css({display:"none"});
                          if(appSettings.fileSource == "device") {
                            appSettings.FileData = data.data || {};
                            appSettings.FileName = data.filename || "";
                            appSettings.MimeType = data.mimetype || "";
                          } else {
                            appSettings.FileData = data || {};
                          }
                          getForms();
                        }).fail(function () {
                            $("#progress-wrapper").css({display:"none"});
                            // no file chosen so go back to ews
                            closeMe();
                        });
                    }, 500);
                  }

                  getForms();

              }).fail(
                  function (res, statusText, err) {
                      if (res && res.status === 401) {
                          // we may have an external user. dont quit until we try to submit and it doesnt work
                      } else {
                          alert($.t("ERROR_INVALID_ARGUMENTS"));
                          closeMe();
                      }
                  }
              );
          });

      }).fail(function () {
          alert("fail epic");
      });

};

var getSettings = function () {

    var appSettings = {};

    try {
        var queryParams = processQueryParameters(window.location.search.toString().substring(1).split('data=').pop());

        appSettings.CONTENT_SERVER_API_PATH = '/otcsapi';
        appSettings.parentID = queryParams.id;
        appSettings.nodeType = queryParams.type;
        appSettings.fileSource = queryParams.fileSource;
        appSettings.FileData = {};

        //Added for upload "from device"
        appSettings.FileName = "";
        appSettings.MimeType = "";

        if (appSettings.parentID == undefined || appSettings.nodeType == undefined || (isFile(appSettings.nodeType) && appSettings.fileSource == null)) {
            throw new Error("Invalid Arguments");
        }

    } catch (e) {
        alert($.t("ERROR_INVALID_ARGUMENTS"));
        closeMe();
    }
    return appSettings;
};

var isFile = function (type) {
    var DOCUMENT = '144';
    //currently document is the only file type we are looking for
    var FILE_TYPES = [DOCUMENT];
    return (FILE_TYPES.indexOf(type) != -1);
};

var submitForm = function () {

    var postURL = appSettings.serverURL + appSettings.CONTENT_SERVER_API_PATH + '/v1/nodes';
    var createData, catsData;
    var isValid = true;
    var createForm = $("#nodeCreate").alpaca("get");
    var categoriesForm = $("#categories").alpaca("get");
    var formData = new FormData();

    if (createForm) {
        if (!createForm.isValid(true)) {
            isValid = false;
        }
        createData = createForm.getValue();
    } else {
        createData = {};
    }

    if (categoriesForm) {
        if (!categoriesForm.isValid(true)) {
            isValid = false;
        }
        catsData = categoriesForm.getValue();
    } else {
        catsData = {};
    }

    createData.roles = {};
    createData.roles.categories = catsData;

    if (isFile(appSettings.nodeType)) {
        if(appSettings.fileSource == "device") {
          var blob = b64toBlob(appSettings.FileData, appSettings.MimeType);
          createData = _.omit(createData, 'file');
          formData.append('file', blob, createData.name);
        } else {
          var blob = b64toBlob(appSettings.FileData, "image/jpeg");
          createData = _.omit(createData, 'file');
          // auto add .jpg extensions for proper thumbnailing
          if (!new RegExp(/\.jpg$/).test(createData.name)) {
              createData.name += '.jpg';
          }
          formData.append('file', blob, createData.name);
        }
    }

    formData.append('body', JSON.stringify(createData));

    if (isValid) {

        var requestParams = {
            method: 'POST',
            data: formData,
            url: postURL,
            processData: false,
            contentType: false
        };

        loadingDialog.show();
        loadingDialog.cancelTimeout();

        request.sendRequest(requestParams).done(
            function () {
                loadingDialog.hide();
                closeMe();
            }
        ).fail(
            function (res) {
                var errorMsg = res.responseJSON && res.responseJSON.error;
                loadingDialog.hide();
                alert($.t('ERROR_CREATING_NODE') + '\n' + errorMsg);
            }
        );
    } else {
        alert($.t('REQUIRED_ATTRIBUTES_MISSING'));
    }
};

var getForms = function () {

    var requestParams = {
        method: 'GET',
        url: appSettings.serverURL + appSettings.CONTENT_SERVER_API_PATH + '/v1/forms/nodes/create?parent_id=' + appSettings.parentID + '&type=' + appSettings.nodeType,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
    };

    loadingDialog.show();

    request.sendRequest(requestParams).done(
        function (data) {

            var forms = data.forms;

            loadingDialog.hide();

            _.each(forms, function (form) {
                form.id = form.schema.title;
            });

            forms.length && (forms[0].id = "general");

            //show node create form
            if (forms.length > 0) {

                var nodeCreateForm = forms[0];

                if (isFile(appSettings.nodeType)) {
                    //remove file input, we already have the file from the file picker
                    nodeCreateForm.data = _.omit(nodeCreateForm.data, 'file');
                    nodeCreateForm.options.fields = _.omit(nodeCreateForm.options.fields, 'file');
                    nodeCreateForm.schema.properties = _.omit(nodeCreateForm.schema.properties, 'file');

                    //populate the name field with the name from the filepicker
                    if(appSettings.fileSource == "device") {
                      nodeCreateForm.data.name = appSettings.FileName;
                      if(appSettings.FileName != "") {
                        $('#alpaca3').val(appSettings.FileName);
                      }
                    } else {
                      nodeCreateForm.data.name = appSettings.FileData.fileName;
                    }
                }

                populateForm(nodeCreateForm.data, nodeCreateForm.options, nodeCreateForm.schema, 'nodeCreate');
            }

            //show categories form if it exists
            forms.forEach(function (form) {
                if (form.id.toLowerCase() === 'categories') {
                    populateForm(form.data, form.options, form.schema, 'categories');
                }
            });
            $('.btnSubmit').show();

        }
    ).fail(
        function (res) {
            if (res.status === 401) {
                showPlainForm();
            } else {
                alert($.t('ERROR_RENDERING_FROM'));
            }
            loadingDialog.hide();
        }
    );
};

var showPlainForm = function () {
    var form = $('#plain-form');
    var nameField = form.find('#plain-form-name');
    var descriptionField = form.find('#plain-form-description');
    var descriptionGroup = form.find('#description-group');
    var imgField = form.find('#plain-form-img');
    var submit = form.find('#plain-form-submit');
    var formData = new FormData();
    var url = appSettings.serverURL;
    var csToken = appSettings.authResponse.authData.authResponse.addtl['otsync-connector'].otcsticket;
    var clientId = appSettings.authResponse.authData.authResponse.id;
    var name, subtype, request;

    form.show();
    imgField.show();
    descriptionGroup.show();
    submit.i18n();

    if (isFile(appSettings.nodeType)) {
      if(appSettings.fileSource == "device") {
        nameField.val(appSettings.FileName);
        imgField.hide();
      } else {
        imgField.attr('src', 'data:image/jpeg;base64,' + appSettings.FileData);
      }
    } else {
        imgField.hide();
        descriptionGroup.hide();
    }

    submit.off();
    submit.on('click', function () {

        if (isFile(appSettings.nodeType)) {
            url += '/content/ContentChannel';
            subtype = 'upload';

            if (!nameField.val()) {
                alert($.t('REQUIRED_ATTRIBUTES_MISSING'));
                nameField.css({borderColor: 'red'});
            } else {

                name = nameField.val();

                if(appSettings.fileSource == "device") {
                  formData.append('versionFile', b64toBlob(appSettings.FileData, appSettings.MimeType), name);
                } else {
                  if (!new RegExp(/\.jpg$/).test(name)) {
                      name += '.jpg';
                  }
                  formData.append('versionFile', b64toBlob(appSettings.FileData, 'image/jpeg'), name);
                }
                formData.append('func', 'otsync.otsyncrequest');
                formData.append('payload', JSON.stringify({
                    cstoken: csToken,
                    type: 'content',
                    subtype: subtype,
                    clientID: clientId,
                    info: {
                        parentID: appSettings.parentID,
                        name: name,
                        description: descriptionField.val()
                    }
                }));

                request = {
                    url: url,
                    method: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false
                };

                sendPlainFormRequest(request);
            }
        } else {
            url += '/content/v5/nodes/' + appSettings.parentID + '/children';
            name = nameField.val();

            request = {
                url: url,
                method: 'POST',
                data: encodeObject({name: name}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };

            sendPlainFormRequest(request);

        }

    });
};

var sendPlainFormRequest = function (request) {
    $.ajax(request).then(function () {
        closeMe();
    }, function (err) {
        alert($.t('ERROR_RENDERING_FROM'));
        console.error(err);
        closeMe();
    });

    loadingDialog.show();
    loadingDialog.cancelTimeout();
};

var closeMe = function () {
    cordovaRequest.closeMe();
};

var populateForm = function (data, options, schema, div) {
    $("#" + div + "").alpaca({
        "view": 'bootstrap-edit',
        "data": data,
        "options": options,
        "schema": schema
    });
};

var onDeviceReady = function () {
    loadingDialog.show();
    // set back button to close component
    new Appworks.AWHeaderBar().setHeader({
        backButtonVisible: true,
        callback: function () {
            closeMe();
        }
    });

    var t = setTimeout(function(){
      initialize();
    }, 1000);
};

var processQueryParameters = function (query) {
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
};

function b64toBlob(b64Data, contentType, sliceSize) {
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString = dataURI;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: "image/jpeg"});
}

function blurInputFields() {
    // blur all input fields
    $("#nodeCreate").find('input').each(function (index, element) {
        $(element).blur();
    });
}

function onSubmit() {
    // blur input fields to force form values to update before attempting to submit
    blurInputFields();
    setTimeout(function () {
        submitForm();
    });
}

function encodeObject(obj) {
    if (obj !== null && typeof obj === 'object' && String(obj) !== '[object File]') {
        var query = '', innerObj;
        for (var name in obj) {
            var value = obj[name];

            if (value instanceof Array) {
                for (var i = 0; i < value.length; ++i) {
                    var keyName = (name + '[' + i + ']');
                    innerObj = {};
                    innerObj[keyName] = value[i];
                    query += encodeObject(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (var subName in value) {
                    innerObj = {};
                    innerObj[(name + '[' + subName + ']')] = value[subName];
                    query += encodeObject(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    } else {
        return obj;
    }
}

document.addEventListener("deviceready", onDeviceReady, false);
