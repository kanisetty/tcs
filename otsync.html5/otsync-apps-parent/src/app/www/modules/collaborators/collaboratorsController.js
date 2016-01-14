angular.module('collaboratorsController', ['collaboratorsService', 'collaboratorsResource', 'collaboratorMenuService', 'collaboratorDirectives',
        'headerService', 'Header'])
    .controller('collaboratorsController', ['$scope', '$stateParams', '$headerService', '$displayMessageService','$sessionService', '$collaboratorsResource',
            '$collaboratorsService', '$collaboratorMenuService', '$navigationService', 'Header',
        function ($scope, $stateParams, $headerService, $displayMessageService, $sessionService, $collaboratorsResource, $collaboratorsService,
                  $collaboratorMenuService, $navigationService, Header) {
            var READ_WRITE_IMG_URL = $sessionService.getGatewayURL() + "/content/img/read_write_drop.png";
            var READ_IMG_URL = $sessionService.getGatewayURL() + "/content/img/read_drop.png";
            var READ_PERMS = 1;
            var READ_WRITE_PERMS = 2;

            $scope.isShareable = $stateParams.node.sharing().isShareable();
            $scope.collaboratorQuery = '';

            $scope.initialize = function() {
                $scope.clearSearchBar();
                $scope.collaboratorPermImgURL = READ_WRITE_IMG_URL;
                $scope.collaboratorPerm = READ_WRITE_PERMS;
                $scope.isReadOnlyPerms = false;

                $displayMessageService.showDisplayMessage('LOADING');

                var header = new Header($displayMessageService.translate('COLLABORATORS') + ": " + $stateParams.node.getName(), false);

				$headerService.setHeader(header);

                $collaboratorsResource.getCollaborators($stateParams.node).then(function(collaborators){
                    $displayMessageService.hideMessage();
                    $scope.collaborators = collaborators || [];
                });
            };

            $scope.clearSearchBar = function(){
                $scope.collaboratorQuery = '';
            };

            $scope.collaboratorSearch = function($event){
                if ($scope.menu != null)
                    $scope.menu.remove();

                if ( $scope.collaboratorQuery.length > 0 ) {

                    $collaboratorsResource.collaboratorSearch($scope.collaboratorQuery, $scope.isReadOnlyPerms).then(function (allCollaborators) {
                        var collaboratorsAvailableForSharing = $collaboratorsService.getCollaboratorsAvailableForSharing($scope.collaborators, allCollaborators);

                        if ( collaboratorsAvailableForSharing.length > 0 ) {

                            $collaboratorMenuService.createMenu($scope, $event, collaboratorsAvailableForSharing, $stateParams.node, $scope.collaboratorPerm);
                        }
                    }).finally(function () {
                        $displayMessageService.hideMessage();
                    });
                }
            };

            $scope.menuItemClicked = function(menuItem){
                if ($scope.menu != null)
                    $scope.menu.remove();

                $displayMessageService.showDisplayMessage('LOADING');

                $scope.menu.menuItemClicked(menuItem).then(function() {
                    $scope.clearSearchBar();
                    $displayMessageService.showToastMessage('COLLABORATOR SUCCESSFULLY ADDED');
                }).finally(function(){
                    $displayMessageService.hideMessage();
                });
            };
            $scope.reloadPage = function(){
                $navigationService.reloadPage();
            };

            $scope.removeCollaborator = function(collaborator) {
                var confirmPopup = $displayMessageService.createConfirmationPopup('UNSHARE USER CONFIRMATION', 'CONFIRMATION');

                confirmPopup.then(function(confirmed) {
					if (confirmed) {
						$displayMessageService.showDisplayMessage('LOADING');
						$collaboratorsResource.removeCollaborator($stateParams.node, collaborator).then(function () {
							var index = $scope.collaborators.indexOf(collaborator);
							$scope.collaborators.splice(index, 1);
							$scope.clearSearchBar();
							$displayMessageService.showToastMessage('COLLABORATOR SUCCESSFULLY REMOVED');
							$displayMessageService.hideMessage();
						});
					} else {
						$displayMessageService.hideMessage();
					}
                })
            };

            $scope.toggleCollaboratorPerms = function(){
                if ($scope.collaboratorPerm == READ_PERMS){
                    $scope.collaboratorPermImgURL = READ_WRITE_IMG_URL;
                    $scope.collaboratorPerm = READ_WRITE_PERMS;
                    $scope.isReadOnlyPerms = false;
                }else {
                    $scope.collaboratorPermImgURL = READ_IMG_URL;
                    $scope.collaboratorPerm = READ_PERMS;
                    $scope.isReadOnlyPerms = true;
                }
            };

            $scope.$on('serverError', function handler(event, errorArgs) {
                $displayMessageService.showToastMessage(errorArgs.errMsg);
            });

            $scope.$on('$destroy', function() {
                if ($scope.menu != null)
                    $scope.menu.remove();
            });

            $scope.$watch(
                'collaboratorQuery',
                function( newValue, oldValue ) {

                    // Ignore initial setup.
                    if ( newValue !== oldValue ){
                        if ($scope.menu != null)
                            $scope.menu.remove();

                        $displayMessageService.hideMessage();
                    }
                }
            );
        }]);