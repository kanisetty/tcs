angular.module('TempoTask', ['tempoTasksResource'])
    .factory('TempoTask', ['$sessionService', function($sessionService) {

        var TempoTask = function (tempoTaskData) {
            this.tempoTaskData = tempoTaskData;

            if ( this.tempoTaskData == null ){
                this.tempoTaskData = {
                    "name": '',
                    "assignedTo": -1,
                    "assignedToDisplayName": '',
                    "assignedToLoginName": '',
                    "dueDate": '',
                    "status": '',
                    "taskID": -1,
                    "createdBy": ''
                };
            }

            this.canChangeStatus = function(){
                return this.tempoTaskData.assignedTo == $sessionService.getUserID() || !this.tempoTaskData.assignedTo;
            };

            this.getName = function() {
                return this.tempoTaskData.name;
            };

            this.getAssignedTo = function() {
                return this.tempoTaskData.assignedTo;
            };

            this.getAssignedToDisplayName = function(){
                return this.tempoTaskData.assignedToDisplayName;
            };

            this.getDueDate = function() {
                return this.tempoTaskData.dueDate;
            };

            this.getStatus = function(){
                return this.tempoTaskData.status;
            };

            this.getTaskID = function(){
                return this.tempoTaskData.taskID
            };

            this.getTempoTaskData = function() {
                return this.tempoTaskData;
            };

            this.isRemovable = function(){
                return this.tempoTaskData.createdBy == $sessionService.getUserID();
            };
        };

        return TempoTask;
    }]);