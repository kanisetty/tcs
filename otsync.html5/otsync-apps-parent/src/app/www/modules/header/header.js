angular.module('Header', [])

    .factory('Header', function () {

        var Header = function(title, showButton) {
            this.title = title;
            this.showButton = showButton;
            this.showButtonCSS = '';
        };

        Header.prototype.doButtonAction = function(scope){};

        Header.prototype.getTitle = function(){
            return this.title;
        };

        Header.prototype.getShowButtonCSS = function(){
            return this.showButtonCSS;
        };

        Header.prototype.setShowButton = function(showButton){
            this.showButton = showButton;
        };

        Header.prototype.setShowButtonCSS = function(showButtonCSS){
            this.showButtonCSS = showButtonCSS;
        };

        Header.prototype.shouldShowButton = function(){
            return this.showButton
        };

        return Header;
    });