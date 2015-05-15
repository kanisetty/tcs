angular.module("app")
	.controller("DeviceCtrl", function($scope, DeviceSvc){
		$scope.devices = [];

		DeviceSvc.fetch()
			.success(function(devices){
				$scope.devices = devices;
			});

		$scope.addDevice = function() {
			if($scope.deviceUsername && $scope.deviceRegid) {

				DeviceSvc.create({
					username : $scope.deviceUsername,
					regid : $scope.deviceRegid
				})
					.success(function(device){
						$scope.devices.unshift(device);
						$scope.deviceUsername = null;
						$scope.deviceRegid = null;
					});
			}
		};
	});