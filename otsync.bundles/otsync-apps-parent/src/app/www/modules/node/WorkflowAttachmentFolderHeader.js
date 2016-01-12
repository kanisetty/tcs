angular.module('WorkflowAttachmentFolderHeader', ['NodeHeader', 'menuItemFactory', 'fileMenuService', 'nodeResource'])

    .factory('WorkflowAttachmentFolderHeader', ['NodeHeader', '$displayMessageService', 'menuItemFactory', '$fileMenuService', '$nodeResource',
        function (NodeHeader, $displayMessageService, menuItemFactory, $fileMenuService, $nodeResource) {
            var _addPerms = 0x00004;
            var _disablePromptLoading = true;
            var _hasModal = true;
            var _refresh = true;

            var WorkflowAttachmentFolderHeader = function(root) {
                this.title = root.getName();
                this.showButton = (root.getPermissions() & _addPerms) == _addPerms;
                this.root = root;
                this.showButtonCSS  = 'ion-plus-round';
            };

            WorkflowAttachmentFolderHeader.prototype = new NodeHeader(this.title, this.showButton);

            WorkflowAttachmentFolderHeader.prototype.getHeaderMenuItems = function() {
                var addMenuItems = [];
                var shouldRefresh = true;
                var root = this.root;

                addMenuItems.push(menuItemFactory.createMenuItemWithPrompt($displayMessageService.translate('FOLDER'), _refresh, !_hasModal,
                    function () {
                        return $nodeResource.addFolder(root, this.data);
                    },
                    function () {
                        return $displayMessageService.createPrompt( 'ADD FOLDER', 'FOLDER NAME' );
                    },
                    _disablePromptLoading));

                addMenuItems = addMenuItems.concat($fileMenuService.getFileMenuItemsWithUpload(root, shouldRefresh));

                return addMenuItems;
            };

            return WorkflowAttachmentFolderHeader;
        }]);