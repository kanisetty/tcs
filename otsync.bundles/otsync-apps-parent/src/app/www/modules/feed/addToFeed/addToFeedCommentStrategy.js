angular.module('AddToFeedCommentStrategy', ['feedResource', 'AddToFeedStatusStrategy'])
    .factory('AddToFeedCommentStrategy', ['$q', '$feedResource', '$ionicHistory', '$displayMessageService', 'AddToFeedStatusStrategy',
        function($q, $feedResource, $ionicHistory, $displayMessageService, AddToFeedStatusStrategy) {

            var AddToFeedCommentStrategy = function(node){
                this.node = node;
                this.type = 'comment';
            };

            AddToFeedCommentStrategy.prototype = new AddToFeedStatusStrategy();

            AddToFeedCommentStrategy.prototype.doPost = function(file, message){
                var deferred = $q.defer();
                var feedProviderType = "PulseContent";

                if (file == null){
                    $feedResource.addToFeedForNode(message, feedProviderType, this.node.getID()).then(function(){
                        $ionicHistory.goBack();
                        deferred.resolve();
                    }, function () {
                        $displayMessageService.showToastMessage("NOT ADDED SUCCESSFULLY");
                        deferred.reject();
                    });
                } else {
                    $feedResource.addToFeedForNodeWithAttachment(file, message, feedProviderType, this.node.getID()).then(function(){
                            $ionicHistory.goBack();
                            deferred.resolve();
                        }, function () {
                            $displayMessageService.showToastMessage("NOT ADDED SUCCESSFULLY");
                            deferred.reject();
                        });
                }

                return deferred.promise;
            };

            return AddToFeedCommentStrategy;
        }]);
