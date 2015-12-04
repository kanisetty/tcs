$.extend(Tasks, new function(){
	
	//
	// GetTaskInfo
	//	

	/**
	This function will return the task metadata for the given object.
	
	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _GetTaskInfo = function(nodeID){
		
		var type = 'request';
		var subtype = 'GetTempoTasks';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";
		
		queue.RemoveGet(requestName);
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		requestData.info = {
			folderID: nodeID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddGet(requestID, ajaxData);
	};
	/**
	This function will return the tasks given object.
	
	@param {Integer} nodeID					object ID
	
	@public
	*/
	this.GetTaskInfo = function(nodeID){
		
		return $.when(_GetTaskInfo(nodeID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			// clonig the result to overwrite the manipulated cached result 
			Tasks.GetTaskInfoResponse(utils.clone(resultData.tasks));
		})
		.fail(function(){
			Tasks.GetTaskInfoResponse([]);
		});
	};
	
    /**
    This function will process the response from a successful TaskInfo request.
	
	 @public
    */
    this.GetTaskInfoResponse = function (data) {
		
		if(data !== null){
			Tasks.tasksList = data;
		}
		else{
			Tasks.tasksList = [];
		}		
		Tasks.DrawTasksArea();

    };
	
	/**
	This function will change user share status for the given object.
	
	@param {Integer} taskID					object ID
	
	
	@private
	*/
	var _UpdateTask = function(nodeID, taskStatus){

		var type = 'request';
		var subtype = 'UpdateTempoTask';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";
		
		queue.RemoveGet(requestName);
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		requestData.info = {
			taskID: nodeID,
			status: taskStatus
		};

		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
	
	/**
	This function will call UpdateTempoTask.

	@param {Integer} taskID					object ID				
			

	@public
	*/
	this.UpdateTask = function(taskID, taskStatus){

		return $.when(_UpdateTask(taskID, taskStatus)).pipe(request.ValidateResponse).done(function(resultData){

			Tasks.UpdateTaskResponse(resultData);
		});
	};
	
	 /**
    This function will process the response from a successful Task update.
	
	 @public
    */
    this.UpdateTaskResponse = function (data) {
		
		if( data.ok === true){
		
			ui.MessageController.ShowMessage(T('LABEL.TaskUpdated'));
		}
		else{
			ui.MessageController.ShowError(T('ERROR.RequestFailed'));
		}

    };

	/**
	This function will create a task for the share.
	
	@param {Integer} taskID					object ID
	
	
	@private
	*/
	var _CreateTask = function(folderID, name, assignedTo, dueDate){

		var type = 'request';
		var subtype = 'CreateTempoTasks';
		var requestName = type + subtype;
		var requestID = requestName + "(" + folderID + "," + name + ")";
		
		queue.RemoveGet(requestName);
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		requestData.info = {
			folderID: folderID,
			name: name,
			assignedTo: assignedTo,
			dueDate: dueDate
		};

		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
	
	/**
	This function will call CreateTempoTasks.

	@param {Integer} folderID			object ID of share
	@param {String} name				text to describe the task
	@param {String} assignedTo			username of assignee
	@param {String} dueDate				date the task is due in format yyyy-mm-ddThh:mm:ssZ

	@public
	*/
	this.CreateTask = function(folderID, name, assignedTo, dueDate){

		return $.when(_CreateTask(folderID, name, assignedTo, dueDate)).pipe(request.ValidateResponse).done(function(resultData){

			Tasks.CreateTaskResponse(resultData);
		});
	};

	/**
    This function will process the response from a successful Task create.
	
	 @public
    */
    this.CreateTaskResponse = function (data) {
		
		if( data.ok === true){
		
			ui.MessageController.ShowMessage(T('LABEL.TaskCreated'));
			this.GetTaskInfo(Browse.GetCurrentFolderInfo().DATAID);
			Tasks.DrawTasksArea();
		}
		else{
			ui.MessageController.ShowError(T('ERROR.RequestFailed'));
		}

    };	
	/**
	This function will delete a task.
	
	@param {Integer} taskID					object ID
	
	
	@private
	*/
	var _DeleteTask = function(nodeID){

		var type = 'request';
		var subtype = 'delete';
		var requestID = type + subtype + "(" + nodeID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID
		};

		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
	
	/**
	This function will call Delete node.

	@param {Integer} folderID			object ID of share
	@param {String} name				text to describe the task
	@param {String} assignedTo			username of assignee
	@param {String} dueDate				date the task is due in format yyyy-mm-ddThh:mm:ssZ

	@public
	*/
	this.DeleteTask = function(nodeID, callbackData){

		return $.when(_DeleteTask(nodeID)).pipe(request.ValidateResponse)
		.done(function(resultData){

			Tasks.DeleteTaskResponse(resultData, callbackData);
		})
		.fail(function(){
			Tasks.DeleteTaskResponse({}, callbackData);
		});
	};

	/**
    This function will process the response from a successful Task delete.
	
	 @public
    */
    this.DeleteTaskResponse = function (data, callbackData) {
	
		if(!$.isEmptyObject(data)){
		
			ui.MessageController.ShowMessage(T('LABEL.ObjectDeleteConfirmation', {subType: T('LABEL.Task'), name: callbackData.Name}));
			this.GetTaskInfo(Browse.GetCurrentFolderInfo().DATAID);
			Tasks.DrawTasksArea();
		}
		else{
			ui.MessageController.ShowError(T('ERROR.RequestFailed'));
		}

    };	
});