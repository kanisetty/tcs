angular.module('nodeBrowseDecoratingService', ['NodeBrowseDecorator'])

.factory('$nodeBrowseDecoratingService', ['$sessionService', '$displayMessageService', '$cacheService', 'NodeBrowseDecorator', function($sessionService, $displayMessageService, $cacheService, NodeBrowseDecorator){
        var addParam = function (url, key, value) {

            var sep = url.indexOf('?') == -1 ? "?" : "&";
            return url + sep + key + "=" + value;
        };
    return{

        decorateNodeChildrenForBrowse: function(nodeChildren){
            var browseDecorators = [];
            var self = this;

            if (nodeChildren != null){

                for(var i = nodeChildren.length - 1; i >= 0; i -= 1){

                    var node = nodeChildren[i];
                    if (node.isHidden() == true){

                        nodeChildren.splice(i, 1);
                    }
                    else {
                        var browseDecorator = self.decorateNodeForBrowse(node);
                        browseDecorators.push(browseDecorator);
                    }
                }
            }

            return browseDecorators.sort();
        },

        decorateNodeForBrowse: function(node) {
            var browseDecorator = null;
            var detail = '';
            var title = node.getName();
            var self = this;

            if (node.isContainer() == true) {
                detail = node.getChildCount() + ' ' + $displayMessageService.translate('ITEMS') + ' ' + this.getDisplayModifiedDate(node);
            } else {
                detail = this.getDisplayFileSize(node.getDataSize()) + ' ' + this.getDisplayModifiedDate(node);
            }

            browseDecorator = new NodeBrowseDecorator(node, title);
			browseDecorator.setDetail(detail);
            self.setOverlays(browseDecorator, node);

            return browseDecorator;
        },

        getDisplayFileSize: function (bytes){
            var displaySize = '';
            var sizes = [$displayMessageService.translate('BYTES'), 'KB', 'MB', 'GB', 'TB'];

            if (bytes == 0 || bytes == null){
                displaySize = $displayMessageService.translate('ZERO_BYTES');
            }else{
                var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                if (sizes[i] != null){
                    displaySize = Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
                }
            }
            return displaySize;
        },

        getDisplayModifiedDate: function(node){
            var displayModifiedDate = '';

            if ( node != null && node.getModifyDate() != null && node.getModifyDate().length > 0){
                var nodeModifiedDateElements = node.getModifyDate().split("T");
                displayModifiedDate += $displayMessageService.translate('UPDATED')+ ' ' + nodeModifiedDateElements[0];
            }

            return displayModifiedDate;
        },

        setOverlays: function(nodeBrowseDecorator, node){
            var isReadOnly = node.isReadOnly();
            var isFavorite = node.isFavorite();

            //Add readonly overlay
            if(isReadOnly) {
				nodeBrowseDecorator.setBottomRightOverlayCSS("readonly-overlay");
            }

            //Add favorite overlay
            if(isFavorite) {
                if(!isReadOnly) {
					nodeBrowseDecorator.setBottomRightOverlayCSS("favorite-overlay");
                    if($cacheService.isNodeCachable(node) && !node.isCached())
						nodeBrowseDecorator.setBottomMiddleOverlayCSS("favorite-unavailable-overlay");
                } else{
					nodeBrowseDecorator.setBottomMiddleOverlayCSS("favorite-overlay");
                    if($cacheService.isNodeCachable(node) && !node.isCached())
						nodeBrowseDecorator.setBottomLeftOverlayCSS("favorite-unavailable-overlay");
                }
            }

            if(node.getSubtype() == 1)
				nodeBrowseDecorator.setTopLeftOverlayCSS("overlay-shortcut");

            if(node.getReservedByUserName() != null)
				nodeBrowseDecorator.setReserveIconCSS("reserve-icon");
        }
    }
}]);
