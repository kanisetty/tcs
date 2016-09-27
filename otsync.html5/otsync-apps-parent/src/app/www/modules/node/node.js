angular.module('Node', ['Sharing'])

    .factory('Node', ['$sessionService', 'Sharing', function ($sessionService, Sharing) {

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
        /**
         * ios webview supported file types based on apple technical document
         * https://developer.apple.com/library/content/qa/qa1630/_index.html#//apple_ref/doc/uid/DTS40008749
         *
         */
        var OFFLINE_EXTENSION_WHITELIST = [
            'jpg', 'jpeg', 'gif', 'png', 'xls', 'xlsx', 'pdf', 'ppt', 'pptx', 'doc', 'docx', 'rtf', 'txt'
        ];

        var IMAGE_EXTENSION_WHITELIST = [
            'jpg', 'jpeg', 'gif', 'png'
        ];

        var Node = function (nodeData, sharing) {
            var _nodeData = nodeData;
            var _iconURL = _nodeData.iconURL;
            var _isStored = false;
            var _isContainer = _nodeData.isContainer;
            var _name = _nodeData.name;
            var _sharing = sharing;

            this.getChildCount = function () {
                return _nodeData.childCount;
            };

            this.getDataSize = function () {
                return _nodeData.dataSize || 0;
            };

            this.getIconURL = function () {
                var iconURL;

                try {
                    if ($sessionService.getGatewayURL()) {
                        iconURL = $sessionService.getGatewayURL() + _iconURL;
                    } else {
                        throw "bad server url";
                    }
                } catch (error) {
                    iconURL = _isContainer ? "img/default_folder.png" : "img/default_file.png";
                }

                return iconURL;
            };

            this.getID = function () {
                return _nodeData.id;
            };

            this.getModifyDate = function () {
                return _nodeData.displayModifyDate;
            };

            this.getName = function () {
                return _name;
            };

            this.getOriginalID = function () {
                return _nodeData.originDataID;
            };

            this.getPermissions = function () {
                return _nodeData.permissions;
            };

            this.getReservedByUserName = function () {
                return _nodeData.reservedByUserName;
            };

            this.getSubtype = function () {
                return _nodeData.subtype;
            };

            this.getVersionNumber = function () {
                return _nodeData.versionNum;
            };

            this.getParentID = function () {
                return _nodeData.parentID;
            };

            this.isStored = function () {
                return _isStored;
            };

            this.isContainer = function () {
                return _isContainer;
            };

            this.isFavorite = function () {
                return _nodeData.isFavorite;
            };

            this.isHidden = function () {
                return _nodeData.isHidden;
            };

            this.isReadOnly = function () {
                return _nodeData.isReadOnly;
            };

            this.isReservable = function () {
                return _nodeData.isReservable;
            };

            this.setIsStored = function (isStored) {
                _isStored = isStored;
            };

            this.sharing = function () {
                return _sharing;
            };

            this.isDocument = function () {
                return this.getSubtype() === DOCUMENT_TYPE;
            };

            this.isEmail = function () {
                return this.getSubtype() === EMAIL_TYPE;
            };

            this.isShortcut = function () {
                return this.getSubtype() === SHORTCUT_TYPE;
            };

            this.isFolder = function () {
                return this.getSubtype() === FOLDER_TYPE;
            };

            this.toString = function () {
                return _name.toLowerCase();
            };

            this.toJson = function () {
                return _nodeData;
            };

            this.isOfflineType = function () {
                // checking filename. admittedly not the best check
                // TODO does content server return content type in the metadata?
                // if so get the content type from that and return
                var extension = (this.toString() || '').split('.').pop();
                return OFFLINE_EXTENSION_WHITELIST.indexOf(extension.toLowerCase()) > -1;
            };

            this.isImageType = function () {
                var extension = (this.toString() || '').split('.').pop();
                return IMAGE_EXTENSION_WHITELIST.indexOf(extension.toLowerCase()) > -1;
            };

            this.canViewOffline = function () {
                return this.isOfflineType();
            };

            this.getFileNameForOnDeviceStorage = function () {
                return this.getID() + "_" + this.getVersionNumber() + "_" + this.getName();
            };
        };

        Node.fromJson = function (nodeData) {
            var sharing = new Sharing(nodeData);
            return new Node(nodeData, sharing);
        };

        return Node;
    }]);
