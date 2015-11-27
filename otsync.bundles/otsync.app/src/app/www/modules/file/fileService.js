angular.module('fileService', [])

    .factory('$fileService', function(){
        var _fileStrategy;

        return {

            setFileStrategy: function (fileStrategy) {
                _fileStrategy = fileStrategy;
            },

            getFileFromCordova: function (namespace, func) {
                return _fileStrategy.getFileFromCordova(namespace, func);
            },

            getFilePath: function () {
                return _fileStrategy.getFilePath();
            },
            getFileFromGallery: function () {
                return _fileStrategy.getFileFromGallery();
            },
            getFileFromCamera: function () {
                return _fileStrategy.getFileFromCamera();
            }
        }
    });