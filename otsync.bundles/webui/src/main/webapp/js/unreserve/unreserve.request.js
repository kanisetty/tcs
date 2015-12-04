$.extend(Unreserve, new function(){
    var response = new function(){
		/**
		This function will process the response from a successful Unreserve Object request.

		@param {Integer} nodeID					object ID
		@param {Object} data					data from the ajax response
		@param {Object} callbackData			data from the UI

		@public
		*/
		this.UnreserveObject = function(nodeID, data, callbackData){
			//reload the content area
			Browse.BrowseObject(ui.GetCurrentNodeID());

			if (data.length > 0){
				//display confirmation message
				var subType = T('LABEL.File');
				ui.MessageController.ShowMessage(T('LABEL.ObjectUnreserveConfirmation', {subType: subType, name: callbackData.NAME}));
			}
			
            ui.ToggleProcessingIndicatorForItemRow(nodeID);

		};
	};
		
	/**
	This function will unreserve an item with the specified ID.
	
	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _UnreserveObject = function(nodeID){
		
		var type = 'request';
		var subtype = 'unreserve';
		var requestID = type + subtype + "(" + nodeID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};

	/**
	This function will unreserve an item with the specified ID.
	
	@param {Integer} nodeID					object ID
	@param {Object} callbackData			data from the UI to be retured back to the UI
	
	@public
	*/
	this.UnreserveObject = function(nodeID, callbackData){
		
		return $.when(_UnreserveObject(nodeID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			
			response.UnreserveObject(nodeID, resultData, callbackData);
		})
		.fail(function(){
			response.UnreserveObject(nodeID, {}, callbackData);
		});
	};

});