angular.module('feedService', ['Node'])

    .factory('$feedService', ['Node',
			function(Node){

				return {

					buildNodeFromFeedItemAttachment : function(feedItem){
						var nodeData = {
							childCount: null,
							dataSize: null,
							iconURL: null,
							id: feedItem.getAttachmentID(),
							isContainer: false,
							isFavorite: false,
							isHidden: false,
							isReadOnly: false,
							isReservable: false,
							isShareable: false,
							displayModifyDate: false,
							name: feedItem.getAttachmentName(),
							originDataID: null,
							permissions: null,
							reservedByUserName: null,
							shareClass: null,
							subtype: feedItem.getAttachmentSubtype(),
							versionNum: null
						};

						return new Node(nodeData);
					}
				}
			}]);