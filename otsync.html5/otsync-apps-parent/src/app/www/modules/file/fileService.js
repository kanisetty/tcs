angular.module('fileService', ['appworksService'])

    .factory('$fileService', ['$q', '$appworksService', function($q, $appworksService){

        return {

            getFileFromCamera: function() {
                var deferred = $q.defer();

                var camera = new Appworks.AWCamera(success, failure);

                function success(data) {
                    deferred.resolve(data);
                }

                function failure(err) {
                    deferred.reject(err);
                }

                camera.takePicture($appworksService.getCameraOptions());

                return deferred.promise;
            },

            getFileFromGallery: function() {
                var deferred = $q.defer();

                var camera = new Appworks.AWCamera(success, failure);

                function success(data) {
                    deferred.resolve(data);
                }

                function failure(err) {
                   deferred.reject(err);
                }

                camera.openGallery($appworksService.getCameraOptions());

                return deferred.promise;
            },

            getFileFromDevice: function() {
                var deferred = $q.defer();

                var camera = new Appworks.AWCamera(success, failure);

                function success(filePath) {
                  window.resolveLocalFileSystemURL('file://' + filePath,
                    function (fileEntry) {
                      fileEntry.file(function (file) {
                        var reader = new FileReader();
                        fileObject = {"filename" : file.name, "mimetype" : file.type};
                        reader.onloadend = function (evt) {
                            var parts = evt.target.result.split(";");
                            fileObject["data"] = parts[1].replace("base64,","");
                            deferred.resolve(fileObject);
                        };

                        reader.readAsDataURL(file);
                      },
                        function (err) {
                          deferred.reject;
                        });
                    }, function (err) {
                      deferred.reject;
                    });
                }

                function failure(err) {
                   deferred.reject(err);
                }

                camera.openGallery($appworksService.getDeviceOptions());

                return deferred.promise;
            }
        }
    }]);
