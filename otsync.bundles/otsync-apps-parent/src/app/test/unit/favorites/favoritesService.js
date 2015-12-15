describe('favoritesService doSync tests', function(){
    var $nodeService, $q, $nodeBrowseDecoratingService, $sessionService, $rootScope, $displayMessageService, $cacheService, $favoritesService, $fileService,
        $actionService, $stateParams, $urlEncode;
    var favorites = [
        {
            "id": 7273,
            "parentID": 2000,
            "name": "aaFolder",
            "subtype": 0,
            "mimeType": null,
            "childCount": 15,
            "dataSize": null,
            "modifyDate": "2015-07-20T16:36:47Z",
            "isShared": false,
            "modifyUserName": "Admin",
            "modifyUser": "Admin",
            "modifyUserID": 1000,
            "sharedFolder": 0,
            "isShareable": true,
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
            "numComments": 2,
            "isFavorite": true,
            "permissions": -2130706433,
            "userID": 1000,
            "ownerUser": "Admin",
            "ownerName": "Admin",
            "createdByUser": "Admin",
            "shareClass": null,
            "isReservable": false,
            "reservedByUserName": null,
            "displayCreateDate": "2015-03-02T14:18:32Z",
            "displayModifyDate": "2015-07-20T16:36:47Z",
            "nodeCreatedDate": null,
            "nodeModifiedDate": null,
            "parentCreatedDate": null,
            "parentModifiedDate": null,
            "isHidden": false,
            "iconURL": "\\/content\\/img\\/browse_folder_icon_large.png"
        },
        {
            "id": 21432,
            "parentID": 21312,
            "name": "test.xlsx",
            "subtype": 144,
            "mimeType": "application\\/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "childCount": 0,
            "dataSize": 8016,
            "modifyDate": "2015-03-31T20:51:04Z",
            "isShared": false,
            "modifyUserName": "Admin",
            "modifyUser": "Admin",
            "modifyUserID": 1000,
            "sharedFolder": 0,
            "isShareable": false,
            "isRootShare": false,
            "isReadOnly": false,
            "versionNum": 13,
            "dataHash": null,
            "isNotifySet": false,
            "isSubscribed": null,
            "isContainer": false,
            "originSubtype": null,
            "originTypeName": null,
            "originDataID": 0,
            "thumbnailEnabled": false,
            "rootType": "EWS",
            "numComments": 0,
            "isFavorite": true,
            "permissions": -2130706433,
            "userID": 1000,
            "ownerUser": "Admin",
            "ownerName": "Admin",
            "createdByUser": "Admin",
            "shareClass": null,
            "isReservable": true,
            "reservedByUserName": null,
            "displayCreateDate": "2015-03-31T20:10:26Z",
            "displayModifyDate": "2015-03-31T20:51:04Z",
            "nodeCreatedDate": null,
            "nodeModifiedDate": null,
            "parentCreatedDate": null,
            "parentModifiedDate": null,
            "isHidden": false,
            "iconURL": "\\/content\\/img\\/mimetypes\\/large\\/XLS.png"
        }
    ];

    beforeEach(module('favoritesService', 'nodeService'));

    beforeEach(function(){
		$stateParams = {};
        $nodeService = {};
        $cacheService = {};
        $fileService = {};
		$actionService = {};
        $urlEncode = {};

        $sessionService = {
            getGatewayURL: function () {
                return 'Some URL';
            },

            runRequest: function(){},
            getCSToken: function(){
                return 'SomeToken';
            },
            getClientType:function(){
                return 'all';
            },
            isOnline:function(){
                return true;
            }
        };

		$nodeBrowseDecoratingService = {
            //just return the nodes without any changes for now
			decorateNodeChildrenForBrowse: function(){
                return null;
            }
        };

        $displayMessageService = {
            translate: function (inputString) {
                return inputString;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$nodeBrowseDecoratingService', $nodeBrowseDecoratingService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$nodeService', $nodeService);
            $provide.value('$cacheService', $cacheService);
            $provide.value('$fileService', $fileService);
			$provide.value('$actionService', $actionService);
			$provide.value('$stateParams', $stateParams);
            $provide.value('$urlEncode', $urlEncode);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$q_, _$rootScope_, _$favoritesService_){
            $q = _$q_;
            $rootScope = _$rootScope_;
            $favoritesService = _$favoritesService_;
        });
    });

    it('should return favorites if the sync was successful', function() {
        var _favorites;

        spyOn($favoritesService, 'getFavorites').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(favorites);
            return deferred.promise;
        });

        spyOn($favoritesService, 'downloadAndCacheFavorites').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(favorites);
            return deferred.promise;
        });

        $favoritesService.doSync().then(function(favorites){
            _favorites = favorites;
        });

        $rootScope.$digest();

        expect(_favorites).toEqual(favorites);
    });
});
