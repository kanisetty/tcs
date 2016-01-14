$.extend(FolderDescription, new function(){

	function _updateDescription(nodeID, description){

		var type = 'request';
		var subtype = 'UpdateFolderDescription';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";

		queue.RemoveGet(requestName);

		var requestData = new request.ObjectRequestGet(type, subtype);

		requestData.info = {
			nodeID: nodeID,
			description: description
		};

		var ajaxData = new request.ObjectFrontChannel(requestData);

		return queue.AddSet(requestID, ajaxData);
	}

	this.updateDescription = function(nodeID, desc){

		return $.when(_updateDescription(nodeID, desc)).pipe(request.ValidateResponse)
		.done(function(resultData){
			ui.MessageController.ShowMessage(T('LABEL.DescriptionUpdated'));
		})
		.fail(function(){
			ui.MessageController.ShowError(T('ERROR.RequestFailed'));
		});
	};
});
