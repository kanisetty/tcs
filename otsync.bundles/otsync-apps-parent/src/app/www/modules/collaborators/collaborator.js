angular.module('Collaborator', ['userDisplayService'])

    .factory('Collaborator', ['$sessionService', '$userDisplayService', function ($sessionService, $userDisplayService) {

        var Collaborator = function(collaboratorData, collaboratorChangeable) {
            var _displayName = collaboratorData.display_name;
            var _collaboratorID = collaboratorData.user_id;
            var _hasAcceptedTheShare = collaboratorData.is_accepted;
            var _firstName = collaboratorData.first_name;
            var _lastName = collaboratorData.last_name;
            var _collaboratorName = collaboratorData.user_name;
            var _isOwnerOfShare = collaboratorData.is_owner;
            var _isReadOnlyCollaborator = collaboratorData.is_read_only;
            var _isExternalCollaborator = collaboratorData.is_external_user;
            var _photoURL = $sessionService.getGatewayURL() + '/content/v5/users/' + _collaboratorID + '/photo';
            var _collaboratorChangeable = collaboratorChangeable;

            this.getDisplayName = function() {

                if ( _displayName === "" || _displayName == null ) {

					_displayName = $userDisplayService.getDisplayName(_collaboratorName, _firstName, _lastName);
                }

                return _displayName;
            };

            this.setDisplayName = function(displayName){
                _displayName = displayName;
            };

            this.getPhotoURL = function() {
                return _photoURL;
            };

            this.isReadOnlyCollaborator = function(){
                return _isReadOnlyCollaborator;
            };

            this.isOwnerOfShare = function(){
                return _isOwnerOfShare;
            };

            this.isPendingCollaborator = function(){
                return !_hasAcceptedTheShare && !_isOwnerOfShare;
            };

            this.isExternalCollaborator = function(){
                return _isExternalCollaborator;
            };

            this.isRemovable = function(){

                return !_isOwnerOfShare && _collaboratorChangeable;
            };

            this.getCollaboratorName = function(){

                return _collaboratorName;
            };

            this.toString = function(){
                return _collaboratorName.toLowerCase();
            };
        };

        return Collaborator;
    }]);
