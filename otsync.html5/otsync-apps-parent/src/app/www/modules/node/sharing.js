angular.module('Sharing', [])

    .factory('Sharing', function () {
        var ENTERPRISE_SHARE_CLASS = 2;
        var SHARED_TO_ME = 2;

        var Sharing = function (shareData) {
            var _isShared = shareData.isShared;
            var _shareFolder = shareData.sharedFolder;
            var _isShareable = shareData.isShareable;
            var _isRootShare = shareData.isRootShare;
            var _shareClass = shareData.shareClass;
            var _rootType = shareData.rootType;

            this.isAShare = function () {
                return _shareClass != null;
            };

            this.isTempo = function () {
                return _rootType === 'TEMPO';
            };

            this.isAnEnterpriseShare = function () {
                return _shareClass == ENTERPRISE_SHARE_CLASS;
            };

            this.isRootShare = function () {
                return _isRootShare;
            };

            this.isShared = function () {
                return _isShared;
            };

            this.isShareable = function () {
                return _isShareable;
            };

            this.isSharedToMe = function () {
                return _shareFolder == SHARED_TO_ME;
            };
        };

        return Sharing;
    });
