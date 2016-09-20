angular
    .module('WorkflowAttachments')
    .controller('AttachmentsAdditionController', [
        '$scope',
        '$state',
        '$stateParams',
        '$ionicModal',
        'AttachmentsProvider',
        '$q',
        AttachmentsAdditionController
    ]);

function AttachmentsAdditionController($scope, $state, $stateParams, $ionicModal, attachmentsProvider, $q) {

    $scope.newAttachment = {};

    showSelectionScreen($stateParams.source);

    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    $scope.saveAttachment = function () {
        var attachment = angular.copy($scope.newAttachment);
        attachment = checkFile(attachment);
        attachment = checkName(attachment);
        $scope.loading = true;
        attachmentsProvider.addAttachment(attachment).then(function () {
            $state.go('attachments');
        }, function (err) {
            console.log(err);
            $scope.loading = false;
        });
    };

    function checkName(attachment) {
        if (sourceIsUserGenerated() && attachment.name.indexOf('.jpg') === -1) {
            attachment.name += '.jpg';
        }
        return attachment;
    }

    function checkFile(attachment) {
        if (attachment.file) {
            attachment.file = b64toBlob(attachment.file, 'image/jpeg');
        }
        return attachment;
    }

    function sourceIsUserGenerated() {
        return $stateParams.source === 'camera' || $stateParams.source === 'gallery';
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
                });
                break;
            default:
                break;
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

}
