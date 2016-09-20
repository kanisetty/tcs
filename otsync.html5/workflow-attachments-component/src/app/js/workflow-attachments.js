alert('will init');
angular.module('WorkflowAttachments', ['ionic', 'ui.router'])

    .run(function ($ionicPlatform, AuthService) {
        $ionicPlatform.ready(function () {
            AuthService.initialize();
        });
    })

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
    });

