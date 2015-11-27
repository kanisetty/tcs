angular.module('collaboratorDirectives', [])
    .directive('searchChange', ['$timeout', function ($timeout) {
        var TYPING_DELAY = 500;

        return {
            restrict: 'A',
            scope: {
              searchChange:'='
            },
            link: function (scope, element) {
                var currentTimeout = null;

                element.on('keyup', function(event){

                    if(currentTimeout) {
                        $timeout.cancel(currentTimeout)
                    }
                    currentTimeout = $timeout(function(){
                        scope.searchChange(event);
                    }, TYPING_DELAY)
                });
            }
        }
    }]);
