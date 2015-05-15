angular.module("app")
.factory('NotificationFactory', function () {
    return {
        success: function (text) {
            toastr.success(text,"Success");
        },
        error: function (text) {
            toastr.error(text, "Error");
        }
    };
});