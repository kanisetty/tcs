angular.module('FileStrategy', [])

    .factory('FileStrategy', ['$q', '$displayMessageService', function ($q, $displayMessageService) {

        var FileStrategy = function(){};

        FileStrategy.prototype.getFilePath = function () {
            var deferred = $q.defer();
            try {
                AppWorks.selectFilePath(function (data) {
                    var destPath = data.filePath;

                    if(destPath != "")
                        deferred.resolve(destPath);
                    else
                        deferred.reject(destPath);
                });
            }
            catch (error) {

                $rootScope.$broadcast('serverError', {errMsg: $displayMessageService.translate('ERROR UNABLE TO PERFORM ACTION')});
                deferred.reject('ERROR UNABLE TO PERFORM ACTION');
            }

            return deferred.promise;
        };

        FileStrategy.prototype.getFileFromCordova = function (namespace, func) {
            var deferred = $q.defer();
            var successFn = function () {};
            var errorFn = function () {};

            try {
                var json = {
                    success: function (data) {

                        if (data.file != null && data.file != "")
                            deferred.resolve(data);
                        else
                            deferred.reject(data);

                    }
                    , error: function (data) {
                        deferred.reject(data);
                    }
                };

                var params = [json];

                cordova.exec(successFn, errorFn, namespace, func, params || []);
            } catch (error) {
                deferred.reject(error);
            }

            return deferred.promise;
        };


        FileStrategy.prototype.getFileFromCamera = function() {
            var deferred = $q.defer();

            appworks.camera.takePicture(function (dataUrl) {
                console.log(dataUrl);
                deferred.resolve(dataUrl);
            }, function (err) {
                console.log(err)
                deferred.reject(err);
            })

            return deferred.promise;
        };

        FileStrategy.prototype.getFileFromGallery = function() {
            var deferred = $q.defer();

            appworks.camera.chooseFromLibrary(function (dataUrl) {
                deferred.resolve(dataUrl);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        return FileStrategy;
    }]);
