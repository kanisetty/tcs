angular.module('collaboratorFactory', ['Collaborator'])

    .factory('collaboratorFactory', ['Collaborator','$stateParams', function (Collaborator, $stateParams) {
        return {
            createCollaborator: function(collaboratorData){
                var collaboratorChangeable = $stateParams.node.sharing().isShareable();
                return new Collaborator(collaboratorData, collaboratorChangeable);
            }
        }
    }]);
