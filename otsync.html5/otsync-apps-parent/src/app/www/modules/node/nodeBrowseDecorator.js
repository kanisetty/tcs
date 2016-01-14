angular.module('NodeBrowseDecorator', ['BrowseDecorator'])

    .factory('NodeBrowseDecorator', ['BrowseDecorator', function (BrowseDecorator) {
        var _templateURL = 'modules/node/node.html';

        var NodeBrowseDecorator = function(node, title) {
            this.decoratedObject = node;
            this.detail = '';
            this.reserveIconCSS = '';
            this.title = title;
        };

        NodeBrowseDecorator.prototype = new BrowseDecorator();

        NodeBrowseDecorator.prototype.getDetail = function(){
            return this.detail;
        };

        NodeBrowseDecorator.prototype.getReserveIconCSS = function(){
            return this.reserveIconCSS;
        };

        NodeBrowseDecorator.prototype.getTemplateURL = function(){
            return _templateURL;
        };

        NodeBrowseDecorator.prototype.setDetail = function(detail){
            this.detail = detail;
        };

        NodeBrowseDecorator.prototype.setReserveIconCSS = function(reserveIconCSS){
            this.reserveIconCSS = reserveIconCSS;
        };

        return NodeBrowseDecorator;
    }]);
