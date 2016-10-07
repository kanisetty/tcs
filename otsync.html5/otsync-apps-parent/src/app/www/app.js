'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ews', ['ionic', 'browseController', 'collaboratorsController', 'headerController', 'addToFeedController', 'tempoTasksController',
    'navigationService', 'sessionService', 'displayMessageService', 'pascalprecht.translate', 'feedItemDetailController', 'ngIOS9UIWebViewPatch'])

    .run(['$sessionService', '$injector',
        function ($sessionService) {
            $sessionService.setAppName(appSettings.getAppName());
        }])

    .run(['$fileExportSync', '$ionicPlatform', '$timeout', function ($fileExportSync, $ionicPlatform, $timeout) {
        $ionicPlatform.ready(function () {
            $timeout(function () {
                $fileExportSync.sync();
            }, 5000);
        });
    }])

    .config(['$provide', function ($provide) {
        $provide.decorator("$exceptionHandler", ['$delegate', function ($delegate) {
            return function (exception, cause) {
                $delegate(exception, cause);
                alert(exception.message);
            };
        }])
    }])

    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider
            .preferredLanguage('en')
            .fallbackLanguage('en')
            .registerAvailableLanguageKeys(['en'], {
                'en_*': 'en',
                'en-*': 'en'
            })
            .useStaticFilesLoader({
                prefix: 'locales/',
                suffix: '.json'
            });
    }])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: 'modules/header/header.html',
                controller: 'headerController'
            })

            .state('app.browse', {
                cache: false,
                url: '/browse?id',
                params: {additionalParams: null},
                views: {
                    'menuContent': {
                        templateUrl: 'modules/browse/browse.html',
                        controller: 'browseController'
                    }
                }
            })

            .state('app.collaborators', {
                cache: false,
                url: '/collaborators',
                params: {node: null},
                views: {
                    'menuContent': {
                        templateUrl: 'modules/collaborators/collaborators.html',
                        controller: 'collaboratorsController'
                    }
                }
            })

            .state('app.tempotasks', {
                cache: false,
                url: '/tempotasks',
                params: {node: null},
                views: {
                    'menuContent': {
                        templateUrl: 'modules/tempotasks/tempoTasks.html',
                        controller: 'tempoTasksController'
                    }
                }
            })
            .state('app.feeditemdetail', {
                cache: false,
                url: '/feedItemDetail',
                params: {feedItem: null},
                views: {
                    'menuContent': {
                        templateUrl: 'modules/feed/feedItemDetail/feedItemDetail.html',
                        controller: 'feedItemDetailController'
                    }
                }
            })

            .state('addtofeed', {
                cache: false,
                url: '/addToFeed',
                params: {addToFeedStrategy: null},
                templateUrl: 'modules/feed/addToFeed/addToFeed.html',
                controller: 'addToFeedController'
            });
        // if none of the above states are matched, use the enterprise workspace as the fallback
        $urlRouterProvider.otherwise(function () {
            return '/browse'
        });

    }])
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.backButton.text('').icon('ion-arrow-left-c');
    });