angular.module('headerService', ['Header'])
    .factory('$headerService', ['Header', function(Header) {

        var headerService = {};

        headerService.header = new Header('', false);
        headerService.pasteData = {itemInClipboard: false};

        headerService.clearPasteData = function() {
            headerService.pasteData = {itemInClipboard: false};
        };

        headerService.getHeader = function(){
            return headerService.header;
        };

        headerService.setHeader = function(header) {
            headerService.header = header;
        };

        headerService.updatePasteData = function(data) {
            headerService.pasteData = data;
        };

        headerService.doButtonAction = function(){
            return headerService.header.doButtonAction();
        };

        return headerService;
    }]);
