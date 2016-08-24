angular
    .module('collaboratorsService', [])
    .factory('$collaboratorsService', [
        $collaboratorsService
    ]);

function $collaboratorsService() {

    return {
        getCollaboratorsAvailableForSharing: getCollaboratorsAvailableForSharing
    };

    function getCollaboratorsAvailableForSharing(sharedCollaborators, allCollaborators) {
        var sharedCollaboratorNames = [];

        if (allCollaborators.length > 0 && sharedCollaborators.length > 0) {

            sharedCollaborators.forEach(function (collaborator) {
                sharedCollaboratorNames.push(collaborator.getCollaboratorName());
            });

            for (var i = allCollaborators.length - 1; i >= 0; i--) {
                if (sharedCollaboratorNames.indexOf(allCollaborators[i].getCollaboratorName()) > -1) {
                    allCollaborators.splice(i, 1);
                }
            }
        }

        return allCollaborators;
    }
}