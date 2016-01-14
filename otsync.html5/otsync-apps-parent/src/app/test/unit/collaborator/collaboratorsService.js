describe('collaboratorService getCollaboratorsAvailableForSharing tests', function(){
	var $collaboratorsService, $sessionService, $q, $rootScope, $stateParams, Collaborator, $displayMessageService, $dummyCollaboratorService;

	beforeEach(function(){
		module('collaboratorsService', 'Collaborator', 'emailService','dummyCollaboratorService');

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

		$stateParams = {};

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
		inject(function(_$collaboratorsService_, _$q_, _$rootScope_, _Collaborator_, _$dummyCollaboratorService_){
			$collaboratorsService = _$collaboratorsService_;
			$q = _$q_;
			$rootScope = _$rootScope_;
			Collaborator = _Collaborator_;
			$dummyCollaboratorService = _$dummyCollaboratorService_;
		});
	});

	it('should have no collaborators available for sharing if allCollaborators is empty', function() {
        var collaboratorsAvailableForSharing = [];
        var sharedCollaborators = [];
        var allCollaborators = [];

        var collaboratorsAvailableForSharing = $collaboratorsService.getCollaboratorsAvailableForSharing(sharedCollaborators, allCollaborators);

        expect(collaboratorsAvailableForSharing).toEqual([]);
    });

    it('should return allCollaborators for sharing if sharedCollaborators is empty', function() {
        var collaboratorsAvailableForSharing = [];
        var sharedCollaborators = [];
        var allCollaborators = [];

        allCollaborators.push($dummyCollaboratorService.getDummyCollaborator(true));

        var collaboratorsAvailableForSharing = $collaboratorsService.getCollaboratorsAvailableForSharing(sharedCollaborators, allCollaborators);
        var collaboratorForSharing = collaboratorsAvailableForSharing[0];

        expect(collaboratorsAvailableForSharing.length).toEqual(1);
        expect(collaboratorForSharing.getDisplayName()).toEqual('Admin');
    });

    it('should remove any items from allContents that are contained in sharedCollaborators before returning allContents for sharing', function() {
        var collaboratorsAvailableForSharing = [];
        var sharedCollaborators = [];
        var allCollaborators = [];
        var collaboratorData1 = {
            "is_accepted": false,
            "first_name": "",
            "user_name": "test1",
            "is_owner": false,
            "is_read_only": false,
            "is_external_user": false,
            "modify_date": "2015-06-08T13:21:27",
            "last_name": "",
            "user_id": 12111
        };
        var collaboratorData2 = {
            "is_accepted": false,
            "first_name": "",
            "user_name": "test2",
            "is_owner": false,
            "is_read_only": true,
            "is_external_user": false,
            "modify_date": "2015-06-08T13:21:27",
            "last_name": "",
            "user_id": 12111
        };

        var collaboratorData3 = {
            "is_accepted": false,
            "first_name": "",
            "user_name": "test3",
            "is_owner": false,
            "is_read_only": true,
            "is_external_user": false,
            "modify_date": "2015-06-08T13:21:27",
            "last_name": "",
            "user_id": 12111
        };

        sharedCollaborators.push(new Collaborator(collaboratorData1, true));
        allCollaborators.push(new Collaborator(collaboratorData3, true));
        allCollaborators.push(new Collaborator(collaboratorData1, true));
        allCollaborators.push(new Collaborator(collaboratorData2, true));

        var collaboratorsAvailableForSharing = $collaboratorsService.getCollaboratorsAvailableForSharing(sharedCollaborators, allCollaborators);
        var collaboratorForSharing1 = collaboratorsAvailableForSharing[0];
        var collaboratorForSharing2 = collaboratorsAvailableForSharing[1];

        expect(collaboratorsAvailableForSharing.length).toEqual(2);
        expect(collaboratorForSharing1.getDisplayName()).toEqual('test3');
        expect(collaboratorForSharing2.getDisplayName()).toEqual('test2');
    });
});
