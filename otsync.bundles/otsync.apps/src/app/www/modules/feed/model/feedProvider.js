angular.module('FeedProvider', [])
    .factory('FeedProvider', function () {

        var FeedProvider = function(feedProviderData) {
            var _name = feedProviderData.localizedName;
            var _type = feedProviderData.name;

            this.getName = function(){
                return _name;
            };

            this.getType = function(){
                return _type;
            };
        };

        return FeedProvider;
    });
