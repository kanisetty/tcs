angular
    .module('collaboratorsResource', ['collaboratorFactory', 'urlEncodingService', 'emailService', 'Request'])
    .factory('$collaboratorsResource', [
        '$q',
        '$sessionService',
        'collaboratorFactory',
        '$urlEncode',
        '$displayMessageService',
        '$emailService',
        'Request',
        $collaboratorsResource
    ]);

function $collaboratorsResource($q, $sessionService, collaboratorFactory, $urlEncode, $displayMessageService, $emailService, Request) {

    var _processSharesForCollaborators = function (response) {
        var collaborators = [];

        response.shares.forEach(function (collaboratorData) {
            var collaborator = collaboratorFactory.createCollaborator(collaboratorData);
            collaborators.push(collaborator);
        });

        return collaborators.sort();
    };

    var _processUsersForCollaborators = function (response, isReadOnlyPerms) {
        var collaborators = [];

        response.users.forEach(function (userData) {
            var collaboratorData = {};
            collaboratorData.first_name = userData.firstName;
            collaboratorData.last_name = userData.lastName;
            collaboratorData.user_name = userData.userName;
            collaboratorData.user_id = userData.userID;
            collaboratorData.is_external_user = userData.isExternal;
            collaboratorData.is_read_only = isReadOnlyPerms;

            var collaborator = collaboratorFactory.createCollaborator(collaboratorData);
            collaborators.push(collaborator);
        });

        return collaborators.sort();
    };

    return {

        addCollaborator: function (collaborator, node, shareType) {

            var requestParams = {
                method: 'POST',
                url: $sessionService.getGatewayURL() + '/shares/v5/outgoing/' + node.getID() + '/users/' + collaborator.getCollaboratorName(),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $urlEncode({share_type: shareType})
            };

            var request = new Request(requestParams);

            return $sessionService.runRequest(request);
        },

        collaboratorSearch: function (queryFilter, isReadOnlyPerms) {
            var deferred = $q.defer();
            var _isReadOnlyPerms = isReadOnlyPerms;

            var requestParams = {
                method: 'GET',
                url: $sessionService.getGatewayURL() + '/content/v5/users',
                headers: {'Content-Type': 'application/json; charset=utf-8'},
                params: {filter: encodeURIComponent(queryFilter)}
            };

            var request = new Request(requestParams);

            $sessionService.runRequest(request).then(function (response) {
                var collaborators = _processUsersForCollaborators(response, _isReadOnlyPerms);

                if (collaborators.length == 0 && $sessionService.canInviteExternalUsers() && $emailService.IsValidEmail(queryFilter)) {
                    var collaboratorData = {
                        "display_name": $displayMessageService.translate("INVITE EXTERNAL USER"),
                        "is_accepted": false,
                        "first_name": "",
                        "user_name": queryFilter,
                        "is_owner": false,
                        "is_read_only": isReadOnlyPerms,
                        "is_external_user": true,
                        "modify_date": "",
                        "last_name": "",
                        "user_id": null
                    };

                    collaborators.push(collaboratorFactory.createCollaborator(collaboratorData));
                }

                deferred.resolve(collaborators);
            });

            return deferred.promise
        },

        getCollaborators: function (node) {
            var requestParams = {
                method: 'GET',
                url: $sessionService.getGatewayURL() + '/shares/v5/outgoing/' + node.getID(),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            };

            var request = new Request(requestParams);

            return $sessionService.runRequest(request).then(_processSharesForCollaborators);
        },

        removeCollaborator: function (node, collaborator) {
            var requestParams = {
                method: 'DELETE',
                url: $sessionService.getGatewayURL() + '/shares/v5/outgoing/' + node.getID() + '/users/' + collaborator.getCollaboratorName(),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            };

            var request = new Request(requestParams);

            return $sessionService.runRequest(request);
        },

        getPendingShareRequest: getPendingShareRequests,
        acceptShareRequest: acceptShareRequest
    };

    function acceptShareRequest(node, collaboratorId) {
        var requestParams = {
            method: 'PUT',
            url: $sessionService.getGatewayURL() + '/shares/v5/incoming/' + node.getID() + '/users/' + collaboratorId,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        };

        var request = new Request(requestParams);

        return $sessionService.runRequest(request);
    }

    function getPendingShareRequests() {
        var deferred = $q.defer();
        deferred.resolve([]);
        return deferred.promise;
    }
}