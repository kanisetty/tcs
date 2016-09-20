alert('will init');
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
    });

