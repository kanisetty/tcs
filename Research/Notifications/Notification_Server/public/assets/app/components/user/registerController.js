angular.module("app")
.controller("RegisterCtrl", function($scope, UserSvc){
	$scope.register = function(username, password) {
		UserSvc.login(username, password)
		.then(function(response) {
			$scope.$emit("login", response.data);
		});
	};
});