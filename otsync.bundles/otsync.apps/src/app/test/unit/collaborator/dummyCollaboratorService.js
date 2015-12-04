angular.module('dummyCollaboratorService', ['Collaborator'])

    .factory('$dummyCollaboratorService', ['Collaborator', function(Collaborator){

        var _dummyCollaboratorData = {
            "is_accepted": false,
            "first_name": "",
            "user_name": "Admin",
            "is_owner": false,
            "is_read_only": false,
            "is_external_user": false,
            "modify_date": "2015-05-08T09:11:52",
            "last_name": "",
            "user_id": 1234,
            "display_name": ''
        };

        var _dummyCollaboratorsData = {
            "shares" : [
                {
                    "is_accepted": false,
                    "first_name": "",
                    "user_name": "test1",
                    "is_owner": false,
                    "is_read_only": false,
                    "is_external_user": false,
                    "modify_date": "2015-06-08T13:21:27",
                    "last_name": "",
                    "user_id": 12111
                },
                {
                    "is_accepted": true,
                    "first_name": "Mike",
                    "user_name": "fehrenbach.mike@test.com",
                    "is_owner": false,
                    "is_read_only": false,
                    "is_external_user": true,
                    "modify_date": "2015-05-08T09:11:52",
                    "last_name": "Fehrenbach",
                    "user_id": 35422
                },
                {
                    "is_accepted": false,
                    "first_name": "",
                    "user_name": "Admin",
                    "is_owner": true,
                    "is_read_only": false,
                    "is_external_user": false,
                    "modify_date": "",
                    "last_name": "",
                    "user_id": 1000
                }
            ]};

        return{

            getDummyCollaborator: function(collaboratorChangeable){
                return new Collaborator(_dummyCollaboratorData, collaboratorChangeable);
            },

            getDummyCollaboratorData: function(){
                return _dummyCollaboratorsData;
            },

            getDummyCollaborators: function(){
                var dummyCollaborators = [];

                _dummyCollaboratorsData.shares.forEach(function(collaboratorData){
                    dummyCollaborators.push(new Collaborator(collaboratorData));
                });

                return dummyCollaborators.sort();
            },

            getDummyCollaboratorWithFirstNameLastNameAndDisplayNameUpdated: function(firstName, lastName, displayName){
                _dummyCollaboratorData.first_name = firstName;
                _dummyCollaboratorData.last_name = lastName;
                _dummyCollaboratorData.display_name = displayName;

                return new Collaborator(_dummyCollaboratorData);
            },

            getDummyCollaboratorWithIsAcceptedAndIsOwnerUpdated: function(isAccepted, isOwner){
                _dummyCollaboratorData.is_accepted = isAccepted;
                _dummyCollaboratorData.is_owner = isOwner;

                return new Collaborator(_dummyCollaboratorData);
            },

            getDummyCollaboratorWithIsExternalUserUpdated: function(isExternalUser){
                _dummyCollaboratorData.is_external_user = isExternalUser;

                return new Collaborator(_dummyCollaboratorData);
            },

            getDummyCollaboratorWithIsOwnerUpdated: function(isOwner, collaboratorChangeable){
                _dummyCollaboratorData.is_owner = isOwner;

                return new Collaborator(_dummyCollaboratorData, collaboratorChangeable);
            },

            getDummyCollaboratorWithIsReadOnlyUpdated: function(isReadOnly){
                _dummyCollaboratorData.is_read_only = isReadOnly;

                return new Collaborator(_dummyCollaboratorData);
            },

            getDummyCollaboratorWithUserIDUpdated: function(userID){
                _dummyCollaboratorData.user_id = userID;

                return new Collaborator(_dummyCollaboratorData);
            },

            getDummyCollaboratorWithIsUserNameUpdated: function(username){
                _dummyCollaboratorData.user_name = username;

                return new Collaborator(_dummyCollaboratorData);
            }
        }
    }]);
