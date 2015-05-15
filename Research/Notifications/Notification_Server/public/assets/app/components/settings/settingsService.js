angular.module("app")
.service("SettingsSvc", function($http) {
	this.fetch = function() {
		return $http.get("/api/settings");
	};

	this.update = function(settings) {
		return $http.post("api/settings", settings)
	}
});