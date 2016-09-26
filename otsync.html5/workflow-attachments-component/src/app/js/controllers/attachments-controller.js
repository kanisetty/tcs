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
        attachmentsProvider.getAttachments().then(function (res) {
            $scope.attachments = res.info.results.contents || [];
            $scope.loading = false;
        });
    });

    $ionicModal.fromTemplateUrl('views/add-attachment-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.loading = true;

    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it
    $scope.$on('$destroy', function () {
        if ($scope.modal) {
            $scope.modal.remove();
        }
    });

    $scope.showAddAttachmentScreen = function showAddAttachmentScreen() {
        $scope.modal.show();
    };

    $scope.viewAttachment = function viewAttachment(attachmentId) {
        var component = new Appworks.AWComponent();
        var data = {id: attachmentId};
        var success = function () {
        };
        var err = function (err) {
            console.log(err);
        };

        component.open(success, err, ['dcs-component', $.param(data), 'component']);
    };

}
