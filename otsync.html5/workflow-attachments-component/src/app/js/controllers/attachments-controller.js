angular
    .module('WorkflowAttachments')
    .controller('AttachmentsController', [
        'AttachmentsProvider',
        '$scope',
        '$ionicModal',
        '$ionicPlatform',
        AttachmentsController
    ]);

function AttachmentsController(attachmentsProvider, $scope, $ionicModal, $ionicPlatform) {
    var self = this;

    // ensure cordova environment is loaded before trying to make cordova requests
    $ionicPlatform.ready(function () {
        attachmentsProvider.getAttachments().then(function (attachments) {
            self.attachments = attachments;
        });
    });

    $ionicModal.fromTemplateUrl('views/add-attachment-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.showAddAttachmentScreen = function showAddAttachmentScreen() {
        $scope.modal.show();
    };

    $scope.addFromCamera = function addFromCamera() {

    };

    $scope.addFromLibrary = function addFromLibrary() {

    };

    $scope.addFromEnterpriseWorkspace = function addFromEnterpriseWorkspace() {

    };

    $scope.addFromPersonalWorkspace = function addFromPersonalWorkspace() {

    };

}
