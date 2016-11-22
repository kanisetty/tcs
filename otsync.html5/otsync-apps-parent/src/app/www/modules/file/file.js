angular
    .module('File', [])
    .factory('File', $File);

function $File() {
    return function (fileName, dataURL) {
        var _fileName = fileName;
        var _dataURL = dataURL;

        var _dataURLtoBlob = function (dataURL) {
            var sliceSize = 512;
            var byteCharacters = null;
            var contentType = null;
            var byteArrays = [];


            if(_fileName.indexOf("photo_") > -1) {
              byteCharacters = atob(dataURL.replace(/^[^,]+,/, ''));

              // try to determine content type from data url or default to image/jpeg
              contentType = dataURL.match(/^data:(.+);/);

              if (contentType) {
                  contentType = contentType.pop();
              } else {
                  contentType = 'image/jpeg';
              }
            } else {
              // Split "data:application/pdf;JPSAJDfdjfhksdff..sdf3y3dhdd=="
              // into parts[0] = data:application.pdf
              // and parts[1] = JPSAJDfdjfhksdff..sdf3y3dhdd==
              var parts = dataURL.split(";");
              if(parts.length == 1) {
                contentType = 'image/jpeg';
                byteCharacters = atob(parts[0].replace(/^[^,]+,/, ''));
              } else {
                contentType = parts[0].replace("data:","");
                byteCharacters = atob(parts[1].replace(/^[^,]+,/, ''));
              }
            }
            //var byteCharacters = atob(dataURL.replace(/^[^,]+,/, ''));
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

            return new Blob(byteArrays, {type: contentType});
        };


        this.getName = function () {
            return _fileName;
        };

        this.getDataURL = function () {
            return _dataURL;
        };

        this.getFileBlob = function () {
            return _dataURLtoBlob(_dataURL)
        }
    };
}
