angular.module('tempoTasks.services', ['ionic', 'angular-appworks'])
  .factory('taskContext', ['$stateParams', '$window', '$appworks', function ($stateParams, $window, $appworks) {
    var taskContext = {};

    return {
      init:init,
      getContext:getContext
    };

    function init(){
      taskContext = {
        nodeId: $stateParams.nodeId,
        contentServiceEndPoint: $appworks.auth.getAuth().gatewayUrl + '/content/v5/',
        shareServiceEndpoint: $appworks.auth.getAuth().gatewayUrl + '/shares/v5/',
        userName: $appworks.auth.getAuth().authResponse.addtl.contentServerConnector.csUsername,
        userId: $appworks.auth.getAuth().authResponse.addtl.contentServerConnector.csUserId,
        clientId: $appworks.auth.getAuth().clientId
      }
    }

    function getContext(){
      return taskContext;
    }
  }])

  .factory('taskForm', ['collaborators', 'taskContext', 'taskResource', '$filter',
    function (collaborators, taskContext, taskResource, $filter) {
      return function () {
        var assigneeNameOptions = [];
        angular.forEach(collaborators.get(), function (assignee) {
          this.push(assignee.user_name);
        }, assigneeNameOptions);

        return {
          assigneeOptions: assigneeNameOptions,
          canCreateTask: collaborators.hasWritePermission(taskContext.getContext().userName),
          task: taskResource({}),
          now: $filter('date')(new Date(), 'yyyy-MM-dd'),
          save: function () {
            return this.task.save();
          },
          clear: function () {
            this.task = taskResource({});
          }
        };
      }}])

  .factory('tasksVM', ['taskResource', 'collaborators', 'taskContext', function (taskResource, collaborators, taskContext) {
    return function () {
      return taskResource().query().then(function (data) {
        var taskList = [];
        angular.forEach(data, function (task) {
          task = taskResource(task);
          task.removable = task.CreatedBy == taskContext.getContext().userId;
          task.canChangeStatus = task.AssignedToID == taskContext.getContext().userId || !task.AssignedToID;
          this.push(task)
        }, taskList);

        return {
          tasks: taskList,
          statusOptions: ["PENDING", "ONHOLD", "INPROCESS", "ISSUE", "COMPLETED", "CANCELLED"]
        };
      });
    }
  }])

  .factory('collaborators', ['collaboratorResource', function (collaboratorResource) {
    var userList = [];
    return {
      hasWritePermission: hasWritePermission,
      get: function () {
        return userList;
      },
      init: query
    };

    function hasWritePermission(useName) {
      var currentUser = userList.filter(function (user) {
        return user.user_name == useName;
      })[0];
      return !currentUser.is_read_only;
    }

    function query() {
      return collaboratorResource.query().then(function (users) {
            userList = users;
          }
      )
    }
  }])

  .factory('collaboratorResource', ['taskContext', 'reauthHttp', function (taskContext, reauthHttp) {
    return {
      query: query
    };

    function query() {
      var req = {
        method: 'GET',
        url: taskContext.getContext().shareServiceEndpoint + 'outgoing/' + taskContext.getContext().nodeId,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
      };

      var respHandler = {
        isAuthFailure: function (data) {
          return !data.auth;
        },
        result: function (data) {
          return data.shares;
        },
        validate: function (data) {
          return !data.ok ? $q.reject(data.errMsg) : data;
        }
      };

      return reauthHttp(req, respHandler)
          .then(respHandler.validate)
          .then(respHandler.result);
    }
  }])

  .factory('taskResource', ['taskContext', 'reauthHttp', 'urlEncode', '$q', function (taskContext, reauthHttp, urlEncode, $q) {
    var actions = {
      save: save,
      update: update,
      remove: remove
    };

    return function (task) {
      if (task != undefined) {
        return angular.extend(task, actions);
      } else {
        return {query: query};
      }
    };

    /**
     * @return {string}
     */
    function ISODateString(date) {
      function pad(n) { return n<10 ? '0'+n : n }
      return  date.getUTCFullYear()
          + '-' + pad(date.getUTCMonth()+1)
          + '-' + pad(date.getUTCDate())
          + 'T' + pad(date.getUTCHours())
          + ':' + pad(date.getUTCMinutes())
          + ':' + pad(date.getUTCSeconds())
          + 'Z';
    }

    function save() {
      var taskPayload = angular.extend({}, this);
      if (this.dueDate) {
        taskPayload.dueDate = ISODateString(new Date(this.dueDate));
      }
      var req = angular.extend({
        method: 'POST',
        url: taskContext.getContext().contentServiceEndPoint + 'nodes/' + taskContext.getContext().nodeId + '/task',
        data: taskPayload
      }, reqCommMixin());
      var handler = respHandler();
      return reauthHttp(req, handler).then(handler.validate).then(handler.result);
    }

    function update() {
      var req = angular.extend({
        method: 'PUT',
        url: taskContext.getContext().contentServiceEndPoint + 'nodes/' + this.taskID + '/task',
        params: {status: this.Status}
      }, reqCommMixin());

      var handler = respHandler();
      return reauthHttp(req, handler).then(handler.validate);
    }

    function remove() {
      var req = {
        method: 'DELETE',
        url: taskContext.getContext().contentServiceEndPoint + 'nodes/' + this.taskID
      };

      var handler = respHandler();
      return reauthHttp(req, handler).then(handler.validate);
    }

    function query() {
      var req = {
        method: 'GET',
        url: taskContext.getContext().contentServiceEndPoint + 'nodes/' + taskContext.getContext().nodeId + '/task'
      };

      var handler = angular.extend(respHandler(),
          {
            result: function (data) {
              return data.tasks;
            }
          });
      return reauthHttp(req, handler).then(handler.validate).then(handler.result);
    }

    function respHandler() {
      return {
        isAuthFailure: function (data) {
          return !data.auth;
        },
        validate: function (data) {
          return !data.ok ? $q.reject(data.errMsg) : data;
        }
      };
    }

    function reqCommMixin() {
      return {
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
        transformRequest: urlEncode
      };
    }
  }])

  .factory('urlEncode', function () {
    return function (data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? encodeObject(data) : data;
    };

    function encodeObject(obj) {
      var query = '', innerObj;
      for (var name in obj) {
        var value = obj[name];

        if (value instanceof Array) {
          for (var i = 0; i < value.length; ++i) {
            var keyName = (name + '[' + i + ']');
            innerObj = {};
            innerObj[keyName] = value[i];
            query += encodeObject(innerObj) + '&';
          }
        }
        else if (value instanceof Object) {
          for (var subName in value) {
            innerObj = {};
            innerObj[(name + '[' + subName + ']')] = value[subName];
            query += encodeObject(innerObj) + '&';
          }
        }
        else if (value !== undefined && value !== null)
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    }
  })

  .factory('toast', ['$ionicLoading', function ($ionicLoading) {
    return function (message) {
      $ionicLoading.show({template: message, duration: 1200, noBackDrop: true});
    }
  }])
  .factory('reauthHttp', ['$http', '$auth', function ($http, $auth) {
    return run;

    function run(req, respHandler) {

      return $http(req).then(function (resp) {
        if (resp.status == 401 || respHandler.isAuthFailure(resp.data)) {
          return authenticate().then(function () {
            return run(req, respHandler);
          })
        } else {
          return resp.data;
        }
      });
    }

    function authenticate() {

      return $auth.reauth();
    }
  }]);
