// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('tempoTasks', ['ionic', 'tempoTasks.controllers', 'tempoTasks.services', 'pascalprecht.translate'])

    .config(function ($translateProvider) {
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
    })

    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('app', {
            url: '/:nodeId/:lang',
            templateUrl: 'templates/tasks-template.html',
            controller: 'tasksController'
          });

      $urlRouterProvider.otherwise('/');
    }])

    .run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        //Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        //for form inputs)
        if (window.cordova && window.cordova.plugins&&window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        $ionicPlatform.registerBackButtonAction(function () {
          cordova.exec(function(){},function(){},'Application','closeApp',[]);
        }, 100);

      });
    })
;
