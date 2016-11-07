angular.module('BrowseDecorator', [])

    .factory('BrowseDecorator', function () {

        var BrowseDecorator = function(objectToBeDecorated, title) {
			this.bottomLeftOverlayCSS = '';
            this.bottomMiddleOverlayCSS = '';
            this.bottomRightOverlayCSS = '';
            this.decoratedObject = objectToBeDecorated;
            this.title = title;
            this.topLeftOverlayCSS = '';
            this.topRightOverlayCSS = '';
        };

		BrowseDecorator.prototype.doIndent = function(){
			return false;
		};

        BrowseDecorator.prototype.getBottomLeftOverlayCSS = function(){
            return this.bottomLeftOverlayCSS;
        };

        BrowseDecorator.prototype.getBottomMiddleOverlayCSS = function(){
            return this.bottomMiddleOverlayCSS;
        };

        BrowseDecorator.prototype.getBottomRightOverlayCSS = function(){
            return this.bottomRightOverlayCSS;
        };

        BrowseDecorator.prototype.getDecoratedObject = function(){
            return this.decoratedObject;
        };

        BrowseDecorator.prototype.getIconURL = function(){
            return this.decoratedObject.getIconURL();
        };

        BrowseDecorator.prototype.getTemplateURL = function(){};

        BrowseDecorator.prototype.getTitle = function() {
            return this.title;
        };

        BrowseDecorator.prototype.getTopLeftOverlayCSS = function(){
            return this.topLeftOverlayCSS;
        };

        BrowseDecorator.prototype.getTopRightOverlayCSS = function(){
            return this.topRightOverlayCSS;
        };

        BrowseDecorator.prototype.setBottomLeftOverlayCSS = function(bottomLeftOverlayCSS){
            this.bottomLeftOverlayCSS = bottomLeftOverlayCSS;
        };

        BrowseDecorator.prototype.setBottomMiddleOverlayCSS = function(bottomMiddleOverlayCSS){
            this.bottomMiddleOverlayCSS = bottomMiddleOverlayCSS;
        };

        BrowseDecorator.prototype.setBottomRightOverlayCSS = function(bottomRightOverlayCSS){
            this.bottomRightOverlayCSS = bottomRightOverlayCSS;
        };

        BrowseDecorator.prototype.setTopLeftOverlayCSS = function(topLeftOverlayCSS){
            this.topLeftOverlayCSS = topLeftOverlayCSS;
        };

        BrowseDecorator.prototype.setTopRightOverlayCSS = function(topRightOverlayCSS){
            this.topRightOverlayCSS = topRightOverlayCSS;
        };

        BrowseDecorator.prototype.toString = function(){
            return this.decoratedObject.toString();
        };

        return BrowseDecorator;
    });
