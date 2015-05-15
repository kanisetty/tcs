angular.module("app")
.service("DeviceSvc", function($http) {
	this.fetch = function() {
		return $http.get("/api/devices");
	};

	this.create = function(device) {
		return $http.post("api/devices", device)
	}
});