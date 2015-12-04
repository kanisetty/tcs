/**
 * Extend the Browse Object with functions that request data from the server
 *
 * private methods:
 * __BrowseObject
 * _BrowseObject
 * _BrowseObjectMore
 * _GetObjectInfo
 * _GetObjectPath
 *
 * public methods:
 * BrowseObject
 * BrowseObjectMore
 * GetObjectInfo
 * GetObjectPath
 *
 *
 * private variable:
 * response
 *
 **/ 

$.extend(Browse, new function(){
    
	/**
	 * This inner object processes the response from the server
	 *
	 * public methods
	 * BrowseObject
	 * GetObjectPath
	 * GetObjectInfo
	 **/
	var response = new function(){
			
		/**
		This function will process the response from a successful BrowseObject request.

		@param {Array} data
		@paramFeature {Integer} DATAID			object node ID
		@paramFeature {Integer} PARENTID		object parent ID
		@paramFeature {String} NAME				object name
		@paramFeature {Integer} SUBTYPE			object sub-type
		@paramFeature {String} MIMETYPE			object mime-type
		@paramFeature {String} MODIFYDATE		object modified date
		@paramFeature {Integer} CHILDCOUNT		container size (if applicable)
		@paramFeature {Integer} DATASIZE		document size (if applicable)
		@paramFeature {Boolean} ISSHARED		true if the object is shared, either directly or by inheritance
		@paramFeature {Integer} SHAREDFOLDER	shared status of a folder (0=not shared, 1=shared & owner, 2=shared)
		@paramFeature {Boolean} ISCOPYABLE		true if the object can be copied
		@param {Integer} totalCount				total number of objects in the container
		@param {Integer} pageNumber				current page number

		@public
		*/
		this.BrowseObject = function(data, totalCount, pageNumber, childNodes){
			Browse.DisplayNodes(data, totalCount, pageNumber);
			SelectionController.SetChildNodes(childNodes);
			ui.ResetPageHeight();
			$("a.gallery").colorbox(
					{
						photo: true, 
						maxWidth: '90%', 
						maxHeight: '90%', 
						onComplete: function() {
							$("#colorbox").css('top', (($(window).height() - $("#cboxContent").height()) / 2) + $(document).scrollTop() + 'px');
							$("#colorbox").css('left', (($(window).width() - $("#cboxContent").width()) / 2) + 'px');
							
							if ($(".cboxPhoto").height() < 300) {
								$(".cboxPhoto").css('margin', ((300 - $(".cboxPhoto").height()) / 2) + 'px auto');
							}
						},
						title: function() {
							return '<a href="' + ui.FormatDownloadFileURL($(this).attr('nodeid')) + '" title="' + T('LABEL.Download') + ' ' + this.title + '">' + utils.TrimLongString(this.title, 26) + '</a>';
						},
						current: "{current} / {total}&nbsp;",
						previous: '<span class="cbox-action">' + T('LABEL.Previous').toLowerCase() + '</span>&nbsp;',
						next: '<span class="cbox-action">' + T('LABEL.Next').toLowerCase() + '</span>&nbsp;',
						close: '<span class="cbox-action">' + T('LABEL.Close').toLowerCase() + '</span>&nbsp;',
						imgError: T('LABEL.TheImageFailedToLoad'),
						initialWidth: 500,
						initialHeight: 300
					}
			);
		};
		
		/**
		This function will process the response from a successful GetObjectPath request.

		@param {Array} data
		@paramFeature {Integer} nodeID			object ID
		@paramFeature {String} name				object name
		@paramFeature {Integer} subType			object subtype

		@public
		*/
		this.GetObjectPath = function(data){
		
				Browse.setBackupALevelNav(data);	
				ui.SetBreadcrumb(data);
		};
		
		/**
		This function will process the response from a successful GetObjectInfo request.

		@param {Object} data
		@paramFeature {Integer} DATAID			object ID
		@paramFeature {String} NAME				object name
		@paramFeature {Integer} SUBTYPE			object subtype
		@paramFeature {Boolean} ISSHARED		true if the object is shared, either directly or by inheritance

		@public
		*/
		this.GetObjectInfo = function(data){

			Browse.DisplayFolderInfo(data);
			ui.LoadFileTopButtons();
			Browse.ReadOnlyUIUpdate(data);

			if(data.ISREADONLY){

				FileUploadController.UnRegisterFileUpload();
			}
			else{
				//initialize the uploadfile controller
				FileUploadController.GetUploadNewFileController();
				var options = {
				upload: 'AddVersion',
				fileInputID: 'addNewVersionInput',
				triggerElementSelector: '.objectAddVersion'};
				FileUploadController.GetAddNewVersionController(options);
				// adds back drop zone if it was removed for read only
				FileUploadController.AddDropZone();
			}
										
		};
	};

	/**
	This function contains common code for _BrowseObject and _BrowseObjectMore.
	
	@param {Integer} nodeID					object ID
	@param {Integer} sortBy					sorting by constant (CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE)
	@param {Integer} sortOrder				sorting order constant (CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC)
	@param {Integer} pageNumber				page number to retrieve

	@private
	*/
	var __BrowseObject = function(nodeID, sortBy, sortOrder, pageNumber){
		
		var sortFields;
		var isDescending = false;
		
		switch(sortBy){
			case CONST_SORT.DATE:
				sortFields = 'DISPLAYMODIFYDATE';
				break;
			case CONST_SORT.SIZE:
				sortFields = 'SUBTYPE,DATASIZE,CHILDCOUNT';
				break;
			default:
				sortBy = CONST_SORT.NAME;
				sortFields = 'NAME';
		}
		
		switch(sortOrder){
			case CONST_SORT_ORDER.ASC:
				isDescending = false;
				break;
			case CONST_SORT_ORDER.DESC:
				isDescending = true;
				break;
			default:
				isDescending = false;
		}
		
		var requestData = new request.ObjectRequestGet('request', 'getfoldercontents');
		
		requestData.info = {
			containerID: nodeID,
			sort: sortFields,
			page: pageNumber,
			pageSize: pagination.GetPageSize(),
			desc: isDescending,
			fields: ['DATAID', 'PARENTID', 'NAME', 'SUBTYPE', 'MIMETYPE', 'CHILDCOUNT', 
			'DATASIZE', 'MODIFYDATE','ISSHARED', 'MODIFYUSERNAME', 'SHAREDFOLDER', 'ISSHAREABLE',
			 'ISROOTSHARE', 'ISREADONLY', 'ISSUBSCRIBED','ISCOPYABLE', 'ISDELETABLE','DISPLAYMODIFYDATE',
			 'SHARECLASS','ISRESERVABLE','RESERVEDBYUSERNAME','ISHIDDEN','HASTASKS','ISBRAVA','HASBRAVAMARKUP']
		};
		
		return requestData;
	};
	

	/**
	This function will return the contents of the given container for the first page.
	
	@param {Integer} nodeID					object ID
	@param {Integer} sortBy					sorting constant (CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE)
	
	@private
	*/
	var _BrowseObject = function(nodeID, sortBy, sortOrder){
		
		var requestName = "requestgetfoldercontents";
		var pageNumber = 1;
		
		// We're getting a new page, remove any other browse requests from the queue.
		queue.RemoveGet(requestName);

		//refresh multiaction buttons
		SelectionController.Reset();
		SelectionController.UpdateMultiActionMenu();
		
		sortBy = utils.DefaultValue(sortBy, SortController.GetBrowseSortBy());
		SortController.SetBrowseSortBy(sortBy);
		
		sortOrder = utils.DefaultValue(sortOrder, SortController.GetBrowseSortOrder());
		
		SortController.SetBrowseSortOrder(sortOrder);
		
		pagination.ResetPage();
		
		var requestData = __BrowseObject(nodeID, sortBy, sortOrder, pageNumber);
		
		var ajaxData = new request.ObjectFrontChannel(requestData);

        // Include page number to make the key more unique, so these requests will not be dropped due to duplication in the queue.
		var requestID = requestName + "(" + nodeID + "," + pageNumber + "," + sortBy + ")";
		
		return queue.AddGet(requestID, ajaxData);
	};


	/**
	This function will return the contents of the given container for the next page.

	@param {Integer} nodeID					object ID

	@private
	*/
	var _BrowseObjectMore = function(nodeID){
		
		if (pagination.IsDone() || pagination.IsBusy()){
			return null;
		}else{	
			
			var pageNumber = pagination.IncrementPageNumber();

            var requestData = __BrowseObject(nodeID, SortController.GetBrowseSortBy(), SortController.GetBrowseSortOrder(), pageNumber);
			
			var ajaxData = new request.ObjectFrontChannel(requestData);
			
			// Include page number to make the key more unique, so these requests will not be dropped due to duplication in the queue.
			var requestID = "requestgetfoldercontents(" + nodeID + "," + pageNumber + ")";
			
			return queue.AddGet(requestID, ajaxData);
		}
	};
    
    /**
	This function will get information for the given object.

	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _GetObjectInfo = function(nodeID){
		var type = 'request';
		var subtype = 'getobjectinfo';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";
		
		queue.RemoveGet(requestName);
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		requestData.info = {
			nodeIDs: [nodeID],
			fields: ['DATAID','NAME','SUBTYPE','CHILDCOUNT','ISSHARED','ISSHAREABLE','ISROOTSHARE','MODIFYUSERNAME','MODIFYDATE','OWNERNAME','OWNERPHOTOURL','ISREADONLY','USERID','ISNOTIFYSET','ISSUBSCRIBED','DESCRIPTION']
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddGet(requestID, ajaxData);
	};
    
    /**
	This function will get the path for the given object.
	
	@param {Integer} nodeID					object ID
	
	@private
	*/
	var _GetObjectPath = function(nodeID){
		
		var type = 'request';
		var subtype = 'getlocationpath';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";
		
		queue.RemoveGet(requestName);
		
		var requestData = new request.ObjectRequestGet(type, subtype);
		
		requestData.info = {
			nodeID: nodeID
		};
		
		// for admin mode, include the id of the user on whose behalf we're acting; the breadcrumb will not be correct otherwise
		if(info.isAdminModeRequested){
			requestData.info.shareAsUserID = info.shareAsUserID;
		}
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		// Cache successful results for 60 seconds.
		ajaxData.cacheDuration = 60000;
		
		return queue.AddGet(requestID, ajaxData);
	};
    
    /**
	This function will return the objects for a given node ID (page 1).
	
	@param {Integer} nodeID					object ID
	@param {Integer} sortBy					optional sorting constant (CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE) to change the sort by
											if this paramerter is not specified, the current sort by will be used
	@param {Integer} sortOrder				optional sorting constant (CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC) to change the sort order
											if this paramerter is not specified, the current sort order will be used
	@public
	*/
	this.BrowseObject = function(nodeID, sortBy, sortOrder){
		
		// _BrowseObject returns more than just the child data:
		// count {Integer}					the number of records returned
		// totalCount {Integer}				the total number of objects within the given container
		// pages {Integer}					the number of pages (totalCount / page size)
		// contents {Array}					the contents of the given nodeID
		
		return $.when(_BrowseObject(nodeID, sortBy, sortOrder)).pipe(request.ValidateResponse)
		.done(function(resultData){
			pagination.ResetRequest();
			resultData.contents = pagination.Filter(resultData.contents, "DATAID");
			resultData.contents = filterOutHiddenNodes(resultData.contents);
			response.BrowseObject(resultData.contents, resultData.totalCount, pagination.GetPageNumber(), resultData.childNodes);
			
			$(document).load().scrollTop(0); 
		})
		.fail(function(){
			ui.MessageController.ShowMessage(T("LABEL.NodeRedirectMessage"));
			Browse.SetCurrentFolderInfo(null);
			$.address.value(TAB.FILE+'?action=browse&id='+info.userRootFolderID+'&sortby='+SortController.GetBrowseSortBy()+'&sortorder='+SortController.GetBrowseSortOrder()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
		});
	};


	/**
	This function will return the objects for a given node ID (for the next page).
	
	@param {Integer} nodeID					object ID

	@public
	*/
	this.BrowseObjectMore = function(nodeID){
		
		// _BrowseObjectMore returns more than just the child data:
		// count {Integer}					the number of records returned
		// totalCount {Integer}				the total number of objects within the given container
		// pages {Integer}					the number of pages (totalCount / page size)
		// contents {Array}					the contents of the given nodeID
		
		return $.when(_BrowseObjectMore(nodeID)).pipe(request.ValidateResponse)
		.done(function(resultData){
			pagination.ResetRequest();
			resultData.contents = pagination.Filter(resultData.contents, "DATAID");
			resultData.contents = filterOutHiddenNodes(resultData.contents);
			response.BrowseObject(resultData.contents, pagination.GetPageNumber(), resultData.childNodes);
		})
		.fail(function(){
			pagination.ResetRequest();
			response.BrowseObject([], -1, pagination.GetPageNumber(), []);
		});
	};
    
    /**
	This function will filter out hidden nodes

	@param {Array} contents					
	
	@private
	*/
	var filterOutHiddenNodes = function(contents){
		return contents.filter(function(item){
			return !item['ISHIDDEN'];
		})
	};
    /**
	This function will get information for the given object.

	@param {Integer} nodeID					object ID
	
	@private
	*/
	this.GetObjectInfo = function(nodeID){
		
		// _GetObjectInfo returns more than just the child data:
		// count {Integer}					the number of records returned
		// contents {Array}					the contents of the given nodeID
		
		return $.when(_GetObjectInfo(nodeID)).pipe(request.ValidateResponse).done(function(resultData){
			response.GetObjectInfo(resultData.contents[0]);
		});
	};
    
    /**
	This function will get the path for the given object.
	
	@param {Integer} nodeID					object ID
	
	@private
	*/
	this.GetObjectPath = function(nodeID){
		
		return $.when(_GetObjectPath(nodeID)).pipe(request.ValidateResponse).done(function(resultData){
			response.GetObjectPath(resultData);
		});
	};
}
);
