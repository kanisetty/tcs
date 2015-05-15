angular.module("app")
.controller("NotificationCtrl", function($scope, NotificationSvc, DeviceSvc, toaster){
	$scope.notifications = [];

	NotificationSvc.fetch()
	.success(function(notifications){
		$scope.notifications = notifications;
	});

	$scope.devices = [];

	DeviceSvc.fetch()
		.success(function(devices){
			$scope.devices = devices;
		});

	$scope.sendNotification = function() {

		if($scope.notificationData && $scope.notificationUsername) {

			NotificationSvc.create({
				username : $scope.notificationUsername.username,
				notificationData : $scope.notificationData
			})
			.success(function(notification){
				$scope.notifications.unshift(notification);
				$scope.notificationUsername = null;

				$scope.notificationData = null;
					/*
					toaster.pop({
						type : 'success'
						, title : $filter("translate")("success")
						, body : $filter("translate")("notification_success")
					});
					*/
			});
		}
	};
});