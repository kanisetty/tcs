var Search = new function(){
    
    this.SearchTerm = '';
    this.NodeIdToSearch = 0;
    
    var getSearchResult = function(){
        var searchQuery =  {queryString: decodeURIComponent($.address.parameter('query'))};
        Search.SearchTerm = searchQuery.queryString;
		var nodeIDToSearch = parseInt($.address.parameter('nodeIDToSearch'), 10);
		nodeIDToSearch = nodeIDToSearch? nodeIDToSearch: info.userRootFolderID;
        Search.NodeIdToSearch = nodeIDToSearch;
        Search.SearchObject(searchQuery.queryString, nodeIDToSearch, SortController.GetSearchSortBy(), SortController.GetSearchSortOrder());
    };
	
	var prepareSearchBox = function(){
		$('#searchfield').val(Search.SearchTerm);
		$('#searchMagIcon').addClass('searchFieldCancel');
	};
    
    this.DoSearch = function(){
		//remove focus on the search textbox to facilitate page up/down home/end (in firefox and ie)
        $('#searchfield').blur();
        SortController.RenderSearch();
        getSearchResult();
		prepareSearchBox();
    };
    
    
    this.AddEvents = function(){
        var bodyTag = $('body');
        bodyTag.delegate('#searchfield', 'keydown', function(e){
           if(e.keyCode === 13)
           {
               if($('#searchfield').val())
               {
                   $('#accordionContainer').hide();
				   $.address.value(TAB.SEARCH+'?query='+encodeURIComponent($('#searchfield').val()) + '&nodeIDToSearch=' + ui.GetCurrentNodeID()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode() );
               }
           }

        });
		
		bodyTag.delegate('#searchfield', 'focus', function(e){
			$('#searchMagIcon').removeClass('searchFieldCancel');
		});
		
		
		bodyTag.delegate('#searchMagIcon', 'click', function(e){
			if($(this).hasClass('searchFieldCancel'))
			{
				$('#searchfield').val('');
				$(this).removeClass('searchFieldCancel');
				$('#searchfield').focus();
				return;
			}
			if($('#searchfield').val())
            {
                $('#accordionContainer').hide();
				$.address.value(TAB.SEARCH+'?query='+encodeURIComponent($('#searchfield').val()) + '&nodeIDToSearch=' + ui.GetCurrentNodeID()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode() );
            }
		});
    };
};