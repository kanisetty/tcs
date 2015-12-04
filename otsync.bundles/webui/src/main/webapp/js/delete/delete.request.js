$.extend(Delete, new function(){
    var response = new function(){
        /**
        This function will process the response from a successful Delete Object request.
    
        @param {Integer} nodeID					object ID
        @param {Object} data					data from the ajax response
        @param {Object} callbackData			data from the UI
    
        @public
        */
        this.DeleteObject = function(nodeID, data, callbackData){
            if(!$.isEmptyObject(data))
            {
                var subType = T('LABEL.File');
                if(callbackData.SUBTYPE === CONST_SUBTYPE.FOLDER)
                {
                    subType = T('LABEL.Folder');
                }
                ui.MessageController.ShowMessage(T('LABEL.ObjectDeleteConfirmation', {subType: subType, name: callbackData.NAME}));
                ui.RemoveItemRow($('#browseFile-'+nodeID));
            }

            ui.ToggleProcessingIndicatorForItemRow(nodeID);
        };
    
    
        /**
        This function will process the response from a successful DeleteObject request.
    
        @param {Array} nodeIDs					array of object ID's that were passed in the request
        @param {Array} data						array of results of all data, in the same order as nodeIDs
        */
        this.DeleteObjects = function(nodeIDs, data){
            if(data.length > 0)
            {
                var successCount = 0;
                $.each(data, function(index, value){
                    if(value.ok===true)
                    {
                        ui.RemoveItemRow($('#browseFile-'+nodeIDs[index]));
                        successCount++;
                    }
    
                });
                if(successCount>0)
                {
                    ui.MessageController.ShowMessage(T('LABEL.MultiDeleteConfirmation', {count: successCount}));
                }
    
            }
            ui.ToggleProcessingIndicatorForItemRow(nodeIDs);
        };
    };
    /**
	This function will delete an item with the specified ID.
	
	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _DeleteObject = function(nodeID){
		
		var type = 'request';
		var subtype = 'delete';
		var requestID = type + subtype + "(" + nodeID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID
		};
		
		// for admin mode, include the id of the user on whose behalf we're acting; the api will unshare or delete depending on whether the user is the owner
		if(info.isAdminModeRequested){
			requestData.info.shareAsUserID = info.shareAsUserID;
		}
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};


	/**
	This function will delete a series of objects.
	
	@param {Array} nodeIDs					array of object ID's
	
	@private
	*/
	var _DeleteObjects = function(nodeIDs){
		
		var type = 'request';
		var subtype = 'multi';
		var requestID = type + subtype + "delete(" + nodeIDs + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = [];
		
		$.each(nodeIDs, function(index, value){
			var info = {
				subtype: 'delete',
				nodeID: value
			};
			
			requestData.info.push(info);
		});
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
    
    /**
	This function will delete an item with the specified ID.
	
	@param {Integer} nodeID					object ID
	@param {Object} callbackData			data from the UI to be retured back to the UI
	
	@public
	*/
	this.DeleteObject = function(nodeID, callbackData){
		
		return $.when(_DeleteObject(nodeID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			
			// Clear all breadcrumbs from the cache, since we don't know what impact the delete had.
			queue.ClearCache("requestgetlocationpath");
			
			// Clear all browse breadcrumbs from the cache, this will keep the cache size small.
			queue.ClearCache("requestgetfoldercontents");
			
			response.DeleteObject(nodeID, resultData, callbackData);
		})
		.fail(function(){
			response.DeleteObject(nodeID, {}, callbackData);
		});
	};


	/**
	This function will delete a series of objects.
	
	@param {Array} nodeIDs					array of object ID's

	@public
	*/
	this.DeleteObjects = function(nodeIDs){
		
		return $.when(_DeleteObjects(nodeIDs)).pipe(request.ValidateResponse)
		.done(function(resultData){
			
			// Clear all breadcrumbs from the cache, since we don't know what impact the delete had.
			queue.ClearCache("requestgetlocationpath");
			
			// Clear all browse breadcrumbs from the cache, this will keep the cache size small.
			queue.ClearCache("requestgetfoldercontents");
			
			response.DeleteObjects(nodeIDs, resultData);
		})
		.fail(function(){
			response.DeleteObjects(nodeIDs, []);
		});
	};
});