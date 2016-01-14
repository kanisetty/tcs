angular.module('File', [])
    .factory('File', function(){



        var File = function(fileName, dataURL){
            var _fileName = fileName;
            var _dataURL = dataURL;

            var _dataURLtoBlob = function (dataURL) {
                var contentType = "image/jpeg";
                var sliceSize = 512;
                contentType = contentType || '';

                var byteCharacters = atob(dataURL);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, {type: contentType});
                return blob;
            };


            this.getName = function(){
                return _fileName;
            };

            this.getDataURL = function(){
                return _dataURL;
            };

            this.getFileBlob = function() {
                return _dataURLtoBlob(_dataURL)
            }
        };

        return File;
    });