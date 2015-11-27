angular.module('addToFeedController', ['feedService'])
    .controller('addToFeedController', ['$scope', '$stateParams', '$ionicHistory', '$displayMessageService',
        function ($scope, $stateParams, $ionicHistory, $displayMessageService) {
			$scope.messagePlaceholder = $displayMessageService.translate("ADD FEED STATUS");
            $scope.showCancel = true;
			$scope.feedMessage = {message:''};
			$scope.file = null;
			$scope.addToFeedStrategy = $stateParams.addToFeedStrategy;

            $scope.clearFeedMessage = function(){
                $scope.feedMessage = {message:''};
            };

            $scope.doPost = function(){
				$displayMessageService.showDisplayMessage('LOADING');
				$scope.addToFeedStrategy.doPost($scope.file, $scope.feedMessage.message, $stateParams.additionalParams);
            };

			$scope.getFile = function(){
				$scope.addToFeedStrategy.getFile($scope);
			};

            $scope.goBack = function(){
                $ionicHistory.goBack();
            };

			$scope.menuItemClicked = function(modalMenuItem){
				$scope.addToFeedStrategy.selectFile($scope, modalMenuItem).then(function(file){
					$scope.file = file;
				});
			};

			$scope.removeFile = function(){
				$scope.file = null;
			};

			$scope.$on('serverError', function handler(event, errorArgs) {
                $displayMessageService.showToastMessage(errorArgs.errMsg);
            });
        }]);