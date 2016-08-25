angular
    .module('AddToFeedStatusStrategy', ['feedResource', 'ModalMenu', 'fileMenuService'])
    .factory('AddToFeedStatusStrategy', [
        '$q',
        '$feedResource',
        '$ionicHistory',
        '$displayMessageService',
        'ModalMenu',
        '$fileMenuService',
        AddToFeedStatusStrategy
    ]);

function AddToFeedStatusStrategy($q, $feedResource, $ionicHistory, $displayMessageService, ModalMenu, $fileMenuService) {

    var AddToFeedStatusStrategy = function () {
        this.type = 'status';
    };

    AddToFeedStatusStrategy.prototype.doPost = function (file, message) {
        var deferred = $q.defer();

        if (file == null) {
            $feedResource.addFeedStatus(message).then(function (res) {
                $ionicHistory.goBack();
                deferred.resolve(res);
            }, function (res) {
                var errorMsg = (res && res.hash && res.hash.error) || 'STATUS WAS NOT ADDED SUCCESSFULLY';
                $displayMessageService.showToastMessage(errorMsg);
                deferred.reject(res);
            });
        } else {
            $feedResource.addFeedStatusWithAttachment(file, message).then(function (res) {
                $ionicHistory.goBack();
                deferred.resolve(res);
            }, function (res) {
                var errorMsg = (res && res.hash && res.hash.error) || 'STATUS WAS NOT ADDED SUCCESSFULLY';
                $displayMessageService.showToastMessage(errorMsg);
                deferred.reject(res);
            });
        }

        return deferred.promise;
    };

    AddToFeedStatusStrategy.prototype.getFile = function (scope) {
        var shouldRefresh = false;

        var menu = new ModalMenu(
            $fileMenuService.getFileMenuItemsReturnsFile(shouldRefresh),
            $displayMessageService.translate('OPTIONS'),
            $displayMessageService.translate('CANCEL')
        );
        menu.showModalMenu(scope);

        scope.menu = menu;
    };

    AddToFeedStatusStrategy.prototype.getType = function () {
        return type;
    };

    AddToFeedStatusStrategy.prototype.selectFile = function (scope, modalMenuItem) {
        var deferred = $q.defer();

        scope.menu.menuItemClicked(modalMenuItem).then(function (file) {
            if (scope.menu != null)
                scope.menu.hide();

            deferred.resolve(file);
        });

        return deferred.promise
    };

    return AddToFeedStatusStrategy;
}
