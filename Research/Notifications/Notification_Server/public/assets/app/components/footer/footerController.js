angular.module("app")
.controller("FooterController", function($scope){

});

app.directive("footerContent", function() {
	return {
		templateUrl: "assets/app/components/footer/footerView.html"
	}
});