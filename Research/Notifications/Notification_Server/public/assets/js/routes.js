var compPath = "assets/app/components/";

angular.module("app")
.config(function($routeProvider, $locationProvider){

  	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

	$routeProvider
		.when("/", {controller : "HomeCtrl", templateUrl: compPath+"home/homeView.html"})
		.when("/devices", {controller : "DeviceCtrl", templateUrl: compPath+"device/deviceView.html"})
		.when("/notifications", {controller : "NotificationCtrl", templateUrl: compPath+"notification/notificationView.html"})
		.when("/settings", {controller : "SettingsCtrl", templateUrl: compPath+"settings/settingsView.html"})
	/*
	.when("/register", {controller : "RegisterCtrl", templateUrl: compPath+"user/registerView.html"})
	.when("/login", {controller : "LoginCtrl", templateUrl: compPath+"user/loginView.html"})
	*/
    .otherwise({ redirectTo: "/" });
});
