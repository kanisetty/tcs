describe('collaboratorsResource collaboratorSearch tests', function(){
    var $collaboratorsResource, $sessionService, $q, $rootScope, $stateParams, Collaborator, $displayMessageService, $dummyCollaboratorService, $dummyNodeService;

    beforeEach(function(){
        module('collaboratorsResource', 'Collaborator', 'emailService','dummyCollaboratorService', 'dummyNodeService');

        $sessionService = {
            getGatewayURL: function () {
                return 'SomeURL';
            },

            runRequest: function(){},
            getCSToken: function(){
                return 'SomeToken'
            },
            canInviteExternalUsers: function(){}
        };

        $stateParams = {
            node : {
                sharing: function(){
                    return {
                        isShareable: function(){}
                    }
                }
            }
        };

        $displayMessageService = {
            translate: function (inputString) {
                return inputString;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$stateParams', $stateParams);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$collaboratorsResource_, _$q_, _$rootScope_, _Collaborator_, _$dummyCollaboratorService_, _$dummyNodeService_){
            $collaboratorsResource = _$collaboratorsResource_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            Collaborator = _Collaborator_;
            $dummyCollaboratorService = _$dummyCollaboratorService_;
            $dummyNodeService = _$dummyNodeService_;
        });
    });

    it('should return a list of collaborators if users were found while searching that is sorted by collaboratorName', function() {
        var _collaborators;
        var dummyQueryFilter = '';
        var response = {
            "users": [
                {
                    "firstName": null,
                    "userID": 5971,
                    "lastName": null,
                    "userName": "test1",
                    "usage": 0,
                    "isExternal": false
                },
                {
                    "firstName": null,
                    "userID": 5974,
                    "lastName": null,
                    "userName": "test2",
                    "usage": 0,
                    "isExternal": false
                },
                {
                    "firstName": null,
                    "userID": 10247,
                    "lastName": null,
                    "userName": "fehrenbach.mike@gmail.com",
                    "usage": 0,
                    "isExternal": true
                }
            ]};

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(response);
            return deferred.promise;
        });

        $collaboratorsResource.collaboratorSearch(dummyQueryFilter, true).then(function(collaborators){
            _collaborators = collaborators;
        });

        $rootScope.$digest();

        var collaboratorExternalUser = _collaborators[0];
        var collaboratorTest1 = _collaborators[1];
        var collaboratorTest2 = _collaborators[2];

        expect(collaboratorTest1.getCollaboratorName()).toEqual('test1');
        expect(collaboratorTest1.isReadOnlyCollaborator()).toEqual(true);
        expect(collaboratorTest2.getCollaboratorName()).toEqual('test2');
        expect(collaboratorTest2.isReadOnlyCollaborator()).toEqual(true);
        expect(collaboratorExternalUser.getCollaboratorName()).toEqual('fehrenbach.mike@gmail.com');
        expect(collaboratorExternalUser.isExternalCollaborator()).toEqual(true);
        expect(collaboratorExternalUser.isReadOnlyCollaborator()).toEqual(true);
    });

    it('should return an empty list of collaborators if no users were found and no valid email was passed', function() {
        var _collaborators;
        var dummyQueryFilter = '';
        var response = {
            "users": []
        };

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(response);
            return deferred.promise;
        });

        spyOn($sessionService, 'canInviteExternalUsers').and.returnValue(true);

        $collaboratorsResource.collaboratorSearch(dummyQueryFilter, false).then(function(collaborators){
            _collaborators = collaborators;
        });

        $rootScope.$digest();

        expect(_collaborators).toEqual([]);
    });

    it('should return an empty list of collaborators if no users were found and the user does not have invite privileges', function() {
        var _collaborators;
        var dummyQueryFilter = 'test@test.com';
        var response = {
            "users": []
        };

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(response);
            return deferred.promise;
        });

        spyOn($sessionService, 'canInviteExternalUsers').and.returnValue(false);

        $collaboratorsResource.collaboratorSearch(dummyQueryFilter, false).then(function(collaborators){
            _collaborators = collaborators;
        });

        $rootScope.$digest();

        expect(_collaborators).toEqual([]);
    });

    it('should return an invite collaborator if no users were found the user has invite privileges and the query is a valid email address', function() {
        var _collaborators;
        var dummyQueryFilter = 'test@test.com';
        var response = {
            "users": []
        };

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(response);
            return deferred.promise;
        });

        spyOn($sessionService, 'canInviteExternalUsers').and.returnValue(true);

        $collaboratorsResource.collaboratorSearch(dummyQueryFilter, false).then(function(collaborators){
            _collaborators = collaborators;
        });

        $rootScope.$digest();

        var inviteCollaborator = _collaborators[0];

        expect(inviteCollaborator.getDisplayName()).toEqual("INVITE EXTERNAL USER");
        expect(inviteCollaborator.getCollaboratorName()).toEqual(dummyQueryFilter);
    });
});

describe('collaboratorsResource getCollaborators tests', function(){
    var $collaboratorsResource, $sessionService, $q, $rootScope, $stateParams, Collaborator, $displayMessageService, $dummyCollaboratorService;

    beforeEach(function(){
        module('collaboratorsResource', 'Collaborator', 'emailService','dummyCollaboratorService');

        $sessionService = {
            getGatewayURL: function () {
                return 'SomeURL';
            },

            runRequest: function(){},
            getCSToken: function(){
                return 'SomeToken'
            },
            canInviteExternalUsers: function(){}
        };

        $stateParams = {
            node : {
                sharing: function(){
                    return {
                        isShareable: function(){}
                    }
                }
            }
        };

        $displayMessageService = {
            translate: function (inputString) {
                return inputString;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
            $provide.value('$stateParams', $stateParams);
            $provide.value('$displayMessageService', $displayMessageService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$collaboratorsResource_, _$q_, _$rootScope_, _Collaborator_, _$dummyCollaboratorService_){
            $collaboratorsResource = _$collaboratorsResource_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            Collaborator = _Collaborator_;
            $dummyCollaboratorService = _$dummyCollaboratorService_;
        });
    });

    it('should be able to get a list of collaborators from the server that is sorted by collaboratorName', function() {
        var _collaborators;
        var dummyNodeID = 1234;
        var dummyNode = {
            getID: function(){
                return dummyNodeID;
            }
        };
        var response = $dummyCollaboratorService.getDummyCollaboratorData();

        spyOn($sessionService, 'runRequest').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(response);
            return deferred.promise;
        });

        $collaboratorsResource.getCollaborators(dummyNode).then(function(collaborators){
            _collaborators = collaborators;
        });

        $rootScope.$digest();

        var collaboratorOwner = _collaborators[0];
        var collaboratorExternal = _collaborators[1];
        var collaboratorTest1 = _collaborators[2];

        expect(collaboratorTest1.getDisplayName()).toEqual('test1');
        expect(collaboratorExternal.getDisplayName()).toEqual('Mike Fehrenbach');
        expect(collaboratorExternal.isExternalCollaborator()).toEqual(true);
        expect(collaboratorOwner.getDisplayName()).toEqual('Admin');
        expect(collaboratorOwner.isOwnerOfShare()).toEqual(true);
    });
});