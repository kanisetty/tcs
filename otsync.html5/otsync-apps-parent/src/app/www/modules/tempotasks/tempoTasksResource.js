angular.module('tempoTasksResource', ['dateService', 'Request', 'urlEncodingService', 'TempoTask'])
    .factory('$tempoTasksResource', ['$q', '$dateService', '$urlEncode', 'Request', '$sessionService', '$stateParams', 'TempoTask',
        function ($q, $dateService, $urlEncode, Request, $sessionService, $stateParams, TempoTask) {

            var _encodeAndAddFormHeader = function() {
                return {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                    transformRequest: $urlEncode
                };
            };

            var _processResponseForTempoTasks = function(response){
                var tasks = [];

                if (response != null && response.tasks != null) {

                    response.tasks.forEach(function(taskData){
                        tasks.push(new TempoTask(taskData))
                    });
                }

                return tasks;
            };

            return {

                createTempoTask: function(tempoTask){

                    var tempoTaskdata = tempoTask.getTempoTaskData();
                    var tempoTaskPayload = angular.copy(tempoTaskdata);

                    if(tempoTaskPayload.dueDate) {
                        tempoTaskPayload.dueDate = $dateService.getISODateString(new Date(tempoTaskPayload.dueDate));
                    }

                    var requestParams = angular.extend({
                        method: 'POST',
                        url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + $stateParams.node.getID() + '/task',
                        data: tempoTaskPayload
                    }, _encodeAndAddFormHeader());

                    var request = new Request(requestParams);
                    return $sessionService.runRequest(request);
                },

                updateTempoTask: function(tempoTask){

                    var requestParams = angular.extend({
                        method: 'PUT',
                        url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + tempoTask.getTaskID() + '/task',
                        params: {status: tempoTask.getStatus()}
                    }, _encodeAndAddFormHeader());

                    var request = new Request(requestParams);
                    return $sessionService.runRequest(request);
                },

                removeTempoTask: function(tempoTask) {

                    var requestParams = {
                        method: 'DELETE',
                        url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + tempoTask.getTaskID()
                    };

                    var request = new Request(requestParams);
                    return $sessionService.runRequest(request);
                },

                getTempoTasks: function(){

                    var requestParams = {
                        method: 'GET',
                        url: $sessionService.getGatewayURL() + '/content/v5/nodes/' + $stateParams.node.getID()  + '/task'
                    };

                    var request = new Request(requestParams);
                    return $sessionService.runRequest(request).then(_processResponseForTempoTasks);
                }
            }
        }]);
