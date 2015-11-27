angular.module('navigationService', [])

    .factory('$navigationService', ['$state', '$stateParams', function ($state, $stateParams) {
        return {
            reloadPage: function(){
                var current = $state.current;
                var params = angular.copy($stateParams);
                $state.transitionTo(current, params, {reload: true, inherit: true, notify: true});
            },

            openPage: function( pageToLoad, params ){

                $state.go( pageToLoad, params );
            }
        }
    }]);
