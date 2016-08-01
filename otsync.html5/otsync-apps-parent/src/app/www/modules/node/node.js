angular.module('Node', [])

    .factory('Node', ['$sessionService', function ($sessionService) {

        var CATEGORY_TYPE = 131;
        var ACTIVE_VIEW_TYPE = 30309;
        var APPEARANCE_TYPE = 480;
        var CHANNEL_TYPE = 207;
        var COLLECTION_TYPE = 298;
        var COMPOUND_DOCUMENT_TYPE = 136;
        var CUSTOM_VIEW_TYPE = 146;
        var DISCUSSION_TYPE = 215;
        var DOCUMENT_TYPE = 144;
        var EMAIL_TYPE = 749;
        var EMAIL_FOLDER_TYPE = 751;
        var FOLDER_TYPE = 0;
        var FORM_TYPE = 223;
        var FORM_TEMPLATE_TYPE = 230;
        var LIVE_REPORT_TYPE = 299;
        var POLL_TYPE = 218;
        var PROJECT_TYPE = 202;
        var PROSPECTOR_TYPE = 384;
        var SHORTCUT_TYPE = 1;
        var TASK_LIST_TYPE = 204;
        var TEXT_DOCUMENT_TYPE = 145;
        var URL_TYPE = 140;
        var VIRTUAL_FOLDER_TYPE = 899;
        var WORKFLOW_MAP_TYPE = 128;
        var WORKFLOW_STATUS_TYPE = 190;
        var XML_DTD_TYPE = 335;

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

            this.isDocument = function () {
                return this.getSubtype() === DOCUMENT_TYPE;
            };

            this.isFolder = function () {
                return this.getSubtype() === FOLDER_TYPE;
            };

            this.toString = function(){
                return _name.toLowerCase();
            };
        };

        return Node;
    }]);
