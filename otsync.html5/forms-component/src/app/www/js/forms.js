var appSettings, request, cordovaRequest;

var initialize = function () {

    appSettings = getSettings();
    request = appworksRequest();
    cordovaRequest = CordovaRequest();

    cordovaRequest.getGatewayURL().done(function (url) {

        var opts = {fallbackLng: "en"};

        appSettings.serverURL = url;

        cordovaRequest.getDefaultLanguage().done(function (lng) {
            opts.lng = lng.value;
        }).always(function () {
            i18n.init(opts).done(function () {

                //translate submit button
                $(".btnSubmit").i18n();

                AddCustomAlpacaFields();

                if (isFile(appSettings.nodeType)) {
                    request.getFile(appSettings.fileSource).done(
                        function (data) {
                            appSettings.FileData = data || {};
                            getForms();
                        }
                    ).fail(
                        function () {
                            //no file chosen so go back to ews
                            closeMe();
                        }
                    );
                }
                getForms();

            }).fail(
                function () {
                    alert($.t("ERROR_INVALID_ARGUMENTS"));
                    closeMe();
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
        var blob = b64toBlob(appSettings.FileData, "image/jpeg");
        createData = _.omit(createData, 'file');
        // auto add .jpg extensions for proper thumbnailing
        if (!new RegExp(/\.jpg$/).test(createData.name)) {
            createData.name += '.jpg';
        }
        formData.append('file', blob, createData.name);
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
                    nodeCreateForm.data.name = appSettings.FileData.fileName;
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
        function () {
            loadingDialog.hide();
            alert($.t('ERROR_RENDERING_FROM'));
        }
    );

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
    initialize();
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

document.addEventListener("deviceready", onDeviceReady, false);