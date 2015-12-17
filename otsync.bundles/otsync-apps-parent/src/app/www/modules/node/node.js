angular.module('Node', [])

    .factory('Node', ['$sessionService', function ($sessionService) {

        var Node = function(nodeData, sharing) {
			var _nodeData = nodeData;
            var _iconURL = _nodeData.iconURL;
            var _isStored = false;
            var _isContainer = _nodeData.isContainer;
            var _name = _nodeData.name;
            var _sharing = sharing;

            this.getChildCount = function(){
                return _nodeData.childCount;
            };

            this.getDataSize = function(){
                return _nodeData.dataSize;
            };

            this.getIconURL = function(){
				var iconURL;

				try {
					if($sessionService.getGatewayURL()) {
						iconURL = $sessionService.getGatewayURL() + _iconURL;
					} else {
						throw "bad server url";
					}
				} catch(error) {
					iconURL = _isContainer ? "img/default_folder.png" : "img/default_file.png";
				}

				return iconURL;
            };

            this.getID = function() {
                return _nodeData.id;
            };

			this.getModifyDate = function(){
				return _nodeData.displayModifyDate;
			};

            this.getName = function() {
                return _name;
            };

            this.getOriginalID = function(){
                return _nodeData.originDataID;
            };

            this.getPermissions = function(){
                return _nodeData.permissions;
            };

            this.getReservedByUserName = function(){
                return _nodeData.reservedByUserName;
            };

            this.getSubtype = function() {
                return _nodeData.subtype;
            };

            this.getVersionNumber = function() {
                return _nodeData.versionNum;
            };

            this.isStored = function(){
                return _isStored;
            };

            this.isContainer = function() {
                return _isContainer;
            };

            this.isFavorite = function() {
                return _nodeData.isFavorite;
            };

            this.isHidden = function() {
                return _nodeData.isHidden;
            };

            this.isReadOnly = function() {
                return _nodeData.isReadOnly;
            };

            this.isReservable = function(){
                return _nodeData.isReservable;
            };

            this.setIsStored = function(isStored){
                _isStored = isStored;
            };

			this.sharing = function(){
				return _sharing;
			};

            this.toString = function(){
                return _name.toLowerCase();
            };
        };

        return Node;
    }]);
