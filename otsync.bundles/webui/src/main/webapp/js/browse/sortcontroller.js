var SortController = new function(){
    
    var self = this;
    var browseSortOrder = 0;
    var browseSortBy = 0;
	
	var searchSortOrder = 0;
	var searchSortBy = 0;
    
    /**
     * This function switches the current browse sort order
     * @param {Integer}     oldSortBy       the old column
     *
     * @private
     */ 
    var switchBrowseSortOrder = function(oldSortBy){
        
        //if column is changed, set sortroder to default
        if(oldSortBy !== browseSortBy)
        {
            browseSortOrder = CONST_SORT_ORDER.ASC;
            return;
        }
        if(browseSortOrder === CONST_SORT_ORDER.ASC)
        {
            browseSortOrder = CONST_SORT_ORDER.DESC;
        }else
        {
            browseSortOrder = CONST_SORT_ORDER.ASC;
        }
    }
	
	/**
     * This function switches the current search sort order
     * @param {Integer}     oldSortBy       the old column
     *
     * @private
     */ 
    var switchSearchSortOrder = function(oldSortBy){
        
        //if column is changed, set sortroder to default
        if(oldSortBy !== searchSortBy)
        {
            searchSortOrder = CONST_SORT_ORDER.ASC;
            return;
        }
        if(searchSortOrder === CONST_SORT_ORDER.ASC)
        {
            searchSortOrder = CONST_SORT_ORDER.DESC;
        }else
        {
            searchSortOrder = CONST_SORT_ORDER.ASC;
        }
    }
    
    /**
     * This function updates the sort arrow
     *
     * @private
     */ 
    var updateSortArrow = function(el){
        $('.columnSortArrow').empty();
        var imgURL = info.repo + '/img/header_sort';
		var currentSortOrder = info.currentTab === TAB.FILE ? browseSortOrder : searchSortOrder;
        if(currentSortOrder === CONST_SORT_ORDER.ASC)
        {
            imgURL = imgURL + '_up';
        }
        imgURL = imgURL + '.png';
        el.append($('<img>').attr('src', imgURL));
    };
    
    /**
     * This function will return the current browse sort by.
     * @return {Integer}           sort by (CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE)
     *
     * @public
     **/
	this.GetBrowseSortBy = function(){

		if ($.inArray(browseSortBy, [CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE])===-1){
			browseSortBy = CONST_SORT.NAME;
		}

		return browseSortBy;
	};
    
    /**
     * This function returns the current browse sort order
     * @return {Integer}        sort order (CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC)
     *
     * @public
     **/ 
    this.GetBrowseSortOrder = function(){

		if ($.inArray(browseSortOrder, [CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC])===-1){
			browseSortOrder = CONST_SORT_ORDER.ASC;
		}
        
		return browseSortOrder;
	};
	
	/**
     * This function will return the current searc sort by.
     * @return {Integer}           sort by (CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE)
     *
     * @public
     **/
	this.GetSearchSortBy = function(){

		if ($.inArray(searchSortBy, [CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE])===-1){
			searchSortBy = CONST_SORT.NAME;
		}

		return searchSortBy;
	};
    
    /**
     * This function returns the current search sort order
     * @return {Integer}        sort order (CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC)
     *
     * @public
     **/ 
    this.GetSearchSortOrder = function(){

		if ($.inArray(searchSortOrder, [CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC])===-1){
			sortOrder = CONST_SORT_ORDER.ASC;
		}
        
		return searchSortOrder;
	};
    
    /**
     * This function draws the HTML of the column header
     *
     * @public
     */ 
    this.Render = function(){
        var tmplVar = [
            {isCheckAllColumn: true, classes: 'columnDivider'},
            {columnName: T('LABEL.Name_Caps'), id: 'nameHeader', classes: 'columnDivider'},
            {columnName: T('LABEL.LastModified'), id: 'lastModifiedHeader', classes: 'columnDivider'},
            {columnName: T('LABEL.Size_Caps'), id: 'sizeHeader'}
        ];
        utils.MarkLast(tmplVar);
        
		
        //only load the element in the first place
        if($('.columnHeaderForBrowse .columnHeader').length === 0)
        {
			$('#columnHeaderWrapper').css('margin-top', '0').removeClass('columnHeaderForSearch').addClass('columnHeaderForBrowse');
            ui.LoadTemplateInEmptyElement('columnHead', tmplVar, '#columnHeaderWrapper');
        }
    };

	this.RenderSearch = function()
	{
		var tmplVar = [
            {columnName: T('LABEL.Name_Caps'), id: 'nameHeaderSearch', classes: 'columnDivider'},
            {columnName: T('LABEL.LastModified'), id: 'lastModifiedHeaderSearch', classes: 'columnDivider'},
            {columnName: T('LABEL.Size_Caps'), id: 'sizeHeaderSearch'}
        ];
        utils.MarkLast(tmplVar);
        
        //only load the element in the first place
        if($('.columnHeaderForSearch .columnHeader').length === 0)
        {
			$('#columnHeaderWrapper').css('margin-top', '10px').removeClass('columnHeaderForBrowse').addClass('columnHeaderForSearch');
            ui.LoadTemplateInEmptyElement('columnHead', tmplVar, '#columnHeaderWrapper');
        }
	};
	/**
     * This function will set the current browse sort by.
     * @param {Integer}         new sort by
     * 
     * @public
     **/
	this.SetBrowseSortBy = function(by){
		// If the sort order is not one of the expected values, default to sort by name.
		if ($.inArray(by, [CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE])===-1){
            //only set to default if sortBy is invalid
            if($.inArray(browseSortBy, [CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE]) === -1)
			{
			browseSortBy = CONST_SORT.NAME;
            }
		}else
        {
            browseSortBy = by;
        }
	};
    
    /**
     * This function will set the current sort order
     * @param {Integer}         new sort order
     *
     * @public
     */ 
    this.SetBrowseSortOrder = function(order){
        // If the sort is not one of the expected values, default to sort sort desc.
		if ($.inArray(order, [CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC])===-1){
            //only set to default if sortOrder is invalid
            if($.inArray(browseSortOrder, [CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC])===-1)
			{
			browseSortOrder = CONST_SORT_ORDER.ASC;
            }
		}else{
            browseSortOrder = order;
        }
	};
	
	/**
     * This function will set the current search sort by.
     * @param {Integer}         new sort by
     * 
     * @public
     **/
	this.SetSearchSortBy = function(by){
		// If the sort order is not one of the expected values, default to sort by name.
		if ($.inArray(by, [CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE])===-1){
            //only set to default if sortBy is invalid
            if($.inArray(searchSortBy, [CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE]) === -1)
			{
			searchSortBy = CONST_SORT.NAME;
            }
		}else
        {
            searchSortBy = by;
        }
	};
    
    /**
     * This function will set the current search sort order
     * @param {Integer}         new sort order
     *
     * @public
     */ 
    this.SetSearchSortOrder = function(order){
        // If the sort is not one of the expected values, default to sort sort desc.
		if ($.inArray(order, [CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC])===-1){
            //only set to default if sortOrder is invalid
            if($.inArray(searchSortOrder, [CONST_SORT_ORDER.ASC, CONST_SORT_ORDER.DESC])===-1)
			{
			searchSortOrder = CONST_SORT_ORDER.ASC;
            }
		}else{
            searchSortOrder = order;
        }
	};
    
    /**
     * This function sets the event handler for the DOM element.
     * Called in event.js
     *
     * @public
     */ 
    this.AddEvents = function(){
        var bodyTag = $('body');
		
		bodyTag.delegate('#sortMenu', 'mouseover', function(){
			$('#sortMenu .dropdown').show();
		});
		
		bodyTag.delegate('#sortMenu', 'keydown', function(e){
			
			if(e.keyCode===13)
			{
				$('#sortMenu .dropdown').show();
			}
		});
		
		bodyTag.delegate('#sortMenu', 'mouseout', function(){
			$('#sortMenu .dropdown').hide();
		});
		
		bodyTag.delegate("#sortMenu ul li:first-child", 'keydown', function(e){
			if(e.keyCode===9 && e.shiftKey)
			{
				$('#sortMenu .dropdown').hide();
			}
		});
		
		bodyTag.delegate("#sortMenu ul li a[class$='itemLast']", 'keydown', function(e){

			if(e.keyCode===9 && !e.shiftKey)
			{
				$('#sortMenu .dropdown').hide();
			}
		});		
		
		
        bodyTag.delegate('.columnHeader:not(#checkAllHeader), #sortMenu .sortDropdownItem', 'click', function(){
            
			if($(this).hasClass('sortDropdownItem'))
			{				
				
				var currentItem = $(this).siblings('div');
				
				$('.sortDropdownItem').siblings('div').not(currentItem).attr('class','sortDropdownArrow');
				
				
				if($(this).siblings('div').hasClass('down')){
					$(this).siblings('div').removeClass('down');
					$(this).siblings('div').addClass('up');
				}
				else{
					
					$(this).siblings('div').removeClass('up');
					$(this).siblings('div').addClass('down');
				}				
				
			}
			else{
				$('.columnHeader').removeClass('columnHeaderInSort');
				$(this).addClass('columnHeaderInSort');
			}
	
			
            var oldSortBy = info.currentTab === TAB.FILE? browseSortBy : searchSortBy;			
			
            switch($(this).attr('id'))
            {
                case 'nameHeader':
				case 'sortName':
                    self.SetBrowseSortBy(CONST_SORT.NAME);
                    break;
                case 'lastModifiedHeader':
				case 'sortLastModified':
                    self.SetBrowseSortBy(CONST_SORT.DATE);
                    break;
                case 'sizeHeader':
				case 'sortSize':
                    self.SetBrowseSortBy(CONST_SORT.SIZE);
                    break;
				case 'nameHeaderSearch':
                    self.SetSearchSortBy(CONST_SORT.NAME);
                    break;
                case 'lastModifiedHeaderSearch':
                    self.SetSearchSortBy(CONST_SORT.DATE);
                    break;
                case 'sizeHeaderSearch':
                    self.SetSearchSortBy(CONST_SORT.SIZE);
                    break;
            }
			if(info.currentTab === TAB.FILE)
			{
				switchBrowseSortOrder(oldSortBy);
			}
			else if(info.currentTab === TAB.SEARCH)
			{
				switchSearchSortOrder(oldSortBy);
			}
            
            updateSortArrow($(this).find('.columnSortArrow'));
			if(info.currentTab === TAB.FILE)
			{
				$.address.value(TAB.FILE+'?action=browse&id='+ui.GetCurrentNodeID()+'&sortby='+self.GetBrowseSortBy()+'&sortorder='+self.GetBrowseSortOrder()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
			}else if(info.currentTab === TAB.SEARCH)
			{
				$.address.value(TAB.SEARCH+
								'?query='+encodeURIComponent(Search.SearchTerm) +
								'&nodeIDToSearch=' + Search.NodeIdToSearch +
								'&sortby=' + self.GetSearchSortBy() + 
								'&sortorder=' + self.GetSearchSortOrder()+
								'&browseView='+Browse.GetBrowseViewMode()+
								'&browseObject='+Browse.GetBrowseObjectMode()
								);
			}
        });
    };
};