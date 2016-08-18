angular.module('Request', ['requestService'])
    .factory('Request', ['$requestService', function ($requestService) {

        var Request = function (requestParams) {
            var _requestParams = requestParams;

            this.doRequest = function () {
                return $requestService.doRequest(_requestParams);
            };
        };

        return Request;
    }]);