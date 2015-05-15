angular.module("app")
.service("NotificationSvc", function($http) {
	this.fetch = function() {
		return $http.get("/api/notifications");
	};

	this.create = function(notification) {
		return $http.post("api/notifications", notification)
	}
});