angular.module('AddToFeedProviderStrategy', ['feedService', 'AddToFeedStatusStrategy'])
    .factory('AddToFeedProviderStrategy', ['$q', '$feedService', '$ionicHistory', '$displayMessageService', 'AddToFeedStatusStrategy',
        function($q, $feedService, $ionicHistory, $displayMessageService, AddToFeedStatusStrategy) {

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
                    $feedService.addToFeedProvider(message, self.feedItem.getProviderType(), self.feedItem.getSequenceNumber()).then(function(){
                        if (self.goBack)
                            $ionicHistory.goBack();

                        deferred.resolve();
                    }, function () {
                        $displayMessageService.showToastMessage("NOT ADDED SUCCESSFULLY");
                        deferred.reject();
                    });
                } else {
                    $feedService.addToFeedProviderWithAttachment(file, message, self.feedItem.getProviderType(),
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
