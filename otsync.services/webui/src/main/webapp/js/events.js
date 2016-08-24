"use strict";

	/**
	This function binds all of the events used by the UI.

	*/
var AddEvents = function(defer) {

	var bodyTag = $('body');

		bodyTag.delegate('.helpLink', 'click', function(){
			var helpUrl = info.repo.charAt(info.repo.length -1)!=='/'? info.repo + '/': info.repo;
			switch(info.currentTab)
			{
				case TAB.FILE:
					helpUrl += info.helpMap.FILE;
					break;
				case TAB.SHARE:
					helpUrl += info.helpMap.SHARE;
					break;
				default:
					helpUrl += info.helpMap._DEFAULT_;
			}
			var helpWindow = window.open(helpUrl, 'helpWindow', "WIDTH=900,HEIGHT=530,resizable,toolbar");
			if(helpWindow.focus)
			{
				helpWindow.focus();
			}
			return false;
		});
		
		$(window).resize(function(){
			ui.ManagePageHeight();
		});

        $(window).scroll(function(){

            //Check to see if the scroll bar is past the 90% and if another page request has already been made
            if($(window).scrollTop() >= (($(document).height() - $(window).height()) * 0.9) && !$('#updatingImage').data('PageRequested')){


                switch(info.currentTab)
                {
                    case TAB.FILE:
                        $('#updatingImage').data('PageRequested', true);
                        $('#updatingImage').show();
                        Browse.BrowseObjectMore(ui.GetCurrentNodeID());
                        break;
                    case TAB.SEARCH:
                        $('#updatingImage').data('PageRequested', true);
                        $('#updatingImage').show();
                        var searchQuery =  {queryString: decodeURIComponent($.address.parameter('query'))};

                        var nodeIDToSearch = parseInt($.address.parameter('nodeIDToSearch'), 10);
                        nodeIDToSearch = nodeIDToSearch? nodeIDToSearch: info.userRootFolderID;

                        Search.SearchObjectMore(searchQuery.queryString, nodeIDToSearch)
                        break;
                }
            }
            });

		bodyTag.delegate('#loginButton', 'click', function(e){
			return _Login();
		});

		bodyTag.delegate('#loginInputs', 'keydown', function(e){
			if(e.keyCode === 13){
				return _Login();
			}
		});

		var _Login = function(){
			var loginName = $('#loginName').val();

			if(loginName){
				request.Authenticate(loginName, $('#loginPwd').val());
			}
			return false;
		};

		bodyTag.delegate('.aboutLink', 'click', function(e){
			$('#apiVersion').text(info.version.api);
			$("#aboutDialogView").dialog("open");
			return false;
		});
		
		bodyTag.delegate('#logoutLink', 'click', function(e){
			utils.SessionLogout();
			return false;
		});
		
		bodyTag.delegate('.myProfileLink', 'click', function(e){
			e.stopPropagation();
			//this toggle always add the input widget into dom.
			$("#profilePictureDialogView").dialog("open");
			return false;
		});
		
		bodyTag.delegate('#passwordLink', 'click', function(e){
			$("#passwordDialogView").dialog("open");
			return false;
		});

        bodyTag.delegate('.foundIn a', 'click', function(){
                var id=$(this).attr('parentID');
                $.address.value(TAB.FILE+'?action=browse&id='+id+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
            });

        bodyTag.delegate('.lefttabSearch', 'click', function(){
			ui.RedirectToCurrentFileTab();
            });

		bodyTag.delegate('.item', 'click', function(){
			$.address.queryString("action=modify&id="+$(this).tmplItem().data.DataID);
	    });

        bodyTag.delegate('.searchItem .itemInfo .itemName', 'click', function(e){
			e.stopPropagation();
			var subtype = $(this).tmplItem().data.subtype;
			if(subtype!==CONST_SUBTYPE.FOLDER)
			{
				return;
			}
			var id = $(this).tmplItem().data.dataID;

			$.address.value(TAB.FILE+'?action=browse&id='+id+'&sortby='+SortController.GetBrowseSortBy()+'&sortorder='+SortController.GetBrowseSortOrder()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
		});

		bodyTag.delegate('.objectDownload', 'click', function(){
			
			if($(".objectDownload").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var id = targetObject.tmplItem().data.DATAID;
			window.open(ui.FormatDownloadFileURL(id),'Download');


		});
		
		bodyTag.delegate('.objectBrava', 'click', function(){
			
			if($(".objectBrava").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var id = targetObject.tmplItem().data.DATAID;
			window.open(ui.FormatBravaURL(id),'Brava');
		});

		bodyTag.delegate('.versionDownload', 'click', function(){
			var id = $(this).tmplItem().data.NodeID;
			var versionNumber = $(this).tmplItem().data.Number;
			window.open(ui.FormatDownloadFileURL(id,versionNumber),'Download');
		});

		bodyTag.delegate('.objectHistory', 'click', function(e){
			e.stopPropagation();
			
			if($(".objectHistory").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
				$(this).parents('.dropDownMenu').hide();
				
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;
			$('#historyView').data('sourceItemData', data);
			$('#historyView').dialog('open');
		});

		bodyTag.delegate('.objectHistoryFolder', 'click', function(e){
			e.stopPropagation();
			
			if($(".objectHistoryFolder").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
				$(this).parents('.dropDownMenu').hide();
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;
			$('#historyViewFolder').data('sourceItemData', data);
			$('#historyViewFolder').dialog('open');
		});

		bodyTag.delegate('#browseCSButton', 'click', function(e){
			if($('#browseCSButton').hasClass('browseCSVersionButton'))
			{
				BrowseContentServerWindow(info.versionCreateInSubtype);
			}
			else if ($('#browseCSButton').hasClass('browseCSDocumentButton')){

				BrowseContentServerWindow(info.documentCreateInSubtype);
			}
			else
			{
				BrowseContentServerWindow(info.folderCreateInSubtype);
			}
		});

		bodyTag.delegate('.publishToFolderLink', 'click', function(e){
			$('#publishDestinationOptionDialogView').dialog('close');
			$('#publishDialogView').data('publishDestinationType', info.documentCreateInSubtype);
			$('#publishDialogView').dialog('open');
		});

		bodyTag.delegate('.publishToFileLink', 'click', function(e){
			$('#publishDestinationOptionDialogView').dialog('close');
			$('#publishDialogView').data('publishDestinationType', info.versionCreateInSubtype);
			$('#publishDialogView').dialog('open');
		});


		bodyTag.delegate('.objectPublishDestinationOption', 'click', function(e){
			e.stopPropagation();
			
			if($(".objectPublishDestinationOption").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;
			$('#publishDestinationOptionDialogView').data('sourceItemData', data);
			$('#publishDestinationOptionDialogView').dialog('open');
		});

		bodyTag.delegate('.objectPublish', 'click', function(e){
			e.stopPropagation();
			
			if($(".objectPublish").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
				$(this).parents('.dropDownMenu').hide();
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;
			$('#publishDialogView').data('publishDestinationType', info.folderCreateInSubtype);
			$('#publishDialogView').data('sourceItemData', data);
			$('#publishDialogView').dialog('open');
		});


		bodyTag.delegate('#breadcrumb li a', 'click', function(e){
			e.preventDefault();
			var id = $(this).tmplItem().data.nodeID;
			if($(this).hasClass('notClickable'))
			{
				return;
			}
			$.address.value(TAB.FILE+'?action=browse&id='+id+'&sortby='+SortController.GetBrowseSortBy()+'&sortorder='+SortController.GetBrowseSortOrder()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
		});

		bodyTag.delegate('#userActions a', 'focus', function(){
			ui.showUserActionsMenu();
		});
		
		bodyTag.delegate('#userActions', 'mouseover', function(){
			ui.showUserActionsMenu();
		});
		
		bodyTag.delegate('#userActions a', 'mouseover', function(){
			ui.showUserActionsMenu();
		});
		
		bodyTag.delegate('#userActions a', 'keydown', function(e){			
			if(e.keyCode === 13)
			{
				ui.hideUserActionsMenuDelayed();
			}			
		});	
				
		bodyTag.delegate('#userPicWrapper a', 'blur', function(){			
			ui.hideUserActionsMenuDelayed();
		});
		
		bodyTag.delegate('#userActions', 'mouseout', function(){
			ui.hideUserActionsMenuDelayed();
		});
		
		bodyTag.delegate('#userActions a', 'mouseout', function(){
			ui.hideUserActionsMenuDelayed();
		});
		
		//click any where in the page will cancel all the dropdow
		$(window).click(function(eventObj){
			if(eventObj.pageX || eventObj.pageY)
			{
				$('.dropDownMenu').attr('style', '');
			}
		});

		$('body').delegate('#multiActionDropDown button', 'click', function(eventObj){
			eventObj.stopPropagation();
		});

		$('body').delegate('#multiActionDropDown button', 'keydown', function(eventObj){
			eventObj.stopPropagation();
			var menu = $(this).parents('#multiActionDropDown').find('.dropDownMenu');
			if(eventObj.keyCode === 13)
			{
				if(SelectionController.GetCheckedItems().length !== 0)
				{
					if(menu.css('display')==='block')
					{
						menu.attr('style', '');
					}
					else
					{
						menu.show();
					}
				}
			}
			if(eventObj.keyCode === 9 && eventObj.shiftKey)
			{
				menu.attr('style', '');
			}
		});

		$('body').delegate('#multiActionDropDown .dropDownMenu ul li', 'keydown', function(e){
			if(e.keyCode === 13)
			{
				$(this).parents('.dropDownMenu').attr('style', '');
			}
		});

		$('body').delegate('#multiActionDropDown .dropDownMenu ul li:last', 'keydown', function(e){
			if(e.keyCode === 9 && !e.shiftKey)
			{
				$(this).parents('.dropDownMenu').attr('style', '');
			}
		});
		
		$('body').delegate('.leftColumnTabItem', 'focus', function(e){
			
			ui.hideUserActionsMenuDelayed();
		});
		
		$('body').delegate('.leftColumnTabItem', 'click', function(e){
			
			var browseObjectValue;
			
			if(!$(this).children('.leftColumnItemHeader').hasClass('selected'))
			{
				$('.leftColumnItemHeader').removeClass('selected');
				$(this).children('.leftColumnItemHeader').addClass('selected');
				
				if($(this).attr('id')=="myFiles"){
					browseObjectValue = CONST_BROWSE_OBJECT.MYFILES;
					$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24.png');
					$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24_white.png');
					$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24.png');
					$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24.png');
					$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24.png');
				} else if($(this).attr('id')=="incomingShares"){
					browseObjectValue = CONST_BROWSE_OBJECT.INCOMINGSHARES;
					$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24.png');
					$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24.png');
					$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24_white.png');
					$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24.png');
					$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24.png');
				} else if($(this).attr('id')=="myCSShares"){
					browseObjectValue = CONST_BROWSE_OBJECT.ENTERPRISE;
					$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24.png');
					$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24.png');
					$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24.png');
					$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24.png');
					$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24_white.png');
				} else if($(this).attr('id')=="myCommunities"){
					browseObjectValue = CONST_BROWSE_OBJECT.SYSTEMSHARE;
					$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24.png');
					$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24.png');
					$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24.png');
					$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24_white.png');
					$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24.png');
				} else {
					browseObjectValue = CONST_BROWSE_OBJECT.ALL;
					$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24_white.png');
					$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24.png');
					$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24.png');
					$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24.png');
					$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24.png');
				}
			}

			if( typeof $(this).tmplItem().data.tabAddressValue !== 'undefined')
			{
				$.address.value($(this).tmplItem().data.tabAddressValue+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+browseObjectValue);			
			}
		});
		
		$('body').delegate('.backLinks', 'mouseover', function(e){
			$('.hovered').removeClass('hovered');
			$(this).focus();
		});
		// separate event to handle keyboard tabbing.
		$('body').delegate('.backLinks', 'focus', function(e){
			$(this).parent().addClass('hovered');
		});
		$('body').delegate('.backLinks', 'focusout', function(e){
			$(this).parent().removeClass('hovered');
		});
		
		AddFolderController.AddEvents();
		Browse.AddEvents();
		Copy.AddEvents();
		Delete.AddEvents();
		Reserve.AddEvents();
		Unreserve.AddEvents();
		Move.AddEvents();
		RenameController.AddEvents();
		Search.AddEvents();
		SelectionController.AddEvents();
		Share.AddEvents();
		SortController.AddEvents();
		UserProfile.AddEvents();
		Collaborators.AddEvents();
		UserNotificationConfig.AddEvents();
		Tasks.AddEvents();
	
		return defer;

};

