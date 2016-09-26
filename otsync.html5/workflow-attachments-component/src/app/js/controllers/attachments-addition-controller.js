angular
    .module('WorkflowAttachments')
    .controller('AttachmentsAdditionController', [
        '$scope',
        '$state',
        '$stateParams',
        '$ionicModal',
        'AttachmentsProvider',
        'ContentProvider',
        '$q',
        AttachmentsAdditionController
    ]);

function AttachmentsAdditionController($scope, $state, $stateParams, $ionicModal, attachmentsProvider, csProvider, $q) {

    $scope.newAttachment = {};
    $scope.nodes = [];
    $scope.nodesVisited = [];
    $scope.attachments = [];

    showSelectionScreen($stateParams.source);
    loadAttachments();

    $scope.closeModal = closeModal;
    $scope.goToRoot = goToRoot;
    $scope.loadNodesFromParent = loadNodesFromParent;
    $scope.saveAttachment = saveAttachment;
    $scope.hideModal = hideModal;
    // cleanup the modal when we're done with it
    $scope.$on('$destroy', function () {
        if ($scope.modal) {
            $scope.modal.remove();
        }
    });

    function checkFile(attachment) {
        if (attachment.file) {
            attachment.file = b64toBlob(attachment.file, 'image/jpeg');
        }
        return attachment;
    }

    function checkName(attachment) {
        if (sourceIsUserGenerated() && attachment.name.indexOf('.jpg') === -1) {
            attachment.name += '.jpg';
        }
        if (fileNameIsTaken(attachment.name)) {
            // create a unique identifier if the filename is already taken
            attachment.name = new Date().getTime().toString() + '-' + attachment.name;
        }
        return attachment;
    }

    function closeModal() {
        $scope.modal.hide();
        $state.go('attachments');
    }

    function fileNameIsTaken(name) {
        var isTaken = false;
        $scope.attachments.forEach(function (node) {
            if (node.NAME === name) {
                isTaken = true;
            }
        });
        return isTaken;
    }

    function getAttachmentFromCamera() {
        var deferred = $q.defer();
        var camera = new Appworks.AWCamera(onFileLoad, deferred.reject);
        var cameraOptions = {destinationType: Camera.DestinationType.DATA_URL};

        camera.takePicture(cameraOptions);

        return deferred.promise;

        function onFileLoad(dataUrl) {
            deferred.resolve(dataUrl);
        }
    }

    function getAttachmentFromGallery() {
        var deferred = $q.defer();
        var camera = new Appworks.AWCamera(onFileLoad, deferred.reject);
        var cameraOptions = {destinationType: Camera.DestinationType.DATA_URL};

        camera.openGallery(cameraOptions);

        return deferred.promise;

        function onFileLoad(dataUrl) {
            deferred.resolve(dataUrl);
        }
    }

    function goToRoot() {
        loadNodesFromParent($scope.rootNode);
        $scope.visited = [];
    }

    function hideModal() {
        $scope.modal.hide();
    }

    function initializeWorkspaceBrowse() {
        var rootFetchFn;
        $scope.loading = true;
        if ($stateParams.source === 'ews') {
            rootFetchFn = csProvider.getEWSRoot;
        } else if ($stateParams.source === 'pws') {
            rootFetchFn = csProvider.getPWSRoot;
        }

        if (rootFetchFn) {
            rootFetchFn().then(function (rootId) {
                $scope.rootNode = rootId;
                $scope.currentRootNode = rootId;
                loadNodesFromParent(rootId, false);
            });
        }
    }

    function loadNodesFromParent(rootId, addToVisited) {
        $scope.loading = true;
        // add current root node to visited array
        if (addToVisited) {
            $scope.nodesVisited.push($scope.currentRootNode);
        }
        // set new current root node to rootId passed in
        $scope.currentRootNode = rootId;
        // clear the list in the view
        $scope.nodes = [];
        // get the children for the given parent (root) id
        csProvider.getChildren(rootId).then(function (children) {
            $scope.nodes = children;
            $scope.loading = false;
        }, function (err) {
            console.log(err);
            $scope.loading = false;
        });
    }

    function saveAttachment() {
        var attachment = angular.copy($scope.newAttachment);
        $scope.loading = true;
        if (attachment.selectedAttachment) {
            attachmentsProvider.copyNodeAsAttachment(attachment.selectedAttachment).then(function () {
                $state.go('attachments');
            }, function (err) {
                console.log(err);
                $scope.loading = false;
            });
        } else {
            attachment = checkFile(attachment);
            attachment = checkName(attachment);
            attachmentsProvider.addAttachment(attachment).then(function () {
                $state.go('attachments');
            }, function (err) {
                console.log(err);
                $scope.loading = false;
            });
        }

    }

    function showSelectionScreen(source) {
        var defaultName = 'Attachment-' + new Date().getTime().toString() + '.jpg';
        switch (source) {
            case 'camera':
                getAttachmentFromCamera().then(function (dataUrl) {
                    $scope.newAttachment.name = defaultName;
                    $scope.newAttachment.file = dataUrl;
                }, function () {
                    $state.go('attachments');
                });
                break;
            case 'gallery':
                getAttachmentFromGallery().then(function (dataUrl) {
                    $scope.newAttachment.name = defaultName;
                    $scope.newAttachment.file = dataUrl;
                }, function () {
                    $state.go('attachments');
                });
                break;
            case 'ews':
            case 'pws':
                $ionicModal.fromTemplateUrl('views/attachment-picker-modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                    initializeWorkspaceBrowse();
                });
                break;
            default:
                break;
        }
    }

    function sourceIsUserGenerated() {
        return $stateParams.source === 'camera' || $stateParams.source === 'gallery';
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    function loadAttachments() {
        attachmentsProvider.getCachedAttachments().then(function (res) {
            $scope.attachments = res.info.results.contents || [];
        });
    }

}
