$.extend(Search, new function(){
    var response = new function(){
        /**
        This function will process the response from a successful SearchObject request.
    
        @param {Array} data
        @paramFeature {Integer} dataID			object ID
        @paramFeature {String} mimeType			object mime type (document only, empty string otherwise)
        @paramFeature {String} modifyDate		object modify date
        @paramFeature {String} name				object name
        @paramFeature {Integer} parentID		object parent ID
        @paramFeature {Integer} permissions		object permission mask
        @paramFeature {String} size				object size (file size for document, child count for folder)
        @paramFeature {Integer} subtype			object subtype
        @paramFeature {Boolean} sharedFolder	true if folder is a root share
		@paramFeature {Integer} IsReadOnly		1 if is a readonly share to user, 0 if read-write
        @param {Integer} count					number of search results
        @param {Integer} pageNumber				current page number
    
        @public
        */
        this.SearchObject = function(data, count, pageNumber){
            $('#updatingImage').data('PageRequested',false);
            $('#updatingImage').hide();
			$('#searchResult').show();
			$('#returnToAllFiles').show();
    
            if (data.length > 0) {
                if(pageNumber === 1)
                {
                    var templateVar = {
                        countString: T('LABEL.SearchResultsFor', {count: count}),
                        termString: Search.SearchTerm
                    };
                    ui.LoadTemplateInEmptyElement("#searchInfo_tmpl", templateVar , '#pageActions');
                    ui.LoadTemplateInEmptyElement("#searchItem_tmpl", data, '#itemsForSearchTab');
                }
                else{
                    ui.LoadTemplate("#searchItem_tmpl", data, '#itemsForSearchTab');
                }
    
                /*
                 If there is no scroll bar and items on current page are less then the total items then try to get more items
                */
                if($(document).height() === $(window).height() && data.length < count)
                {
                    $('#updatingImage').data('PageRequested', true);
    
                    var searchQuery =  {queryString: decodeURIComponent($.address.parameter('query'))};
    
                    var nodeIDToSearch = parseInt($.address.parameter('nodeIDToSearch'), 10);
                    nodeIDToSearch = nodeIDToSearch? nodeIDToSearch: info.userRootFolderID;
    
                    Search.SearchObjectMore(searchQuery.queryString, nodeIDToSearch, SortController.GetSearchSortBy(), SortController.GetSearchSortOrder());
                }
            }
            else{
                if(pageNumber === 1){
                    var templateVar = {
                        countString: T('LABEL.SearchResultsFor', {count: count}),
                        termString: Search.SearchTerm
                    };
                    ui.LoadTemplateInEmptyElement("#searchInfo_tmpl", templateVar , '#pageActions');
                }
            }
        };
    };
    
    /**
	This function contains common code for _SearchObject and _SearchObjectMore.

	@param {String} query					search query
	@param {Integer} nodeID					ID of the container to search in (optional)
	@param {Integer} pageNumber				page number to retrieve
	@param {Integer} sortBy                 sort by field (name, lastmodified, size)
	@param {Integer} sortOrder              sort order
	
	@private
	*/
	var __SearchObject = function(query, nodeID, sortBy, sortOrder, pageNumber){
		
        var sortFields;
        var isAscending = true;
        switch(sortBy)
        {
            case CONST_SORT.DATE:
                sortFields = 'date';
                break;
            case CONST_SORT.SIZE:
                sortFields = 'size';
                break;
            default:
                sortBy = CONST_SORT.NAME;
                sortFields = 'name';
        }
        
        switch(sortOrder)
        {
            case CONST_SORT_ORDER.ASC:
                isAscending = true;
                break;
            case CONST_SORT_ORDER.DESC:
                isAscending = false;
                break;
            default:
                isAscending = true;
        }
        
        
		var requestData = new request.ObjectRequestGet('request', 'search');
		
		requestData.info = {
			query: query,
			pageNumber: pageNumber,
			pageSize: pagination.GetPageSize(),
            sort: sortFields,
            asc: isAscending
		};
		
		nodeID = utils.DefaultValue(nodeID, null);
		
		if (nodeID!==null){
			requestData.info["searchLocation"] = nodeID;
		}
		
		return requestData;
	};
    
    /**
	This function will search for objects that match the query (page 1).

	@param {String} query					search query
	@param {Integer} nodeID					ID of the container to search in (optional)
	@param {Integer} sortBy                 sort by field (name, lastmodified, size)
	@param {Integer} sortOrder              sort order

	@private
	*/
	var _SearchObject = function(query, nodeID, sortBy, sortOrder){
		
		var pageNumber = 1;
		var requestName = "requestsearch";
		
		// We're doing a new search, remove any pending requests from the queue.
		queue.RemoveGet(requestName);
        
        sortBy = utils.DefaultValue(sortBy, SortController.GetSearchSortBy);
        SortController.SetSearchSortBy(sortBy);
        
        sortOrder = utils.DefaultValue(sortOrder, SortController.GetSearchSortOrder);
        SortController.SetSearchSortOrder(sortOrder);
		
		pagination.ResetPage();
		
		var requestData = __SearchObject(query, nodeID, sortBy, sortOrder, pageNumber);
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		var requestID = requestName + "()";
		
		return queue.AddGet(requestID, ajaxData);
	};
    
    /**
	This function will search for objects that match the query (next page).

	@param {String} query					search query
	@param {Integer} nodeID					ID of the container to search in (optional)
	@param {Integer} sortBy                 sort by field (name, lastmodified, size)
	@param {Integer} sortOrder              sort order

	@private
	*/
	var _SearchObjectMore = function(query, nodeID, sortBy, sortOrder){
	
		if (pagination.IsDone() || pagination.IsBusy()){
			return null;
		}else{
			
			var pageNumber = pagination.IncrementPageNumber();
			
			var requestData = __SearchObject(query, nodeID, pageNumber);
			
			var ajaxData = new request.ObjectFrontChannel(requestData);
			
			var requestID = "requestsearch()";
			
			return queue.AddGet(requestID, ajaxData);
		}
	};
    
    
    /**
	This function will search for objects that match the query (page 1).

	@param {String} query					search query
	@param {Integer} nodeID					ID of the container to search in (optional)
	@param {Integer} sortBy                 sort by field (name, lastmodified, size)
	@param {Integer} sortOrder              sort order
	
	@public
	*/
	this.SearchObject = function(query, nodeID, sortBy, sortOrder){
		
		// _SearchObject returns more than just the child data:
		// resultCount {Integer}			the number of records returned
		// resultPageSize {Integer}
		// resultList {Array}				the search results
		
		return $.when(_SearchObject(query,nodeID, sortBy, sortOrder)).pipe(request.ValidateResponse)
		.done(function(resultData){
			pagination.ResetRequest();
			resultData.resultList = pagination.Filter(resultData.resultList, "dataID");
			response.SearchObject(resultData.resultList, resultData.resultCount, pagination.GetPageNumber());
		})
		.fail(function(){
			pagination.ResetRequest();
			response.SearchObject([], 0, pagination.GetPageNumber());
		});
	};
    
    /**
	This function will search for objects that match the query (next page).

	@param {String} query					search query
	@param {Integer} nodeID					ID of the container to search in (optional)
	@param {Integer} sortBy                 sort by field (name, lastmodified, size)
	@param {Integer} sortOrder              sort order
	
	@public
	*/
	this.SearchObjectMore = function(query, nodeID, sortBy, sortOrder){
		
		// _SearchObject returns more than just the child data:
		// resultCount {Integer}			the number of records returned
		// resultPageSize {Integer}
		// resultList {Array}				the search results
		
		return $.when(_SearchObjectMore(query,nodeID, sortBy, sortOrder)).pipe(request.ValidateResponse)
		.done(function(resultData){
			pagination.ResetRequest();
			resultData.resultList = pagination.Filter(resultData.resultList, "dataID");
			response.SearchObject(resultData.resultList, resultData.resultCount, pagination.GetPageNumber());
		})
		.fail(function(){
			pagination.ResetRequest();
			response.SearchObject([], -1, pagination.GetPageNumber());
		});
	};
});
