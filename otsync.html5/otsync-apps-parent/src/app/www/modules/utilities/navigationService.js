angular
    .module('navigationService', [])
    .factory('$navigationService', [
        '$state',
        '$stateParams',
        '$fileExportSync',
        function ($state, $stateParams, $fileExportSync) {
            return {
                reloadPage: function () {
                    var current = $state.current;
                    var params = angular.copy($stateParams);
                    $state.transitionTo(current, params, {reload: true, inherit: true, notify: true});
                    // perform a sync operation on reload
                    $fileExportSync.sync();
                },
                openPage: function (pageToLoad, params) {
                    $state.go(pageToLoad, params);
                }
            }
        }
    ]);
