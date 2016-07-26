angular.module('FeedItem', ['userDisplayService'])
    .factory('FeedItem', ['$sessionService', '$displayMessageService', '$userDisplayService', function ($sessionService, $displayMessageService, $userDisplayService) {

        var FeedItem = function(feedItemData) {
			var _feedItemData = feedItemData;
			var _attachmentMimeTypeImgURL = $sessionService.getGatewayURL() + _feedItemData.attachmentMimeTypeImgURL;
			var _createDate = _feedItemData.createDate;
			var _feedItemType = _feedItemData.feed;
			var _firstName = _feedItemData.firstName;
			var _iconURL = $sessionService.getGatewayURL() + '/content/v5/users/' + _feedItemData.userID + '/photo';
			var _inReplyToSeqNum = _feedItemData.inReplyToSeqNo;
			var _lastName = _feedItemData.lastName;
			var _name = _feedItemData.name;
            var _username = _feedItemData.username || _feedItemData.displayName;

			this.getAttachmentID = function(){
				return _feedItemData.attachmentID;
			};

			this.getAttachmentName = function(){
				return _feedItemData.attachmentName;
			};

			this.getAttachmentMimeTypeImgURL = function(){
				return _attachmentMimeTypeImgURL;
			};

			this.getAttachmentSubtype = function(){
				return _feedItemData.attachmentSubType;
			};

			this.getCommentCount = function(){
				return _feedItemData.commentCount;
			};

			this.getCommentedOn = function(){
				var commentedOn = '';

				if (_feedItemType == "PulseContent" && _inReplyToSeqNum != null){
					commentedOn = $displayMessageService.translate("COMMENTED ON") + " " + _name;
				} else if (_feedItemType == "PulseStatus" && _inReplyToSeqNum != null){
					var displayName = $userDisplayService.getDisplayName(_feedItemData.inReplyToUserName, _feedItemData.inReplyToFirstName, _feedItemData.inReplyToLastName);
					commentedOn = $displayMessageService.translate("COMMENTED ON") + " " + displayName + " " + $displayMessageService.translate("STATUS");
				}

				return commentedOn;
			};

			this.getConversationID = function(){
				return _feedItemData.conversationID;
			};

			this.getCreateDate = function(){
				return _createDate;
			};

			this.getDisplayName = function() {

				return $userDisplayService.getDisplayName(_username, _firstName, _lastName)
			};

            this.getIconURL = function(){
                return _iconURL;
            };

			this.getLikeCount = function(){
				return _feedItemData.likeCount
			};

			this.getLocation = function(){
				return _feedItemData.userLocation;
			};

			this.getMessage = function(){
				return _feedItemData.body;
			};

			this.getPosition = function(){
				return _feedItemData.userTitle;
			};

			this.getProviderType = function(){
				return _feedItemData.feed;
			};

			this.getSequenceNumber = function(){
				return _feedItemData.seqNo;
			};

            this.getUsername = function() {
                return _username;
            };

			this.incrementCommentCount = function(){
				_feedItemData.commentCount += 1;
			};


			this.isFollowing = function() {
				return _feedItemData.isFollowing;
			};

			this.isLiked = function() {
				return _feedItemData.isLiked;
			};

			this.setIsFollowing = function(isFollowing) {
				_feedItemData.isFollowing = isFollowing;
			};

			this.setIsLiked = function(isLiked) {

				if (isLiked == true){
					_feedItemData.likeCount += 1;
				} else{
					_feedItemData.likeCount -= 1;
				}

				_feedItemData.isLiked = isLiked;
			};

            this.toString = function(){
                return _createDate.toLowerCase();
            };
        };

        return FeedItem;
    }]);
