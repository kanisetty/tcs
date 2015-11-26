angular.module('tempoTasks.controllers', ['ionic', 'tempoTasks.services'])

    .controller('tasksController', ['$scope', 'collaborators', 'taskForm', 'tasksVM', '$ionicLoading', 'toast', '$translate', '$ionicPlatform', 'taskContext',
        function ($scope, collaborators, taskForm, tasksVM, $ionicLoading, toast, $translate, $ionicPlatform, taskContext) {
            var initialized = false;

            $scope.init = init;

            $scope.create = function (taskForm, webForm) {
              taskForm.save()
                  .then(function () {
                    taskForm.clear();
                    webForm.$setPristine();
                    populateTasks();
                  })
                  .catch(function (error) {
                    toast(error);
                  });
            };

            $scope.remove = function (task) {
              task.remove(task)
                  .catch(function (error) {
                    toast(error)
                  })
                  .finally(populateTasks);
            };

            $scope.update = function (task) {
              task.update(task)
                  .catch(function (error) {
                    toast(error);
                    populateTasks();
                  });
            };

            onDeviceLoadInit();

            function onDeviceLoadInit() {

              var onAuthFinished = function() {

                  if (ionic.Platform.isReady && !initialized) {
                      init();
                  }
                  document.removeEventListener('appworksjs.auth', onAuthFinished)
              };

              if(!initialized) {
                  document.addEventListener('appworksjs.auth', onAuthFinished);

                  $ionicPlatform.ready(function () {
                      $ionicLoading.show({template: $translate('LOADING')});
                      if (window.gatewayUrl != undefined && window.gatewayUrl != '' && !initialized) {
                          init();
                      }
                  });
              }
            }

            function init() {
                initialized = true;

                $translate.use('en-US')
                    .then(function () {
                        taskContext.init();
                        collaborators.init()
                            .then(initTaskForm)
                            .then(populateTasks)
                            .then($ionicLoading.hide)
                            .catch(function () {
                              $ionicLoading.hide();
                              toast($translate('INITIALIZATION_FAILED'));
                            });
                      });
            }

            function populateTasks() {
              return tasksVM().then(function (tasksVM) {
                $scope.tasksVM = tasksVM;
              });
            }

            function initTaskForm() {
              $scope.taskForm = taskForm();
            }
            }]);
