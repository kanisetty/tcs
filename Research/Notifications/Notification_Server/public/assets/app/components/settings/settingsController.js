angular.module("app")
.controller("SettingsCtrl", function($scope, $filter, SettingsSvc, toaster){
	$scope.android_apikey = null;

	SettingsSvc.fetch()
	.success(function(settings){
		$scope.android_apikey = settings[0].android_apikey;
	});

	$scope.update = function() {

		SettingsSvc.update({
			android_apikey : $scope.android_apikey
		})
		.success(function(settings){
				$scope.android_apikey = settings.android_apikey;
				toaster.pop({
					type : 'success'
					, title : $filter("translate")("success")
					, body : $filter("translate")("settings_updated")
				});
		})
			.error(function(err, status){
				toaster.pop({
					type : 'error'
					, title : $filter("translate")("error")
					, body : $filter("translate")("settings_error") + " " +status
					, showCloseButton : true
				});
			});

	};
});