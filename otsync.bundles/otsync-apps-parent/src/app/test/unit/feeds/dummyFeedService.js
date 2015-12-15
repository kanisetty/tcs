angular.module('dummyFeedService', ['Feed', 'FeedItem'])

    .factory('$dummyFeedService', ['Feed', 'FeedItem', function(Feed, FeedItem){
        var _dummyFeedItemData = {
            "username": "Admin",
            "userID": "1000",
            "firstName": null,
            "lastName": null,
            "userTitle": null,
            "userLocation": null,
            "id": "10246",
            "name": "test1",
            "subType": 0,
            "header": null,
            "body": "some reply",
            "footer": null,
            "commentCount": 2,
            "likeCount": 0,
            "isLiked": false,
            "feed": "PulseContent",
            "parentID": null,
            "otagID": null,
            "createDate": "2015-07-27T16:37:20Z",
            "seqNo": 103,
            "conversationID": 102,
            "isFollowing": false,
            "userPhotoSuffix": null,
            "attachmentID": null,
            "attachmentName": null,
            "attachmentSubType": null,
            "inReplyToSeqNo": 102,
            "inReplyToUserID": "1000",
            "inReplyToUserName": "Admin",
            "inReplyToFirstName": null,
            "inReplyToLastName": null
            };

        var _dummyFeedData = {
            "items": [
                {
                    "username": "Admin1",
                    "userID": "1000",
                    "firstName": null,
                    "lastName": null,
                    "userTitle": null,
                    "userLocation": null,
                    "id": "10246",
                    "name": "test1",
                    "subType": 0,
                    "header": null,
                    "body": "some reply",
                    "footer": null,
                    "commentCount": 2,
                    "likeCount": 0,
                    "isLiked": false,
                    "feed": "PulseContent",
                    "parentID": null,
                    "otagID": null,
                    "createDate": "2015-07-27T16:37:20Z",
                    "seqNo": 103,
                    "conversationID": 102,
                    "isFollowing": false,
                    "userPhotoSuffix": null,
                    "attachmentID": null,
                    "attachmentName": null,
                    "attachmentSubType": null,
                    "inReplyToSeqNo": 102,
                    "inReplyToUserID": "1000",
                    "inReplyToUserName": "Admin",
                    "inReplyToFirstName": null,
                    "inReplyToLastName": null
                },
                {
                    "username": "Admin2",
                    "userID": "1000",
                    "firstName": null,
                    "lastName": null,
                    "userTitle": null,
                    "userLocation": null,
                    "id": "10246",
                    "name": "test1",
                    "subType": 0,
                    "header": null,
                    "body": "test",
                    "footer": null,
                    "commentCount": 2,
                    "likeCount": 1,
                    "isLiked": false,
                    "feed": "PulseContent",
                    "parentID": null,
                    "otagID": null,
                    "createDate": "2015-07-27T16:36:19Z",
                    "seqNo": 102,
                    "conversationID": 102,
                    "isFollowing": false,
                    "userPhotoSuffix": null,
                    "attachmentID": null,
                    "attachmentName": null,
                    "attachmentSubType": null,
                    "inReplyToSeqNo": null,
                    "inReplyToUserID": null,
                    "inReplyToUserName": null,
                    "inReplyToFirstName": null,
                    "inReplyToLastName": null
                },
                {
                    "username": "Admin3",
                    "userID": "1000",
                    "firstName": null,
                    "lastName": null,
                    "userTitle": null,
                    "userLocation": null,
                    "id": "null",
                    "name": null,
                    "subType": null,
                    "header": null,
                    "body": "test",
                    "footer": null,
                    "commentCount": 3,
                    "likeCount": 0,
                    "isLiked": false,
                    "feed": "PulseStatus",
                    "parentID": null,
                    "otagID": null,
                    "createDate": "2015-07-27T16:26:30Z",
                    "seqNo": 101,
                    "conversationID": 41,
                    "isFollowing": false,
                    "userPhotoSuffix": null,
                    "attachmentID": null,
                    "attachmentName": null,
                    "attachmentSubType": null,
                    "inReplyToSeqNo": 81,
                    "inReplyToUserID": "1000",
                    "inReplyToUserName": "Admin",
                    "inReplyToFirstName": null,
                    "inReplyToLastName": null
                },
                {
                    "username": "Admin4",
                    "userID": "1000",
                    "firstName": null,
                    "lastName": null,
                    "userTitle": null,
                    "userLocation": null,
                    "id": "null",
                    "name": null,
                    "subType": null,
                    "header": null,
                    "body": "test",
                    "footer": null,
                    "commentCount": 3,
                    "likeCount": 0,
                    "isLiked": false,
                    "feed": "PulseStatus",
                    "parentID": null,
                    "otagID": null,
                    "createDate": "2015-07-26T15:31:04Z",
                    "seqNo": 81,
                    "conversationID": 41,
                    "isFollowing": false,
                    "userPhotoSuffix": null,
                    "attachmentID": null,
                    "attachmentName": null,
                    "attachmentSubType": null,
                    "inReplyToSeqNo": 41,
                    "inReplyToUserID": "1000",
                    "inReplyToUserName": "Admin",
                    "inReplyToFirstName": null,
                    "inReplyToLastName": null
                },
                {
                    "username": "Admin5",
                    "userID": "1000",
                    "firstName": null,
                    "lastName": null,
                    "userTitle": null,
                    "userLocation": null,
                    "id": "null",
                    "name": null,
                    "subType": null,
                    "header": null,
                    "body": "test",
                    "footer": null,
                    "commentCount": 3,
                    "likeCount": 0,
                    "isLiked": false,
                    "feed": "PulseStatus",
                    "parentID": null,
                    "otagID": null,
                    "createDate": "2015-07-15T17:37:21Z",
                    "seqNo": 41,
                    "conversationID": 41,
                    "isFollowing": false,
                    "userPhotoSuffix": null,
                    "attachmentID": "14842",
                    "attachmentName": "zero6.txt",
                    "attachmentSubType": 144,
                    "inReplyToSeqNo": null,
                    "inReplyToUserID": null,
                    "inReplyToUserName": null,
                    "inReplyToFirstName": null,
                    "inReplyToLastName": null
                }
            ],
            "oldest": {
                "ContentServer": 41
            },
            "newest": {
                "ContentServer": 103
            },
            "cstoken": "WpT+6uSrf/IfU75xQmFUzELx4s8n5Og94q9phkwIzNRt12qM5bYSYlZGAMF4gN6d",
            "isMoreData": false
        };

		var _dummyLikesFeedData = {
			"cstoken": "RgTjxP7RIE8LdlDdx2XGyN8NW6OuoV2V/uGjPbw0nqc=",
			"likeCount": 1,
			"users": [
				{
					"displayName": "Mike Fehrenbach",
					"domain": 0,
					"email": null,
					"firstName": "Mike",
					"following": false,
					"lastName": "Fehrenbach",
					"phone": null,
					"userID": 1000,
					"userLocation": "somewhere in the middle of nowhere is where the office is",
					"userName": "Admin",
					"userPhotoSuffix": 18139,
					"userTitle": "Some Job title with a really really really really really really"
				},
				{
					"displayName": "John Matrix",
					"domain": 0,
					"email": null,
					"firstName": "John",
					"following": false,
					"lastName": "Matrix",
					"phone": null,
					"userID": 4252,
					"userLocation": "Some Location",
					"userName": "Admin",
					"userPhotoSuffix": 18200,
					"userTitle": "Some Title"
				}
			]
		};

        var _dummyFeedProviderData = [
            {
                "name": "PulseStatus",
                "localizedName": "Pulse Statuses",
                "color": "007CFF"
            },
            {
                "name": "PulseContent",
                "localizedName": "Pulse Content",
                "color": "AA4CAA"
            },
            {
                "name": "PulseMentions",
                "localizedName": "Pulse Mentions",
                "color": "58C246"
            },
            {
                "name": "PulseFollows",
                "localizedName": "Pulse Users I Follow",
                "color": "46C2C0"
            }
        ];

        return{
            getDummyFeed: function(){
				var feedItems = [];
				var feedItemsData = _dummyFeedData.items;

				if ( feedItemsData != null ){
					feedItemsData.forEach(function(feedItemData){
						feedItems.push(new FeedItem(feedItemData));
					});
				}

				var feed = new Feed(_dummyFeedData, feedItems);

				return feed;
            },

			getDummyFeedItem: function(){
				return new FeedItem(_dummyFeedItemData);
			},

            getDummyFeedData: function(){
                return _dummyFeedData;
            },

			getDummyLikesFeedData: function(){
				return _dummyLikesFeedData;
			},

            getDummyFeedProviderData: function(){
                return _dummyFeedProviderData;
            },

			getDummyFeedItemWithAttachmentUpdated: function(attachmentID, attachmentName, attachmentSubType){
				_dummyFeedItemData.attachmentID = attachmentID;
				_dummyFeedItemData.attachmentName = attachmentName ;
				_dummyFeedItemData.attachmentSubType = attachmentSubType;

				return new FeedItem(_dummyFeedItemData);
			},

			getDummyFeedItemWithCreateDateChanged: function(createDate){
				_dummyFeedItemData.createDate = createDate;

				return new FeedItem(_dummyFeedItemData);
			},

            getDummyFeedItemWithFeedItemTypeUpdated : function(feedType){
                _dummyFeedItemData.feed = feedType;

                return new FeedItem(_dummyFeedItemData);
            },

			getDummyFeedItemWithNamesUpdated : function(userName, firstName, lastName){
				_dummyFeedItemData.username = userName;
				_dummyFeedItemData.firstName = firstName;
				_dummyFeedItemData.lastName = lastName;

				return new FeedItem(_dummyFeedItemData);
			},

			getDummyPulseContentFeedItemWithCommentOn : function(){
				_dummyFeedItemData.name = "test1aa adfasdfasdfasdfasdfasfasfasfasfasfdasdfasfasfsafsafasfasfasfdasfafd";
				_dummyFeedItemData.feed = "PulseContent";
				_dummyFeedItemData.inReplyToSeqNo = 100;

				return new FeedItem(_dummyFeedItemData);
			},

            getDummyPulseContentFeedItemWithoutCommentOn : function(){
				_dummyFeedItemData.name = "test1aa adfasdfasdfasdfasdfasfasfasfasfasfdasdfasfasfsafsafasfasfasfdasfafd";
				_dummyFeedItemData.feed = "PulseContent";
				_dummyFeedItemData.inReplyToSeqNo = null;

                return new FeedItem(_dummyFeedItemData);
            },

            getDummyPulseStatusFeedItemWithCommentOn : function(userName, firstName, lastName){
				_dummyFeedItemData.name = "test1aa";
				_dummyFeedItemData.feed = "PulseStatus";
				_dummyFeedItemData.inReplyToSeqNo = 100;
				_dummyFeedItemData.inReplyToUserName = userName;
				_dummyFeedItemData.inReplyToFirstName = firstName;
				_dummyFeedItemData.inReplyToLastName = lastName;

                return new FeedItem(_dummyFeedItemData);
            },

            getDummyPulseStatusFeedItemWithoutCommentOn : function(){
				_dummyFeedItemData.name = "test1aa";
				_dummyFeedItemData.feed = "PulseStatus";
				_dummyFeedItemData.inReplyToSeqNo = null;
				_dummyFeedItemData.inReplyToUserName = null;
				_dummyFeedItemData.inReplyToFirstName = null;
				_dummyFeedItemData.inReplyToLastName = null;

                return new FeedItem(_dummyFeedData);
            }
        }
    }]);
