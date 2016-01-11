angular.module('tempoTasksController', ['TempoTaskForm', 'dateService', 'tempoTasksResource', 'headerService', 'Header'])

    .controller('tempoTasksController', ['$scope', '$displayMessageService', 'TempoTaskForm', '$dateService', '$tempoTasksResource', '$headerService', 'Header',
            function ($scope, $displayMessageService, TempoTaskForm, $dateService, $tempoTasksResource, $headerService, Header) {
                $scope.init = init;

                $scope.create = function (tempoTaskForm, webForm) {
                    tempoTaskForm.createTempoTask()
                        .then(function () {
                            tempoTaskForm.clearForm();
                            webForm.$setPristine();
                            populateTempoTasks();
                        })
                };

                $scope.now = $dateService.getFormattedNow();

                $scope.remove = function (tempoTask) {
                    $tempoTasksResource.removeTempoTask(tempoTask)
                        .finally(populateTempoTasks);
                };

                $scope.statusOptions = ["PENDING", "ONHOLD", "INPROCESS", "ISSUE", "COMPLETED", "CANCELLED"];

                $scope.update = function (tempoTask) {
                    $tempoTasksResource.updateTempoTask(tempoTask)
                        .finally(populateTempoTasks);
                };

                $scope.$on('serverError', function handler(event, errorArgs) {
                    $displayMessageService.showToastMessage(errorArgs.errMsg);
                });

                init();

                function init() {
                    $displayMessageService.showDisplayMessage('LOADING');

                    var header = new Header($displayMessageService.translate('TEMPO TASKS'), false);

                    $headerService.setHeader(header);

                    var tempoTaskForm = new TempoTaskForm();
                    tempoTaskForm.init().then(function(){
                        $scope.tempoTaskForm = tempoTaskForm;
                        populateTempoTasks();
                    });
                }

                function populateTempoTasks() {
                    $displayMessageService.showDisplayMessage('LOADING');

                    $tempoTasksResource.getTempoTasks()
                        .then(function(tempoTasks){
                            $scope.tempoTasks = tempoTasks;
                            $displayMessageService.hideMessage();
                        });
                }
            }]);
