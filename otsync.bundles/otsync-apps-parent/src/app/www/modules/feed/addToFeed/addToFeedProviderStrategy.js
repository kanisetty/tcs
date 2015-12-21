angular.module('AddToFeedProviderStrategy', ['feedResource', 'AddToFeedStatusStrategy'])
    .factory('AddToFeedProviderStrategy', ['$q', '$feedResource', '$ionicHistory', '$displayMessageService', 'AddToFeedStatusStrategy',
        function($q, $feedResource, $ionicHistory, $displayMessageService, AddToFeedStatusStrategy) {

            var AddToFeedProviderStrategy = function(feedItem, goBack){
                this.feedItem = feedItem;
                this.goBack = goBack;
                this.type = 'provider';
            };

            AddToFeedProviderStrategy.prototype = new AddToFeedStatusStrategy();

            AddToFeedProviderStrategy.prototype.doPost = function(file, message){
                var deferred = $q.defer();
                var self = this;

                if (file == null){
                    $feedResource.addToFeedProvider(message, self.feedItem.getProviderType(), self.feedItem.getSequenceNumber()).then(function(){
                        if (self.goBack)
                            $ionicHistory.goBack();

                        deferred.resolve();
                    }, function () {
                        $displayMessageService.showToastMessage("NOT ADDED SUCCESSFULLY");
                        deferred.reject();
                    });
                } else {
                    $feedResource.addToFeedProviderWithAttachment(file, message, self.feedItem.getProviderType(),
                        self.feedItem.getSequenceNumber()).then(function(){
                            if (self.goBack)
                                $ionicHistory.goBack();

                            deferred.resolve();
                        }, function () {
                            $displayMessageService.showToastMessage("NOT ADDED SUCCESSFULLY");
                            deferred.reject();
                        });
                }

                return deferred.promise;
            };

            return AddToFeedProviderStrategy;
        }]);
