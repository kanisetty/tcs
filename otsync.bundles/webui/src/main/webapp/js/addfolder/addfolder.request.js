$.extend(AddFolderController, new function(){
    
    
    var response = new function(){
        /**
        This function will process the response from a successful CreateFolder request.
    
        @param {Object} data
        @paramFeature {String} createDate		object create date
        @paramFeature {Integer} createdBy		user ID who created the folder
        @paramFeature {Integer} id				object node ID
        @paramFeature {String} modifyDate		object modified date
        @paramFeature {String} name				object name
        @paramFeature {Integer} parentID		object parent ID
        @paramFeature {String} type				object type (eg. "Folder")
    
        @public
        */
        this.CreateFolder = function (data) {
            //reload the content area
            Browse.BrowseObject(ui.GetCurrentNodeID());
            //show the confirmation message
            ui.MessageController.ShowMessage(T('LABEL.ConfirmCreateFolder', {name: data.name}));
        };
    };
    /**
	This function will create a Folder in the specified container.

	@param {Integer} nodeID					object ID
	@param {String} folderName				object name
	
	@private
	*/
	var _CreateFolder = function(nodeID, folderName){
		
		var type = 'request';
		var subtype = 'createfolder';
		var requestID = type + subtype + "(" + nodeID + "," + folderName + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			parentID: nodeID,
			name: folderName
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
    
    /**
	This function will create a new Folder in the specified container.

	@param {Integer} nodeID					object ID
	@param {String} folderName				object name

	@public
	*/
	this.CreateFolder = function(nodeID, folderName){
		
		return $.when(_CreateFolder(nodeID, folderName)).pipe(request.ValidateResponse).done(function(resultData){
			
			// Clear all browse breadcrumbs from the cache, this will keep the cache size small.
			queue.ClearCache("requestgetfoldercontents");
			
			response.CreateFolder(resultData);
		});
	};

});