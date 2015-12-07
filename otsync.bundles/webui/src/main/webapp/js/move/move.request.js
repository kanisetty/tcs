$.extend(Move, new function(){
    
    var response = new function(){
        /**
        This function will process the response from a successful MoveObject request.
    
        @param {Integer} nodeID					object ID
        @param {Object} data					data from the ajax response
        @param {Object} callbackData			data from the UI
    
        @public
        */
        this.MoveObject = function(nodeID, data, callbackData){
            if(!$.isEmptyObject(data))
            {
                var name = callbackData.NAME;
                var subType = T('LABEL.File');
                if(callbackData.SUBTYPE === CONST_SUBTYPE.FOLDER)
                {
                    subType = T('LABEL.Folder');
                }
                ui.RemoveItemRow($('#browseFile-'+nodeID));
                ui.MessageController.ShowMessage(T('LABEL.ObjectMoveConfirmation', {subType: subType, name: name}));
            }
    
            ui.ToggleProcessingIndicatorForItemRow(nodeID);
        };
    
    
        /**
        This function will process the response from a successful MoveObjects request.
    
        @param {Array} nodeIDs					array of object ID's that were passed in the request
        @param {Array} data						array of results of all data, in the same order as nodeIDs
    
        @public
        */
        this.MoveObjects = function(nodeIDs, data){
            if(data.length > 0)
            {
                var successCount = 0;
                $.each(data, function(index, value){
                    if(value.ok === true)
                    {
                        ui.RemoveItemRow($('#browseFile-'+nodeIDs[index]));
                        successCount++;
                    }
    
                });
                if(successCount > 0)
                {
                    ui.MessageController.ShowMessage(T('LABEL.MultiMoveConfirmation', {count: successCount}));
                }
            }
            ui.ToggleProcessingIndicatorForItemRow(nodeIDs);
        };
    
    
        /**
        This function will process the response from a successful MoveVersion request.
    
        @param {Integer} sourceID					object ID
        @param {Object} data
        @paramFeature {Integer} dataSize			object size
        @paramFeature {Integer} id					object ID
        @paramFeature {String} modifyDate			object modify date
        @paramFeature {String} name					object name
        @paramFeature {String} type					object type
        @paramFeature {Integer} versId				version ID
        @paramFeature {Integer} versNumber			version number
        @paramFeature {String} versionCreateDate	object create date
        @param {Object} callbackData				data from the UI to be retured back to the UI
    
        @public
        */
        this.MoveVersion = function(sourceID, data, callbackData){
            if(!$.isEmptyObject(data))
            {
                var name = callbackData.NAME;
                var subType = T('LABEL.File');
                if(callbackData.SUBTYPE === CONST_SUBTYPE.FOLDER)
                {
                    subType = T('LABEL.Folder');
                }
                ui.MessageController.ShowMessage(T('LABEL.ObjectMoveVersionConfirmation', {subType: subType, name: name}));
                ui.RemoveItemRow($('#browseFile-'+sourceID));
            }
            ui.ToggleProcessingIndicatorForItemRow(sourceID);
        };
    };
    
    /**
	This function will move the given object to the specified location.

	@param {Integer} nodeID					object ID
	@param {Integer} parentID				destination object ID
	
	@private
	*/
	var _MoveObject = function(nodeID, parentID){
		
		var type = 'request';
		var subtype = 'move';
		var requestID = type + subtype + "(" + nodeID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		//NOTE: tempory to convert integer to string, should remove this piece of code after the api bug is fixed
		if(typeof nodeID === 'number')
		{
			nodeID = '' + nodeID;
		}
		if(typeof parentID === 'number')
		{
			parentID = '' + parentID;
		}
		
		requestData.info = {
			nodeID: nodeID,
			parentID: parentID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};


	/**
	This function will move a series of objects to the specified location.
	
	@param {Array} nodeIDs					array of object ID's
	@param {Integer} parentID				destination object ID
	
	@private
	*/
	var _MoveObjects = function(nodeIDs, parentID){
		
		var type = 'request';
		var subtype = 'multi';
		var requestID = type + subtype + "move(" + nodeIDs + "," + parentID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = [];
		
		//NOTE: tempory to convert integer to string, should remove this piece of code after the api bug is fixed
		if(typeof parentID === 'number')
		{
			parentID = '' + parentID;
		}
		
		$.each(nodeIDs, function(index, value){
			
			//NOTE: tempory to convert integer to string, should remove this piece of code after the api bug is fixed
			if(typeof value === 'number')
			{
				value = '' + value;
			}
			
			var info = {
				subtype: 'move',
				parentID: parentID,
				nodeID: value
			};
			
			requestData.info.push(info);
		});
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
	

	/**
	This function will move a given version of a document to a destination document.
	
	@param {Integer} nodeID					object ID
	@param {Integer} nodeVersionNumber		object version number
	@param {Integer} parentID				destination object ID
	
	@private
	*/
	var _MoveVersion = function(nodeID, nodeVersionNumber, parentID){

		var type = 'request';
		var subtype = 'pubtofilemove';
		var requestID = type + subtype + "(" + nodeID + "," + nodeVersionNumber + "," + parentID + ")";
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID,
			version: nodeVersionNumber,
			target: parentID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
    
    /**
	This function will move the given object to the specified location.

	@param {Integer} nodeID					object ID
	@param {Integer} parentID				destination object ID
	@param {Object} callbackData			data from the UI to be retured back to the UI
	
	@public
	*/
	this.MoveObject = function(nodeID, parentID, callbackData){
		
		return $.when(_MoveObject(nodeID, parentID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			
			// Clear all breadcrumbs from the cache, since we don't know what impact the move had.
			queue.ClearCache("requestgetlocationpath");
			
			// Clear all browse breadcrumbs from the cache, this will keep the cache size small.
			queue.ClearCache("requestgetfoldercontents");
			
			response.MoveObject(nodeID, resultData, callbackData);
		})
		.fail(function(){
			response.MoveObject(nodeID, {}, callbackData);
		});
	};


	/**
	This function will move a series of objects to the specified location.
	
	@param {Array} nodeIDs					array of object ID's
	@param {Integer} parentID				destination object ID
	
	@public
	*/
	this.MoveObjects = function(nodeIDs, parentID){
		
		return $.when(_MoveObjects(nodeIDs, parentID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			
			// Clear all breadcrumbs from the cache, since we don't know what impact the move had.
			queue.ClearCache("requestgetlocationpath");
			
			// Clear all browse breadcrumbs from the cache, this will keep the cache size small.
			queue.ClearCache("requestgetfoldercontents");
			
			response.MoveObjects(nodeIDs, resultData);
		})
		.fail(function(){
			response.MoveObjects(nodeIDs, []);
		});
	};
	

	/**
	This function will move a given version of a document to a destination document.
	
	@param {Integer} nodeID					object ID
	@param {Integer} nodeVersionNumber		object version number
	@param {Integer} parentID				destination object ID
	@param {Object} callbackData			data from the UI to be retured back to the UI
	
	@public
	*/
	this.MoveVersion = function(nodeID, nodeVersionNumber, parentID, callbackData){
		
		return $.when(_MoveVersion(nodeID, nodeVersionNumber, parentID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			
			// Clear all breadcrumbs from the cache, since we don't know what impact the move had.
			queue.ClearCache("requestgetlocationpath");
			
			// Clear all browse breadcrumbs from the cache, this will keep the cache size small.
			queue.ClearCache("requestgetfoldercontents");
			
			response.MoveVersion(nodeID, resultData, callbackData);
		})
		.fail(function(){
			response.MoveVersion(nodeID, {}, callbackData);
		});
	};
});
