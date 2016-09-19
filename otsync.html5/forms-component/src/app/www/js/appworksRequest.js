var appworksRequest = function () {

    return {

        _addTicket: function (requestParams) {

            if (requestParams.headers)
                requestParams.headers.OTCSTICKET = appSettings.otcsTicket;
            else
                requestParams.headers = {OTCSTICKET: appSettings.otcsTicket};

            return requestParams
        },
        _runRequestWithAuth: function (request) {
            var deferred = $.Deferred();

            request().done(function (data) {

                deferred.resolve(data);

            }).fail(function (error) {
                if (error.status == 401) {
                    //try to reauth once

                    cordovaRequest.authenticate().done(function () {

                        request().done(function (res) {
                            deferred.resolve(res);
                        }).fail(function (err) {
                            deferred.reject(err);
                        });

                    }).fail(function (error) {
                        deferred.reject(error);
                    });
                }
                else {
                    deferred.reject(error);
                }
            });

            return deferred.promise();
        },

        sendRequest: function (requestParams) {

            var request = _.partial(this._sendRequest, requestParams, this);

            return this._runRequestWithAuth(request);

        },
        _sendRequest: function (requestParams, self) {

            var deferred = $.Deferred();

            requestParams = self._addTicket(requestParams);

            requestParams.type = requestParams.method;
            requestParams.queryParams = requestParams.params;

            $.ajax(requestParams).done(function (response) {
                if (response.ok != undefined && response.ok == false) {
                    if (response.auth == false) {
                        error.status = 401;
                        deferred.reject(error);
                    } else {
                        error.message = response;
                        deferred.reject(error);
                    }
                } else {
                    deferred.resolve(response);
                }
            }).fail(function (error) {
                if (error.status == 0) {
                    error.message = 'ERROR UNABLE TO PERFORM ACTION';
                }
                deferred.reject(error);
            });

            return deferred.promise();
        },

        getFile: function (func) {

            var deferred = $.Deferred();
            try {

                var options = {destinationType: Camera.DestinationType.DATA_URL};
                var camera = new Appworks.AWCamera(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });

                if (func === 'gallery') {
                    camera.openGallery(options);
                }
                else if (func === 'camera') {
                    camera.takePicture(options);
                }

            } catch (error) {
                deferred.reject(error);
            }

            return deferred.promise();
        }
    }
};
