angular
    .module('File', [])
    .factory('File', $File);

function $File() {
    return function (fileName, dataURL) {
        var _fileName = fileName;
        var _dataURL = dataURL;

        var _dataURLtoBlob = function (dataURL) {
            var sliceSize = 512;

            var byteCharacters = atob(dataURL.replace(/^[^,]+,/, ''));
            var byteArrays = [];

            // try to determine content type from data url or default to image/jpeg
            var contentType = dataURL.match(/^data:(.+);/);

            if (contentType) {
                contentType = contentType.pop();
            } else {
                contentType = 'image/jpeg';
            }

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