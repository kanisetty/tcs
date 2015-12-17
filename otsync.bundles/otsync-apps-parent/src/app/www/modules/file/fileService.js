angular.module('fileService', [])

    .factory('$fileService', function(){

        return {

            getFileFromCamera: function() {
                var deferred = $q.defer();

                appworks.camera.takePicture(function (dataUrl) {
                    console.log(dataUrl);
                    deferred.resolve(dataUrl);
                }, function (err) {
                    console.log(err);
                    deferred.reject(err);
                });

                return deferred.promise;
            },

           getFileFromGallery: function() {
                var deferred = $q.defer();

                appworks.camera.chooseFromLibrary(function (dataUrl) {
                    deferred.resolve(dataUrl);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }
        }
    });