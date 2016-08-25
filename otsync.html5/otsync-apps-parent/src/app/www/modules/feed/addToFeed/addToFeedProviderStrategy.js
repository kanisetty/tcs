angular
    .module('AddToFeedProviderStrategy', ['feedResource', 'AddToFeedStatusStrategy'])
    .factory('AddToFeedProviderStrategy', [
        '$q',
        '$feedResource',
        '$ionicHistory',
        '$displayMessageService',
        'AddToFeedStatusStrategy',
        AddToFeedProviderStrategy
    ]);

function AddToFeedProviderStrategy($q, $feedResource, $ionicHistory, $displayMessageService, AddToFeedStatusStrategy) {

    var AddToFeedProviderStrategy = function (feedItem, goBack) {
        this.feedItem = feedItem;
        this.goBack = goBack;
        this.type = 'provider';
    };

    AddToFeedProviderStrategy.prototype = new AddToFeedStatusStrategy();

    AddToFeedProviderStrategy.prototype.doPost = function (file, message) {
        var deferred = $q.defer();
        var self = this;

        if (file == null) {
            $feedResource.addToFeedProvider(
                message,
                self.feedItem.getProviderType(),
                self.feedItem.getSequenceNumber()
            ).then(function (res) {
                if (self.goBack)
                    $ionicHistory.goBack();

                deferred.resolve(res);
            }, function (res) {
                var errorMsg = (res && res.hash && res.hash.error) || 'NOT ADDED SUCCESSFULLY';
                $displayMessageService.showToastMessage(errorMsg);
                deferred.reject(res);
            });
        } else {
            $feedResource.addToFeedProviderWithAttachment(
                file,
                message,
                self.feedItem.getProviderType(),
                self.feedItem.getSequenceNumber()
            ).then(function (res) {
                if (self.goBack)
                    $ionicHistory.goBack();

                deferred.resolve(res);
            }, function (res) {
                var errorMsg = (res && res.hash && res.hash.error) || 'NOT ADDED SUCCESSFULLY';
                $displayMessageService.showToastMessage(errorMsg);
                deferred.reject(res);
            });
        }

        return deferred.promise;
    };

    return AddToFeedProviderStrategy;
}
