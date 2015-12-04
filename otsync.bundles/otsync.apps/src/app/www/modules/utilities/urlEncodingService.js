angular.module('urlEncodingService', [])

.factory('$urlEncode', function () {
    return function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? encodeObject(data) : data;
    };

    function encodeObject(obj) {
        var query = '', innerObj;
        for (var name in obj) {
            var value = obj[name];

            if (value instanceof Array) {
                for (var i = 0; i < value.length; ++i) {
                    var keyName = (name + '[' + i + ']');
                    innerObj = {};
                    innerObj[keyName] = value[i];
                    query += encodeObject(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (var subName in value) {
                    innerObj = {};
                    innerObj[(name + '[' + subName + ']')] = value[subName];
                    query += encodeObject(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    }
});
