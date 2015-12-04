$.extend(Copy, new function(){
    
    var response = new function(){
        /**
        This function will process the response from a successful CopyObject request.
    
        @param {Integer} sourceID				node ID of the source object
        @param {Object} data
        @paramFeature {Integer} id				object node ID
        @paramFeature {Integer} parentID		object parent ID
        @paramFeature {String} name				object name
        @paramFeature {String} createDate		object create date
        @paramFeature {String} modifyDate		object modify date
        @paramFeature {Integer} createdBy		user ID
        @paramFeature {String} type				object type (Document, Folder)
        @paramFeature {String] dataSize			object size (Document only)
        @param {Object} callbackData			data from the UI
    
        @public
        */
        this.CopyObject = function(sourceID, data, callbackData){
            if(data.id)
            {
                var name = callbackData.NAME;
                var subType = "file";
                if(callbackData.SUBTYPE === CONST_SUBTYPE.FOLDER)
                {
                    subType = "folder";
                }
                ui.MessageController.ShowMessage(T('LABEL.ObjectCopyConfirmation', {subType: subType, name: name}));
            }
    
            ui.ToggleProcessingIndicatorForItemRow(sourceID);
    
        };
    
    
        /**
        This function will process the response from a successful CopyObject request.
    
        @param {Array} sourceIDs				node IDs of the source objects
        @param {Array} data						array of results of all data, in the same order as nodeIDs
    
        @public
        */
        this.CopyObjects = function(sourceIDs, data){
            if(data.length > 0)
            {
                var successCount = 0;
                $.each(data, function(index, value){
                    if(value.ok === true)
                    {
                        successCount++;
                    }
                });
                if(successCount > 0)
                {
                    ui.MessageController.ShowMessage(T('LABEL.MultiCopyConfirmation', {count: successCount}));
                }
            }
            ui.ToggleProcessingIndicatorForItemRow(sourceIDs);
        };
    
    
        /**
        This function will process the response from a successful CopyVersion request.
    
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
        @param {Object} callbackData				data from the UI
    
        @public
        */
        this.CopyVersion = function(sourceID, data, callbackData){
            if(!$.isEmptyObject(data))
            {
                var name = callbackData.NAME;
                var subType = T('LABEL.File');
                if(callbackData.SUBTYPE === CONST_SUBTYPE.FOLDER)
                {
                    subType = T('LABEL.Folder');
                }
                ui.MessageController.ShowMessage(T('LABEL.ObjectCopyVersionConfirmation', {subType: subType, name: name}));
            }
            ui.ToggleProcessingIndicatorForItemRow(sourceID);
        };
    };
    /**
	This function will copy the given object to the specified location.

	@param {Integer} nodeID					object ID
	@param {Integer} parentID				destination object ID
	
	@private
	*/
	var _CopyObject = function(nodeID, parentID){
		
		var type = 'request';
		var subtype = 'copy';
		var requestID = type + subtype + "(" + nodeID + "," + parentID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID,
			parentID: parentID
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
    
    /**
	This function will copy a series of objects to the specified location.

	@param {Array} nodeIDs					object IDs
	@param {Integer} parentID				destination object ID

	@private
	*/
	var _CopyObjects = function(nodeIDs, parentID){
		
		var type = 'request';
		var subtype = 'multi';
		var requestID = type + subtype + "copy(" + nodeIDs + "," + parentID + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = [];
		
		$.each(nodeIDs, function(index, value){
			var info = {
				subtype: 'copy',
				parentID: parentID,
				nodeID: value
			};
			
			requestData.info.push(info);
		});
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
    
    /**
	This function will copy a given version of a document to a destination document.
	
	@param {Integer} nodeID					object ID
	@param {Integer} nodeVersionNumber		object version number
	@param {Integer} parentID				destination object ID
	
	@private
	*/
	var _CopyVersion = function(nodeID, nodeVersionNumber, parentID){

		var type = 'request';
		var subtype = 'pubtofilecopy';
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
	This function will copy the given object to the specified location.

	@param {Integer} nodeID					object ID
	@param {Integer} parentID				destination object ID
	@param {Object} callbackData			data from the UI to be retured back to the UI
	
	@public
	*/
	this.CopyObject = function(nodeID, parentID, callbackData){
		
		return $.when(_CopyObject(nodeID, parentID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			
			// Clear all browse breadcrumbs from the cache, this will keep the cache size small.
			queue.ClearCache("requestgetfoldercontents");
			
			response.CopyObject(nodeID, resultData, callbackData);
		})
		.fail(function(){
			response.CopyObject(nodeID, {}, callbackData);
		});
	};


	/**
	This function will copy the given objects to the specified location.

	@param {Array} nodeIDs					object IDs
	@param {Integer} parentID				destination object ID
	
	@public
	*/
	this.CopyObjects = function(nodeIDs, parentID){
		
		return $.when(_CopyObjects(nodeIDs, parentID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			
			// Clear all browse breadcrumbs from the cache, this will keep the cache size small.
			queue.ClearCache("requestgetfoldercontents");
			
			response.CopyObjects(nodeIDs, resultData);
		})
		.fail(function(){
			response.CopyObjects(nodeIDs, []);
		});
	};

	
	/**
	This function will copy a given version of a document to a destination document.
	
	@param {Integer} nodeID					object ID
	@param {Integer} nodeVersionNumber		object version number
	@param {Integer} parentID				destination object ID
	@param {Object} callbackData			data from the UI to be retured back to the UI
	
	@public
	*/
	this.CopyVersion = function(nodeID, nodeVersionNumber, parentID, callbackData){
		
		return $.when(_CopyVersion(nodeID, nodeVersionNumber, parentID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			response.CopyVersion(nodeID, resultData, callbackData);
		})
		.fail(function(){
			response.CopyVersion(nodeID, {}, callbackData);
		});
	};
});