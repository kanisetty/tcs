angular.module('collaboratorMenuService', ['menuItemFactory', 'collaboratorsResource', 'PopoverMenu'])
    .factory('$collaboratorMenuService', ['menuItemFactory', '$collaboratorsResource', 'PopoverMenu', function (menuItemFactory, $collaboratorsResource, PopoverMenu){

        return {

            getCollaboratorMenuItems: function (collaborators, node, shareType) {
                var displayMenuItems = [];

                collaborators.forEach(function (collaborator) {
                    displayMenuItems.push(
                        menuItemFactory.createMenuItem(collaborator.getDisplayName(), true, false,
                            function () {
                                return $collaboratorsResource.addCollaborator(collaborator, node, shareType);
                            })
                    );
                });
                return displayMenuItems;
            },

            createMenu: function (scope, $event, collaborators, node, shareType) {

                var menu = new PopoverMenu(this.getCollaboratorMenuItems(collaborators, node, shareType));
                menu.showPopoverMenu(scope, $event);

                scope.menu = menu;
            }
        }
    }]);
