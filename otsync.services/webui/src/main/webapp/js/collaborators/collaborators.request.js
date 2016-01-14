$.extend(Collaborators, new function(){
    
   //
	// GetSharedObjectInfo
	//	

	/**
	This function will return the sharing metadata for the given object.
	
	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _GetSharedObjectInfo = function(nodeID){
		
		var type = 'request';
		var subtype = 'getsharesforobject';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";
		
		queue.RemoveGet(requestName);
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		// Cache successful results for 60 seconds.
		ajaxData.cacheDuration = 60000;
		
		return queue.AddGet(requestID, ajaxData);
	};

	/**
	This function will return the sharing metadata for the given object.
	
	@param {Integer} nodeID					object ID
	
	@public
	*/
	this.GetSharedObjectInfo = function(nodeID){
		
		return $.when(_GetSharedObjectInfo(nodeID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			// clonig the result to overwrite the manipulated cached result 
			Collaborators.GetSharedObjectInfoResponse(utils.clone(resultData), nodeID);
		})
		.fail(function(){
			Collaborators.GetSharedObjectInfoResponse([], nodeID);
		});
	};
	
    /**
    This function will process the response from a successful GetSharedObjectInfo request.

    @param {Array} data
    @paramFeature {Integer} DataID			object ID
	@paramFeature {String} FirstName		user first name
    @paramFeature {String} FolderName		object name
    @paramFeature {Integer} IsOwner			1=is the object owner
    @paramFeature {Integer} IsReadOnly		0=read/write, 1=read-only
	@paramFeature {String} LastName			user last name
    @paramFeature {String} LastUpdate		object modified date
    @paramFeature {String} Name				user login name
    @paramFeature {Integer} OwnerID			object owner ID
    @paramFeature {String} photoURL			URL to user image
    @paramFeature {Integer} ShareStatus		0=pending share, 1=accepted share
    @paramFeature {Integer} UserID			user ID

    @public
    */
    this.GetSharedObjectInfoResponse = function (data, nodeID) {
		//Set collaboratorsList to a copy of data
		if(data !== null){
			Collaborators.collaboratorsList = utils.clone(data);
		}
		else{
			Collaborators.collaboratorsList = [];
		}

		var currentUserIsOwner = false;
		
		if (Collaborators.collaboratorsList.length > 0)
		{
			currentUserIsOwner = info.folderIsShareable;
		}

		utils.AddDisplayName(Collaborators.collaboratorsList);

		for(var key in Collaborators.collaboratorsList)
		{
			var _dropDown = {};
			if(Collaborators.collaboratorsList[key].IsOwner === 1)
			{
				_dropDown = { textRight:T('LABEL.Owner'),isOwner:currentUserIsOwner };
			}else if(Collaborators.collaboratorsList[key].ShareStatus === 0)
			{
				if(currentUserIsOwner || info.isAdminModeRequested)
				{
					_dropDown = {textLeft:T('LABEL.Pending'),isOwner:currentUserIsOwner, classes:'pending'};
				}
			}
			else if(Collaborators.collaboratorsList[key].ShareStatus === 1)
			{
				if(currentUserIsOwner)
				{
					if(Collaborators.collaboratorsList[key].IsExternalUser === true)
					{
						_dropDown = {textLeft:T('LABEL.ExternalUser'),isOwner:currentUserIsOwner};
					}
					else
					{
						_dropDown = {isOwner:currentUserIsOwner};
					}
				}
			}

			Collaborators.collaboratorsList[key].dropDown = _dropDown;
			Collaborators.collaboratorsList[key].origShareType = Collaborators.collaboratorsList[key].IsReadOnly == SHARETYPE.READONLY ? SHARETYPE.READONLY : SHARETYPE.READWRITE;
			Collaborators.collaboratorsList[key].SelectID = 'dropdownShareType' + Collaborators.collaboratorsList[key].UserID;
			Collaborators.collaboratorsList[key].ShareType = Collaborators.collaboratorsList[key].IsReadOnly == SHARETYPE.READONLY ? SHARETYPE.READONLY : SHARETYPE.READWRITE;
			Collaborators.addCollaboratorInitalState(Collaborators.collaboratorsList[key]);				
			
		}
		Collaborators.DrawCollaboratorsArea();
		
		//get the taskInfo
		Tasks.GetTaskInfo(nodeID);		

    };

	/**
	This function will return the sharing metadata for the given object.
	
	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _GetShareChildInfo = function(nodeID){
		
		var type = 'request';
		var subtype = 'getsharesforparent';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";
		
		queue.RemoveGet(requestName);
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		// Cache successful results for 60 seconds.
		ajaxData.cacheDuration = 60000;
		
		return queue.AddGet(requestID, ajaxData);
	};

	/**
	This function will return the sharing metadata for the given object.
	
	@param {Integer} nodeID					object ID
	
	@public
	*/
	this.GetShareChildInfo = function(nodeID){
		
		return $.when(_GetShareChildInfo(nodeID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			// clonig the result to overwrite the manipulated cached result 
			//calling the same result as the GetShareObjectInfo to keep consistent
			Collaborators.GetSharedObjectInfoResponse(utils.clone(resultData), nodeID);
		})
		.fail(function(){
			Collaborators.GetSharedObjectInfoResponse([], nodeID);
		});
	};
	
	//
	// ChangeShareStatus
	//
	
	/**
	This function will change user share status for the given object.
	
	@param {Integer} nodeID					object ID
	
	
	@private
	*/
	var _UpdateCollaborators = function(nodeID, message){

		var type = 'request';
		var subtype = 'multi';
		var requestID = type + subtype + "UpdateCollaborators(" + nodeID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = [];
		
		$.each(Collaborators.collaboratorsList, function(index, value){
			var info = {};
			
			if(value.MarkForDelete){
				info.subtype = 'unshare';
				info.nodeID = nodeID;
				info.userList = [value.Name];
				
				requestData.info.push(info);
			}
			else if(value.MarkForAdd){
				info.subtype = 'share';
				info.nodeID = nodeID;
				info.userList = [];
				info.userList.push({'userLogin': value.Name, 'shareType': value.ShareType});
				info.message = message;
				
				requestData.info.push(info);
			}
			else if(value.MarkForEdit){
				
				info.subtype = 'changesharetype';
				info.nodeID = nodeID;
				info.userID = value.UserID;
				info.shareType = value.ShareType;
					
				requestData.info.push(info);
			};
			
			
		});
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
	
	
	/**
	This function will call changeShareStatus.

	@param {Integer} nodeID					object ID				
			

	@public
	*/
	this.UpdateCollaborators = function(nodeID, message){
		$('#updatingImage').show();
		return $.when(_UpdateCollaborators(nodeID, message)).pipe(request.ValidateResponse).done(function(resultData){
			
			// Clear all sharing info from the cache.
			// Currently we don't have a way to remove a specific key and it will keep the cache small.
			queue.ClearCache("requestgetsharesforobject");
			Collaborators.UpdateCollaboratorsResponse(nodeID,resultData);
		});
	};
	/**
	This function will process the response from a successful UnshareObject request.

	@public
	*/
	this.UpdateCollaboratorsResponse = function(nodeID,resultData) {

		$('#updatingImage').hide();
		
		//reload the collaborator list
		Collaborators.GetSharedObjectInfo(nodeID);
		
		var noErrors = true;
		for(var result in resultData)
		{
			if ( result.ok == false )
			{
				noErrors = false;
			}
		}

		if (noErrors == true )
		{
			ui.MessageController.ShowMessage(T('LABEL.MultiChangeShareTypeConfirmation'));
		}
    };

});