describe('Collaborator tests', function(){
    var Collaborator, $sessionService, $dummyCollaboratorService;

    beforeEach(function(){
        module('Collaborator', 'dummyCollaboratorService');

        $sessionService = {
            getGatewayURL: function () {
                return 'SomeURL';
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_Collaborator_, _$dummyCollaboratorService_){
            Collaborator = _Collaborator_;
			$dummyCollaboratorService = _$dummyCollaboratorService_;
        });
    });

    it('should show the username as the displayname if first and last name are missing', function() {
        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithFirstNameLastNameAndDisplayNameUpdated(null, null, '');

        expect(collaborator.getDisplayName()).toEqual(collaborator.getCollaboratorName());
    });

    it('should show the username as the displayname if the first name is missing', function() {
        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithFirstNameLastNameAndDisplayNameUpdated(null, "SomeLastName", '');

        expect(collaborator.getDisplayName()).toEqual(collaborator.getCollaboratorName());
    });

    it('should show the username as the displayname if the last name is missing', function() {
        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithFirstNameLastNameAndDisplayNameUpdated("SomeFirstName", null, '');

        expect(collaborator.getDisplayName()).toEqual(collaborator.getCollaboratorName());
    });

    it('should show the first and last name as the displayname if they are both present', function() {
        var firstName = 'Mike';
        var lastName = 'Fehrenbach';

        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithFirstNameLastNameAndDisplayNameUpdated(firstName, lastName, '');

        expect(collaborator.getDisplayName()).toEqual(firstName + ' ' + lastName);
    });

    it('should show the display name if it is passed in', function() {
        var firstName = 'Mike';
        var lastName = 'Fehrenbach';
        var displayName = 'SomeDisplayName';

        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithFirstNameLastNameAndDisplayNameUpdated(firstName, lastName, displayName);

        expect(collaborator.getDisplayName()).toEqual(displayName);
    });

    it('should show the first name and last name if display name is empty', function() {
        var firstName = 'Mike';
        var lastName = 'Fehrenbach';
        var displayName = '';

        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithFirstNameLastNameAndDisplayNameUpdated(firstName, lastName, displayName);

        expect(collaborator.getDisplayName()).toEqual(firstName + ' ' + lastName);
    });

    it('should return pending if the collaborator is not an owner and the share request has not been accepted', function() {
        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsAcceptedAndIsOwnerUpdated(false, false);

        expect(collaborator.isPendingCollaborator()).toEqual(true);
    });

    it('should not return pending if the collaborator accepted the share request and is not the owner', function() {
        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsAcceptedAndIsOwnerUpdated(true, false);

        expect(collaborator.isPendingCollaborator()).toEqual(false);
    });

    it('should not return pending if the collaborator has not accepted the share request but is the owner', function() {
        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsAcceptedAndIsOwnerUpdated(false, true);

        expect(collaborator.isPendingCollaborator()).toEqual(false);
    });

    it('should return true if a collaborator is the owner of a share ', function() {
        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsOwnerUpdated(true);

        expect(collaborator.isOwnerOfShare()).toEqual(true);
    });

    it('should return false if a collaborator is not the owner of a share ', function() {
		var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsOwnerUpdated(false);

        expect(collaborator.isOwnerOfShare()).toEqual(false);
    });

    it('should return true if a collaborator is read only', function() {
		var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsReadOnlyUpdated(true);

        expect(collaborator.isReadOnlyCollaborator()).toEqual(true);
    });

    it('should return false if a collaborator is not read only', function() {
		var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsReadOnlyUpdated(false);

        expect(collaborator.isReadOnlyCollaborator()).toEqual(false);
    });

    it('should return true if a collaborator is an external user', function() {
		var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsExternalUserUpdated(true);

        expect(collaborator.isExternalCollaborator()).toEqual(true);
    });

    it('should return false if a collaborator is not an external user', function() {
		var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsExternalUserUpdated(false);

        expect(collaborator.isExternalCollaborator()).toEqual(false);
    });

    it('should return the photoURL of the collaborator', function() {
        var dummyUserID = 123456;
        var expectedPhotoURL = $sessionService.getGatewayURL() + '/content/v4/users/' + dummyUserID + '/photo';

		var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithUserIDUpdated(dummyUserID);

        expect(collaborator.getPhotoURL()).toEqual(expectedPhotoURL);
    });

    it('should not be removable if the collaborator is the owner of the share', function() {
		var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsOwnerUpdated(true);

        expect(collaborator.isRemovable()).toEqual(false);
    });

    it('should not be removable if the collaborator is not the owner of the share but the collaborator is not changeable', function() {
        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsOwnerUpdated(false, false);

        expect(collaborator.isRemovable()).toEqual(false);
    });

    it('should be removable if the collaborator is not the owner of the share and the collaborator is changeable', function() {
        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsOwnerUpdated(false, true);

        expect(collaborator.isRemovable()).toEqual(true);
    });

    it('should return a correct collaborator name', function() {
        var collaboratorName = 'Test1';

        var collaborator = $dummyCollaboratorService.getDummyCollaboratorWithIsUserNameUpdated(collaboratorName);

        expect(collaborator.getCollaboratorName()).toEqual(collaboratorName);
    });
});
