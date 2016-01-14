/**
Extend the Share Object with functions that request data from the server

//vars
_msgDelay


//methods
_AcceptSharingRequest
AcceptSharingRequest
AcceptSharingRequestResponse

_AcceptAllShareRequests
AcceptAllShareRequests
AcceptAllShareRequestsResponse

_RejectSharingRequest
RejectSharingRequest
RejectSharingRequestResponse

_BrowseSharedObjectsInit
_BrowseSharedObjects
BrowseSharedObjects
_BrowseSharedObjectsMore
BrowseSharedObjectsMore
BrowseSharedObjectsResponse

_CountPendingShareRequests
CountPendingShareRequests
CountPendingShareRequestsResponse

_GetPendingShareRequests
GetPendingShareRequests
GetPendingShareRequestsResponse
GetPendingShareRequestSummary
GetPendingShareRequestSummaryResponse

_InviteUser
UserShare
UserShareResponse

_InviteUsers

_UninviteUser
UserUnshare
UserUnshareResponse

_UnshareObject
UnshareObject
UnshareObjectResponse

 **/ 


$.extend(Share, new function(){

	var _msgDelay = 5 * 1000; // 5 seconds
	
	//
	// AcceptSharingRequest
	//	

	/**
	This function will accept a sharing request for the given object for the current user.

	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _AcceptSharingRequest = function(nodeID){
		
		var type = 'request';
		var subtype = 'acceptsharerequest';
		var requestID = type + subtype + "(" + nodeID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
	

	/**
	This function will accept a sharing request for the given object for the current user.

	@param {Integer} nodeID					object ID
	@param {Integer} context				who is calling this method (dialog or menu)
	
	@private
	*/
	this.AcceptSharingRequest = function(nodeID, context){
	
		context = utils.DefaultValue(context, null);
		
		return $.when(_AcceptSharingRequest(nodeID)).pipe(request.ValidateResponse).done(function(resultData){
			
			// Clear the invitation indicator from the cache, so it will be fetched next time.
			queue.ClearCache("requestgetsharelistcount");
			
			Share.AcceptSharingRequestResponse(nodeID, context);
		});	
	};


    /**
    This function will process the response from a successful AcceptSharingRequest request.

    @param {Integer} nodeID
	@param {Integer} context				who is calling this method (dialog or menu)

    @public
    */
    this.AcceptSharingRequestResponse = function (nodeID, context) {
        ui.RemoveItemRow($('#itemRequest-' + nodeID));
        Share.UpdateRequestNotification(-1);

		if (context == 'menu') {
			Share.MarkRequestAcceptSuccess('#shareRequest', nodeID);
			Browse.BrowseObject(ui.GetCurrentNodeID());
			setTimeout("Share.FadeShareRequest('#shareRequest" + nodeID + "', '" + context + "');", _msgDelay);
			
			// make sure menu stays visible to address quirk with IE
			$("#shareRequest").trigger('mouseover');
		}
		else if (context == 'dialog') {
			Share.MarkRequestAcceptSuccess('#shareRequestFull', nodeID);
			setTimeout("Share.FadeShareRequest('#shareRequestFull" + nodeID + "', '" + context + "');", _msgDelay);
		}

		_RemoveSharingRequest(nodeID);
    };


	/**
	This function will accept a series of share requests.
	
	@param {Array} nodeIDs					array of object ID's
	
	@private
	*/
	var _AcceptAllShareRequests = function(nodeIDs){
		
		var type = 'request';
		var subtype = 'multi';
		var requestID = type + subtype + "acceptsharerequest(" + nodeIDs + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = [];
		
		$.each(nodeIDs, function(index, value){
			var info = {
				subtype: 'acceptsharerequest',
				nodeID: value
			};
			
			requestData.info.push(info);
		});
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};


	/**
	This function will accept a series of sharing requests.
	
	@param {Array} nodeIDs					array of object ID's

	@public
	*/
	this.AcceptAllShareRequests = function(nodeIDs){
		
		return $.when(_AcceptAllShareRequests(nodeIDs)).pipe(request.ValidateResponse)
		.done(function(resultData){
			Share.AcceptAllShareRequestsResponse(nodeIDs, resultData);
		})
		.fail(function(){
			Share.AcceptAllShareRequestsResponse(nodeIDs, []);
		});
	};

    /**
    This function will process the response from a successful AcceptSharingRequest request.

	@param {Array} nodeIDs					array of object ID's
	@param {Integer} data					response data

    @public
    */
    this.AcceptAllShareRequestsResponse = function (nodeIDs, data) {
		//update the pending share request summary
		Share.GetPendingShareRequestSummary();
		
		//reload the content area
		Browse.BrowseObject(ui.GetCurrentNodeID());
		
		var successCount = 0;
		
		$.each(data, function(index, obj) {
			if (obj != null && obj.ok == true) {
				successCount++;
			}
		});
		
		ui.MessageController.ShowMessage(T('LABEL.MultiAcceptShareConfirmation', {count: successCount}));
    };


	//
	// RejectSharingRequest
	//	

	/**
	This function will reject a sharing request for the given object for the current user.

	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _RejectSharingRequest = function(nodeID){
		
		var type = 'request';
		var subtype = 'rejectsharerequest';
		var requestID = type + subtype + "(" + nodeID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
	

	/**
	This function will reject a sharing request for the given object for the current user.

	@param {Integer} nodeID					object ID
	@param {Integer} context				who is calling this method (dialog or menu)
	
	@private
	*/
	this.RejectSharingRequest = function(nodeID, context){

		context = utils.DefaultValue(context, null);
	
		return $.when(_RejectSharingRequest(nodeID)).pipe(request.ValidateResponse).done(function(resultData){
			
			// Clear the invitation indicator from the cache, so it will be fetched next time.
			queue.ClearCache("requestgetsharelistcount");
			
			Share.RejectSharingRequestResponse(nodeID, context);
		});
	};
	
	
    /**
    This function will process the response from a successful RejectSharingRequest request.

    @param {Integer} nodeID
	@param {Integer} context				who is calling this method (dialog or menu)

    @public
    */
    this.RejectSharingRequestResponse = function (nodeID, context) {
        ui.RemoveItemRow($('#itemRequest-' + nodeID));
        Share.UpdateRequestNotification(-1);

		// clicking the accept will send a blur message when button is removed,
		// so make sure we send a focus message so that the menu doesn't hide
		
		if (context == 'menu') {
			$('#shareRequestTabStop').focus();
			Share.MarkRequestRejectSuccess('#shareRequest', nodeID);
			setTimeout("Share.FadeShareRequest('#shareRequest" + nodeID + "', '" + context + "');", _msgDelay);
		}
		else if (context == 'dialog') {
			Share.MarkRequestRejectSuccess('#shareRequestFull', nodeID);
			setTimeout("Share.FadeShareRequest('#shareRequestFull" + nodeID + "', '" + context + "');", _msgDelay);
		}

		_RemoveSharingRequest(nodeID);
    };


	//
	// BrowseSharedObjects
	//

	/**
	This function contains common code for _BrowseObject and _BrowseObjectMore.
	
	@param {Integer} pageNumber				page number to retrieve
	
	@private
	*/
	var _BrowseSharedObjectsInit = function(pageNumber){
		
		var requestData = new request.ObjectRequestGet('request', 'getsharedbyuser');
			
		// Integer		pageNumber [optional, defaults to 1]
		// Integer		pageSize [optional, defaults to all]
		// String		sortOn (Name, ModifyDate, Size, DataID) [optional, defaults to "Name"]
		// Boolean		sortDescending [optional, defaults to False]
		requestData.info = {
			pageNumber: 1,
			pageSize: 1000,
			sortOn: "Name",
			descending: "False"
		};
		
		return requestData;
	};
	
	
	/**
	This function will return the objects the current user has explicitly shared (page 1).

	@private
	*/
	var _BrowseSharedObjects = function(){
		
		var pageNumber = 1;
		
		pagination.ResetPage();
		
		var requestData = _BrowseSharedObjectsInit(pageNumber);
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		var requestID = "requestgetsharedbyuser()";
		
		return queue.AddGet(requestID, ajaxData);
	};


	/**
	This function will return the objects the current user has explicitly shared (page 1).
	
	@public
	**/
	this.BrowseSharedObjects = function(){
		
		return $.when(_BrowseSharedObjects()).pipe(request.ValidateResponse)
		.done(function(resultData){
			pagination.ResetRequest();
			resultData = pagination.Filter(resultData, "DataID");
			Share.BrowseSharedObjectsResponse(resultData, pagination.GetPageNumber());
		})
		.fail(function(){
			pagination.ResetRequest();
			Share.BrowseSharedObjectsResponse([], pagination.GetPageNumber());
		});	
	};


	/**
	This function will return the objects the current user has explicitly shared (next page).
	
	@private
	*/
	var _BrowseSharedObjectsMore = function(){
		
		if (pagination.IsDone() || pagination.IsBusy()){
			return null;
		}else{
			
			var pageNumber = pagination.IncrementPageNumber();
			
			var requestData = _BrowseSharedObjectsInit(pageNumber);
			
			var ajaxData = new request.ObjectFrontChannel(requestData);
			
			var requestID = "requestgetsharedbyuser()";
			
			return queue.AddGet(requestID, ajaxData);
		}
	};
	

	/**
	This function will return the objects the current user has explicitly shared (next page).
	
	@public
	**/
	this.BrowseSharedObjectsMore = function(){
		
		return $.when(_BrowseSharedObjectsMore()).pipe(request.ValidateResponse)
		.done(function(resultData){
			pagination.ResetRequest();
			resultData = pagination.Filter(resultData, "DataID");
			Share.BrowseSharedObjectsResponse(resultData, pagination.GetPageNumber());
		})
		.fail(function(){
			pagination.ResetRequest();
			Share.BrowseSharedObjectsResponse([], pagination.GetPageNumber());
		});	
	};


    /**
    This function will process the response from a successful BrowseSharedObjects request.

    @param {Array} data
    @paramFeature {Integer} DataID			object node ID
    @paramFeature {String} ModifyDate		object modified date
    @paramFeature {String} Name				object name
    @paramFeature {Integer} Size			object size
	@param {Integer} pageNumber				current page number

    @public
    */
    this.BrowseSharedObjectsResponse = function(data, pageNumber) {

		$('#updatingImage').data('PageRequested',false);
		$('#updatingImage').hide();

		if (data.length > 0) {

			for(var i in data){
				data[i].unShareButton = {classes:'itemUnshareButton',name:'unshareButton',textLeft:T('LABEL.Unshare') };
			}

			if(pageNumber === 1){

				ui.LoadTemplateInEmptyElement("#item_tmpl", utils.MarkLast(data), "#items");
			}
			else{

				$('.item').removeClass('itemLast');
				ui.LoadTemplate("#item_tmpl", utils.MarkLast(data), "#items");
			}
        }
		else{
			if(pageNumber === 1){
				ui.LoadTemplateInEmptyElement("#message_tmpl", {message: T('LABEL.NoSharedFoldersMessage'), id: 'noSharedFoldersMessage'}, '#items');
			}
		}
    };


	//
	// CountPendingShareRequests
	//	
	
	/**
	This function will get the pending share count for the current user.
	
	@private
	*/
	var _CountPendingShareRequests = function(){
		
		var type = 'request';
		var subtype = 'getsharelistcount';
		var requestID = type + subtype + "()";
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		// Cache successful results for 60 seconds.
		ajaxData.cacheDuration = 60000;
		
		return queue.AddGet(requestID, ajaxData);
	};

		
	/**
	This function will return the pending share count for the current user.
	
	@public
	*/
	this.CountPendingShareRequests = function(){
		
		return $.when(_CountPendingShareRequests()).pipe(request.ValidateResponse).done(function(resultData){
			Share.CountPendingShareRequestsResponse(resultData);
		});	
	};
	
	
    /**
    This function will process the response from a successful CountPendingShareRequests request.

    @param {Object} data
    @paramFeature {Integer} shareCount		number of pending share requests

    @public
    */
    this.CountPendingShareRequestsResponse = function (data) {

        if (data instanceof Object && data.shareCount > 0) {
            Share.InitializePendingShareRequest(data.shareCount);
        }
    };


	//
	// GetPendingShareRequests
	//	

	/**
	This function will return pending share requests for the current user.

	@private
	*/
	var _GetPendingShareRequests = function(){
		
		var type = 'request';
		var subtype = 'getsharelist';
		var requestID = type + subtype + "()";
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		requestData.info = {
			pageSize: 1000,
			pageNumber: 1
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddGet(requestID, ajaxData);
	};

	
	/**
	This function will return pending share requests for the current user.
	
	@public
	**/
	this.GetPendingShareRequests = function(){
		return $.when(_GetPendingShareRequests()).pipe(request.ValidateResponse).done(function(resultData){
			Share.GetPendingShareRequestsResponse(resultData);
		});
	};
	

    /**
    This function will process the response from a successful GetPendingShares request.

    @param {Array} data
    @paramFeature {Integer} DataID			object ID
	@paramFeature {String} FirstName		user first name
    @paramFeature {String} FolderName		object name
	@paramFeature {String} LastName			user last name
    @paramFeature {String} LastUpdate		object modified date
    @paramFeature {String} Name				user login name
    @paramFeature {Integer} OwnerID			user ID
    @paramFeature {String} photoURL			URL to user image

    @public
    */
    this.GetPendingShareRequestsResponse = function (data) {
		

		$('#itemRequests').empty();

        if (data instanceof Array && data.length > 0) {		

			utils.AddDisplayName(data);

			for(var i in data)
				{
					data[i].acceptButton = {classes:'shareRequestButton shareRequestAcceptButton',name:'shareRequestAcceptButton',textLeft:T('LABEL.Accept') };
					data[i].rejectButton = {classes:'shareRequestButton shareRequestDeclineButton',name:'shareRequestDeclineButton',textLeft:T('LABEL.Decline') };
				}
			ui.LoadTemplateInEmptyElement("#itemRequest_tmpl", utils.MarkLast(data), "#itemRequests");
			Share.InitializePendingShareRequest(data.length);
		}
    };

	/**
	This function will return pending share requests for the current user.
	
	@public
	**/
	this.GetPendingShareRequestSummary = function(){
		return $.when(_GetPendingShareRequests()).pipe(request.ValidateResponse).done(function(resultData){
			Share.GetPendingShareRequestSummaryResponse(resultData);
		});
	};
	
	
    /**
    This function will process the response from a successful GetPendingShares request.

    @param {Array} data
    @paramFeature {Integer} DataID			object ID
	@paramFeature {String} FirstName		user first name
    @paramFeature {String} FolderName		object name
	@paramFeature {String} LastName			user last name
    @paramFeature {String} LastUpdate		object modified date
    @paramFeature {String} Name				user login name
    @paramFeature {Integer} OwnerID			user ID
    @paramFeature {String} photoURL			URL to user image

    @public
    */
    this.GetPendingShareRequestSummaryResponse = function (data) {
		var totalRequests = 0;
		var i;
		
		$('#shareRequestSummary').empty();

		if (data instanceof Array && data.length > 0) {		

			utils.AddDisplayName(data);

			totalRequests = data.length;
			Share.InitializePendingShareRequest(totalRequests);
			
			for (i in data) {
				data[i].acceptButton = {classes:'shareRequestButton shareRequestAcceptButton',name:'shareRequestAcceptButton',textLeft:T('LABEL.Accept') };
				data[i].rejectButton = {classes:'shareRequestButton shareRequestDeclineButton',name:'shareRequestDeclineButton',textLeft:T('LABEL.Decline') };
			}
			
			ui.LoadTemplateInEmptyElement("#shareRequestMenu_tmpl", data, "#shareRequestSummary");
			
			if (totalRequests > Share.maxRequests) {
				
				// need to temporarily show the menu then hide later to 
				// properly calcuate height of elements
				$("#shareRequestSummary").show();
				
				for (i in data) {
					if (i >= Share.maxRequests) {
						$('#shareRequest' + data[i].DataID).hide();
						data[i].hidden = true;
					}
					else {
						data[i].hidden = false;
					}
				}
				
				$("#shareRequestSummary").hide();
				
				
				var totalRequestsStr = T('LABEL.SeeAllXNotifications', {total: totalRequests});
				ui.LoadTemplate("#shareRequestMenuBottom_tmpl", [{ totalRequests: totalRequestsStr }], "#shareRequestSummary");
			}

			Share.sharingRequests = data;
		}
		else {
			$(".shareRequest").css('display', 'none');
			$("#shareRequestCount").css('display', 'block');
		}
    };

	//
	// UserShare
	//	

	/**
	This function will share the given object with the specified user.

	@param {Integer} nodeID					object ID
	@param {String} userName				user login name
	@param {Integer} shareType				1=read-only, 2=read/write
	
	@private
	*/
	var _InviteUser = function(nodeID, userName, shareType, message) {
		
		var shareInfo = [{'userName':userName,'shareType':shareType}];
		
		return _InviteUsers(nodeID, shareInfo, message);
	};
	
	
	/**
	This function will change the share state on an object for a given user. 

	@param {Integer} nodeID					object ID				
	@param {String} userName				user login name				
	@param {Integer} shareType				1=read-only, 2=read/write				
	@param {Object} callbackData			data about the user to be returned in the response

	@public
	*/
	this.UserShare = function(nodeID, userName, shareType, message, callbackData){
		
		return $.when(_InviteUser(nodeID, userName, shareType, message)).pipe(request.ValidateResponse).done(function(resultData){
			
			// Clear all sharing info from the cache.
			// Currently we don't have a way to remove a specific key and it will keep the cache small.
			queue.ClearCache("requestgetsharesforobject");
			
			// Clear all user data from the cache, to keep the cache size small.
			queue.ClearCache("requestusersearch");
			
			Share.UserShareResponse(callbackData, shareType, resultData);
		});
	};


	/**
	This function will process the response from a successful UserShare request.

	@param {Object} data
    @paramFeature {String} FirstName		user first name
    @paramFeature {Integer} ID				user ID
    @paramFeature {Integer} isFollowing		?number of users the user is following?
    @paramFeature {String} LastName			user last name
    @paramFeature {String} Name				user login name
    @paramFeature {String} PhotoURL			URL to user image

	@public
	*/
	this.UserShareResponse = function(data, shareType, resultData) {
		
		
		if( $('.collaborator').length > 0){
			data.dropDown = {textLeft: T('LABEL.Pending'),isOwner: true, classes:'pending' };
			data.ShareStatus = 0;
			data.IsOwner = 0;
			data.photoURL=data.PhotoURL;
			data.OwnerID= info.userID;
			data.UserID= resultData[data.Name].userID;
			data.IsReadOnly = shareType == SHARETYPE.READONLY;
			data.ShareType = shareType;
			data.SelectID = 'dropdownShareType' + data.UserID;

			if( data.hasOwnProperty("IsExternalUser") && data.IsExternalUser)
			{
				data.IsExternalUser = true;
			}
			else{

				data.IsExternalUser = false;
			}
			Collaborators.addCollaboratorInitalState(data);
			// update local collaborators List
			Collaborators.collaboratorsList.push(data);
			Collaborators.DrawCollaboratorsArea();
		}
		else{
			Collaborators.LoadCollaboratorUpdatingImage();
			Collaborators.GetSharedObjectInfo(ui.GetCurrentNodeID());
		}
		
		Tasks.AddAssigneeAutoComplete("#taskAssignedToInput");

	};


	//
	// ShareObject
	//

	/**
	This function will share the given object with the specified users.

	@param {Integer} nodeID					object ID
	@param {Array} shareInfo
	@paramFeature {Integer} shareType		1=read-only, 2=read/write
	@paramFeature {String} userName			user login name

	@private
	*/
	var _InviteUsers = function(nodeID, shareInfo, message){
		
		var type = 'request';
		var subtype = 'share';
		var requestID = type + subtype + "(" + nodeID + ")";
		
		var dict = new Array();
		
		$.each(shareInfo, function(index, value){
			dict.push({
				'userLogin':value.userName,
				'shareType':value.shareType
			});
		});
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID,
			userList: dict,
			message: message
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};


	//
	// UserUnshare
	//

	/**
	This function will remove permissions to the given object for the specified user.
	
	@param {Integer} nodeID					object ID
	@param {String} userName				user login name
	
	@private
	*/
	var _UninviteUser = function(nodeID, userName){
		
		var type = 'request';
		var subtype = 'unshare';
		var requestID = type + subtype + "(" + nodeID + "," + userName + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID,
			userList: [userName]
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};


	/**
	This function will unshare an object for a given user.

	@param {Integer} nodeID					object ID				
	@param {String} userName				user login name				

	@public
	*/
	this.UserUnshare = function(nodeID, userName){
		
		return $.when(_UninviteUser(nodeID, userName)).pipe(request.ValidateResponse).done(function(resultData){
			
			// Clear all sharing info from the cache.
			// Currently we don't have a way to remove a specific key and it will keep the cache small.
			queue.ClearCache("requestgetsharesforobject");
			
			Share.UserUnshareResponse(userName);
		});
	};


	/**
	This function will process the response from a successful UserUnshare request.

	@param {String} userName				user login name

	@public
	*/
	this.UserUnshareResponse = function(userName) {
		
		// update local collaborators List
		var userID
		$(Collaborators.collaboratorsList).each( function(index, value){
			if(value.Name === userName){
				userID = value.UserID
			}
		});
		Collaborators.removeCollaboratorFromList(userID);
		Collaborators.DrawCollaboratorsArea();

	};
	
	
	//
	// UnshareObject
	//
	
	/**
	This function will remove all of the shares for the given object.
	
	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _UnshareObject = function(nodeID){
		
		var type = 'request';
		var subtype = 'unshareall';
		var requestID = type + subtype + "(" + nodeID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
	
	
	/**
	This function will unshare an object.

	@param {Integer} nodeID					object ID				

	@public
	*/
	this.UnshareObject = function(nodeID){
		
		return $.when(_UnshareObject(nodeID)).pipe(request.ValidateResponse).done(function(resultData){
			
			// Clear all sharing info from the cache.
			// Currently we don't have a way to remove a specific key and it will keep the cache small.
			queue.ClearCache("requestgetsharesforobject");
			
			Share.UnshareObjectResponse(nodeID,resultData);
		});
	};
	

	/**
	This function will process the response from a successful UnshareObject request.

	@public
	*/
	this.UnshareObjectResponse = function(nodeID,resultData) {

		
	};
	
	var _RemoveSharingRequest = function(nodeID) {
		var index = null;
		var i = 0;
		for (i = 0; i < Share.sharingRequests.length; i++) {
			if (Share.sharingRequests[i].DataID == nodeID) {
				index = i;
				break;
			}
		}
		
		if (index != null) {
			Share.sharingRequests.splice(index, 1);
		}		
	}

});
	
