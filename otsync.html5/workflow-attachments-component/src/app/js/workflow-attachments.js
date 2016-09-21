angular.module('WorkflowAttachments', ['ionic', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('attachments', {
                url: '/attachments',
                controller: 'AttachmentsController',
                templateUrl: 'views/attachments-list.html'
            })
            .state('addAttachment', {
                url: '/attachments/add',
                params: {source: null},
                controller: 'AttachmentsAdditionController',
                templateUrl: 'views/attachments-add.html'
            });

        $urlRouterProvider.otherwise('/attachments');
    })
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // add back button to close component
            new Appworks.AWHeaderBar().setHeader({
                backButtonVisible: true,
                callback: function () {
                    cordova.exec(function () {}, function () {}, 'AWComponent', 'close', []);
                }
            });
        });
    })
    .run(function ($rootScope) {
        var query = window.location.search.toString().substring(1).split('data=').pop();
        $rootScope._appData = processQueryParameters(query);

        function processQueryParameters(query) {
            var params = {};
            var idx, pairs, pair, key, len;

            if (typeof(query) === 'string') {
                pairs = query.split("&");
                len = pairs.length;

                // Iterate through each pair and build the array
                for (idx = 0; idx < len; idx += 1) {
                    pair = pairs[idx].split("=");
                    key = pair[0];

                    switch (typeof params[key]) {
                        // Key has not been found, create entry
                        case "undefined":
                            params[key] = pair[1];
                            break;
                        // Key exists, create an array
                        case "string":
                            params[key] = [params[key], pair[1]];
                            break;
                        // Add to the array
                        default:
                            params[key].push(pair[1]);
                    }
                }
            }

            return params;
        }
    });

