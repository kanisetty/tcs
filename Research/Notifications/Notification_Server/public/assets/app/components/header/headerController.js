angular.module("app")
.controller("HeaderController", function($scope, $translate){

})

.directive("headerContent", function() {
	return {
		templateUrl: "assets/app/components/header/headerView.html"
	}
});