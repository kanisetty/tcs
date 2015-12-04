angular.module('FeedItemBrowseDecorator', ['BrowseDecorator'])

    .factory('FeedItemBrowseDecorator', ['BrowseDecorator', function (BrowseDecorator) {
        var FeedItemBrowseDecorator = function(feedItem, title, indent, templateURL) {
            this.decoratedObject = feedItem;
            this.title = title;
            this.createDateDisplay = '';
			this.indent = indent;
			this.templateURL = templateURL;
		};

        FeedItemBrowseDecorator.prototype = new BrowseDecorator();

		FeedItemBrowseDecorator.prototype.doIndent = function(){
			return this.indent;
		};

        FeedItemBrowseDecorator.prototype.getCreateDateDisplay = function(){
            return this.createDateDisplay;
        };

        FeedItemBrowseDecorator.prototype.getTemplateURL = function(){
            return this.templateURL;
        };

        FeedItemBrowseDecorator.prototype.setCreateDateDisplay = function(createDateDisplay){
            this.createDateDisplay = createDateDisplay;
        };

        return FeedItemBrowseDecorator;
    }]);
