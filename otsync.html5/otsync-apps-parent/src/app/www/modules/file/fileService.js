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

                function success(data) {
                    deferred.resolve(data);
                }

                function failure(err) {
                   deferred.reject(err);
                }

                camera.openGallery($appworksService.getDeviceOptions());

                return deferred.promise;
            }
        }
    }]);
