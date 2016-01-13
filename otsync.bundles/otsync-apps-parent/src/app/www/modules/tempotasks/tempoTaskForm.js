angular.module('TempoTaskForm', ['collaboratorsResource', 'TempoTask', 'tempoTasksResource'])
    .factory('TempoTaskForm', ['$q','$stateParams', '$sessionService', '$collaboratorsResource', 'TempoTask', '$tempoTasksResource',
        function ($q, $stateParams, $sessionService, $collaboratorsResource, TempoTask, $tempoTasksResource) {

            var TempoTaskForm = function(){
                var _assigneeNameOptions = [];
                var _collaborators = null;
                var _currentCollaborator = null;

                this.tempoTask = new TempoTask();

                this.init = function(){
                    var deferred = $q.defer();

                    $collaboratorsResource.getCollaborators($stateParams.node).then(function(collaborators){
                        _collaborators = collaborators;
                        _collaborators.forEach(function(collaborator){
                            _assigneeNameOptions.push(collaborator.getDisplayName());
                            if(collaborator.getCollaboratorName() == $sessionService.getUsername())
                                _currentCollaborator = collaborator;
                        });

                        deferred.resolve();
                    });

                    return deferred.promise;
                };

                this.canCreateTempoTask = function(){
                    return !_currentCollaborator.isReadOnlyCollaborator();
                };

                this.clearForm = function(){
                    this.tempoTask = new TempoTask();
                };

                this.createTempoTask = function(){
                    return $tempoTasksResource.createTempoTask(this.tempoTask);
                };

                this.getAssigneeNameOptions = function(){
                    return _assigneeNameOptions;
                };
            };

            return TempoTaskForm;
        }]);