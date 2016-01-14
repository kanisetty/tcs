angular.module('dummyNodeService', ['Node'])

    .factory('$dummyNodeService', ['Node', function(Node){
        var _dummyNodeData = {
            "id": 2000,
            "parentID": -1,
            "name": "Enterprise",
            "subtype": 141,
            "mimeType": null,
            "childCount": 7,
            "dataSize": null,
            "modifyDate": "2015-07-22T19:12:15Z",
            "isShared": false,
            "modifyUserName": "Admin",
            "modifyUser": "Admin",
            "modifyUserID": 1000,
            "sharedFolder": 0,
            "isShareable": false,
            "isRootShare": false,
            "isReadOnly": false,
            "versionNum": 0,
            "dataHash": null,
            "isNotifySet": false,
            "isSubscribed": null,
            "isContainer": true,
            "originSubtype": null,
            "originTypeName": null,
            "originDataID": 0,
            "thumbnailEnabled": false,
            "rootType": "EWS",
            "numComments": 0,
            "isFavorite": false,
            "permissions": -2130706433,
            "userID": 1000,
            "ownerUser": "Admin",
            "ownerName": "Admin",
            "createdByUser": "Admin",
            "shareClass": null,
            "isReservable": false,
            "reservedByUserName": null,
            "displayCreateDate": "2015-06-24T16:15:47Z",
            "displayModifyDate": "2015-07-22T19:12:15Z",
            "nodeCreatedDate": null,
            "nodeModifiedDate": null,
            "parentCreatedDate": null,
            "parentModifiedDate": null,
            "isHidden": false,
            "iconURL": "/content/img/browse_folder_icon_large.png"
        };

        return{
            getDummyNode: function(){
                return new Node(_dummyNodeData);
            },

            getFavorite: function(){
                _dummyNodeData.isReadOnly = false;
                _dummyNodeData.isFavorite = true;

                return new Node(_dummyNodeData);
            },

            getHiddenNode: function(){
                _dummyNodeData.isHidden = true;
                return new Node(_dummyNodeData);
            },

            getNodeData: function(){
                return _dummyNodeData;
            },

            getNodeDataWithIDAndNameChanged: function(name, id){
                _dummyNodeData.name = name;
                _dummyNodeData.id = id;

                return _dummyNodeData;
            },

            getNodeForDisplay: function(isHidden, isContainer, iconURL, childCount, displayModifyDate, dataSize){
                _dummyNodeData.isHidden = isHidden;
                _dummyNodeData.isContainer = isContainer;
                _dummyNodeData.iconURL = iconURL;
                _dummyNodeData.childCount = childCount;
                _dummyNodeData.displayModifyDate = displayModifyDate;
                _dummyNodeData.dataSize = dataSize;

                return new Node(_dummyNodeData);
            },

			getNodeWithIsContainerUpdated: function(isContainer){
				_dummyNodeData.isContainer = isContainer;

				return new Node(_dummyNodeData);
			},

            getNodeWithModifyDateUpdated: function(displayModifyDate){
                _dummyNodeData.displayModifyDate = displayModifyDate;

                return new Node(_dummyNodeData);
            },

            getNodeWithNameAndPermsUpdated: function(name, permissions){
                _dummyNodeData.name = name;
                _dummyNodeData.permissions = permissions;

                return new Node(_dummyNodeData);
            },

            getNodeWithNameUpdated: function(name){
                _dummyNodeData.name = name;

                return new Node(_dummyNodeData);
            },

            getNodeWithSubtypeUpdated: function(subtype){
                _dummyNodeData.subtype = subtype;

                return new Node(_dummyNodeData);
            },

            getReadOnlyFavorite: function(){
                _dummyNodeData.isReadOnly = true;
                _dummyNodeData.isFavorite = true;

                return new Node(_dummyNodeData);
            },

            getReadOnlyNode: function(){
                _dummyNodeData.isReadOnly = true;

                return new Node(_dummyNodeData);
            }
        }
    }]);
