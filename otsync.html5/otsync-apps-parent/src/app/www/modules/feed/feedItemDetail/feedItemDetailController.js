angular.module('feedItemDetailController', ['Header', 'headerService', 'nodeOpenService', 'feedResource', 'feedService', 'AddToFeedProviderStrategy'])
    .controller('feedItemDetailController', ['$scope', '$stateParams', '$displayMessageService', 'Header', '$headerService', '$nodeOpenService', '$feedResource',
				'$sessionService', '$navigationService', 'AddToFeedProviderStrategy', '$feedService',
        function ($scope, $stateParams, $displayMessageService, Header, $headerService, $nodeOpenService, $feedResource, $sessionService, $navigationService,
				  AddToFeedProviderStrategy, $feedService) {
			$scope.messagePlaceholder = $displayMessageService.translate("ADD COMMENT");
			$scope.showCancel = false;
			$scope.feedMessage = {message:''};
			$scope.showFollowing = false;

            $scope.initialize = function() {
				var goBack = false;
                var header = new Header($displayMessageService.translate('FEED DETAIL'), false);

                $headerService.setHeader(header);

                $scope.feedItem = $stateParams.feedItem;
				$scope.addToFeedStrategy = new AddToFeedProviderStrategy($scope.feedItem, goBack);
				$scope.viewThreadMessage = _getViewThreadMessage();
				$scope.viewLikesMessage = _getViewLikesMessage();

				if ($sessionService.getUsername() != $scope.feedItem.getUsername())
				{
					$scope.showFollowing = true;
				}
            };

			$scope.clearFeedMessage = function(){
				$scope.feedMessage = {message:''};
			};

			$scope.doOpen = function(){

				$displayMessageService.showDisplayMessage('LOADING');
				var node = $feedService.buildNodeFromFeedItemAttachment($scope.feedItem);
				$nodeOpenService.openNode(node).finally(function(){
					$displayMessageService.hideMessage();
				});
			};

			$scope.doPost = function(){
				$displayMessageService.showDisplayMessage('LOADING');

				$scope.addToFeedStrategy.doPost($scope.file, $scope.feedMessage.message).then(function(){
					$scope.feedMessage = {message:''};
					$scope.file = null;
					$scope.feedItem.incrementCommentCount();
					$scope.viewThreadMessage = _getViewThreadMessage();
					$displayMessageService.showToastMessage("ADDED SUCCESSFULLY");
				});
			};

			$scope.getFile = function(){
				$scope.addToFeedStrategy.getFile($scope);
			};

			$scope.menuItemClicked = function(modalMenuItem){
				$scope.addToFeedStrategy.selectFile($scope, modalMenuItem).then(function(file){
					$scope.file = file;
				});
			};

			$scope.removeFile = function(){
				$scope.file = null;
			};

			$scope.toggleIsFollowing = function(){

				$displayMessageService.showDisplayMessage('LOADING');

				if ($scope.feedItem.isFollowing() == true){
					$feedResource.doUnfollow($scope.feedItem.getUsername()).then(function(){
						$scope.feedItem.setIsFollowing(false);
						$displayMessageService.hideMessage();
					});
				} else {
					$feedResource.doFollow($scope.feedItem.getUsername()).then(function(){
						$scope.feedItem.setIsFollowing(true);
						$displayMessageService.hideMessage();
					});
				}
			};

			$scope.toggleIsLiked = function(){

				$displayMessageService.showDisplayMessage('LOADING');

				if ($scope.feedItem.isLiked() == true){
					$feedResource.doUnlike($scope.feedItem.getProviderType(),$scope.feedItem.getSequenceNumber()).then(function(){
						$scope.feedItem.setIsLiked(false);
						$scope.viewLikesMessage = _getViewLikesMessage();
						$displayMessageService.hideMessage();
					});
				} else {
					$feedResource.doLike($scope.feedItem.getProviderType(),$scope.feedItem.getSequenceNumber()).then(function(){
						$scope.feedItem.setIsLiked(true);
						$scope.viewLikesMessage = _getViewLikesMessage();
						$displayMessageService.hideMessage();
					});
				}
			};

			$scope.viewLikes = function(){

				var additionalParams = {
					name: null,
					showUserFeed: true,
					feedItem: $scope.feedItem
				};

				$navigationService.openPage('app.browse', {id: $scope.feedItem.getProviderType(), additionalParams: additionalParams});
			};

			$scope.viewThread = function(){
				var additionalParams = {
					name: null,
					feedItem: $scope.feedItem
				};

				$navigationService.openPage('app.browse', {id: $scope.feedItem.getProviderType(), additionalParams: additionalParams});
			};

            $scope.$on('serverError', function handler(event, errorArgs) {
                $displayMessageService.showToastMessage(errorArgs.errMsg);
            });

			var _getViewLikesMessage = function(){
				return $displayMessageService.translate("VIEW LIKES") + ' (' + $scope.feedItem.getLikeCount() + ')';
			};

			var _getViewThreadMessage = function(){
				return $displayMessageService.translate("VIEW THREAD") + ' (' + $scope.feedItem.getCommentCount() + ')';
			};
        }]);