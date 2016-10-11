angular
    .module('navigationService', [])
    .factory('$navigationService', [
        '$state',
        '$stateParams',
        '$rootScope',
        function ($state, $stateParams, $rootScope) {
            return {
                reloadPage: function () {
                    var current = $state.current;
                    var params = angular.copy($stateParams);
                    $state.transitionTo(current, params, {reload: true, inherit: true, notify: true});
                    // perform a sync operation on reload
                    $rootScope.$emit('$fileExportSync.sync');
                },
                openPage: function (pageToLoad, params) {
                    $state.go(pageToLoad, params);
                }
            }
        }
    ]);
