angular.module('File', [])
    .factory('File', function(){



        var File = function(fileName, dataURL){
            var _fileName = fileName;
            var _dataURL = dataURL;

            var dataURLtoBlob = function (dataURL) {
                // convert base64/URLEncoded data component to raw binary data held in a string
                var byteString;
                if (dataURL.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(dataURL.split(',')[1]);
                else
                    byteString = unescape(dataURL.split(',')[1]);

                // separate out the mime component
                var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

                // write the bytes of the string to a typed array
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                return new Blob([ia], {type:mimeString});
            };


            this.getName = function(){
                return _fileName;
            };

            this.getDataURL = function(){
                return _dataURL;
            };

            this.getFileBlob = function() {
                return dataURLtoBlob(_dataURL)
            }
        };

        return File;
    });