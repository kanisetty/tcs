
var Browse = new function(){

    //the current nodeID
    var nodeID;

    //cache the folder information to eliminate the number of ajax calls
    var folderInfo = null;

	var currentData = null;


    var setBreadcrumb = function()
    {
        if(nodeID === info.userRootFolderID)
        {
            ui.SetBreadcrumb([{nodeID: nodeID, name: info.userRootFolderName, last: true}]);
			Browse.setBackupALevelNav(null);
        }else
        {
            Browse.GetObjectPath(nodeID);
        }
    }

    var setFolderInfo = function(){

		var defer = $.when();
		defer = Browse.GetObjectInfo(nodeID);
		return defer;
    }

	var setShareInfo = function(){

        //folderInfo is null, i.e.(root folder), don't do anything
        if(folderInfo === null || folderInfo.SUBTYPE == 1290)
        {
            $('#accordionContainer').hide();
			return;
        }

		//set the share info for the current folder
		info.folderIsShareable = folderInfo.ISSHAREABLE;

		var accordionContainer = $('#accordionContainer');

		//reset accordion.
		//dynamically load accordion items to add collaborators accordion item only when necessary
		var isAccordionInitialized = !!accordionContainer.data("ui-accordion");

		if( isAccordionInitialized ){
			accordionContainer.hide();
			accordionContainer.accordion('destroy');
			accordionContainer.empty();
		}
        ui.LoadTemplate("#folderDescriptionAccordionItem_tmpl", undefined, '#accordionContainer');
        FolderDescription.init(folderInfo);

		var isShareable = folderInfo.ISSHAREABLE || (!folderInfo.ISSHAREABLE && folderInfo.ISSHARED);

		if( isShareable ){ //get collaborators

			//1. load collaborators accordion item template
			ui.LoadTemplate("#collaboratorsAccordionItem_tmpl", undefined, '#accordionContainer');

			//get the collaborator list only if the folder is shared
			if(folderInfo.ISROOTSHARE){
				Collaborators.LoadCollaboratorUpdatingImage();
				Collaborators.GetSharedObjectInfo(nodeID);
			}
			else if( folderInfo.ISSHARED ){
				Collaborators.LoadCollaboratorUpdatingImage();
				Collaborators.GetShareChildInfo(nodeID);
			}
			else
				// reset collaborators so it does not use cached array
				Collaborators.collaboratorsList = [];

			//display the Add new share text field only if it's allowed
			if(folderInfo.ISSHAREABLE && !folderInfo.ISSHARED && info.canShare){
				Share.AddLeftShareButton();
			}
		}

		//2. load tasks accordion item template
		ui.LoadTemplate("#tasksAccordionItem_tmpl", undefined, '#accordionContainer');
		Tasks.GetTaskInfo(nodeID);

		//3. at this point accordion items are loaded, initialize accordion
		accordionContainer.show();
		accordionContainer.accordion({
			// juquery UI V 1.8.14 uses 'headerSelected' for active state. For newer versions use 'activeHeader' instead.
			icons: { "header": "ui-custom-icon-circle-triangle-down", "activeHeader": "ui-custom-icon-circle-triangle-up" },
			// Index 0 is first collapsible panel for Collaborators
			active: 1,
			// Newer jQuery UI versions does not use autoHeight, using heightStyle instead. Commented out older version property
			// autoHeight: false
			heightStyle: "content",
			collapsible: true
		});

	}

    var setNodeList = function(){
        Browse.BrowseObject(nodeID);
    }

    var setPendingShareRequestsAndCount = function() {
		Share.GetPendingShareRequestSummary();
    }

    var setSortColumnHead = function()
    {
        SortController.Render();
    }

    this.SetCurrentFolderInfo = function(f){
        folderInfo = f;
    }
    this.GetCurrentFolderInfo = function(f){
        return folderInfo;
    }

    this.OnBrowse = function(id){
        ui.SetCurrentNodeID(id);

        nodeID = id;

        setNodeList();
        setBreadcrumb();
        setSortColumnHead();

        //setShareInfo relies on information obtained from setFolderInfo
        setFolderInfo().done(setShareInfo);

        setPendingShareRequestsAndCount();

        Browse.SetCurrentFolderInfo(null);
    }

	this.OnAddShare = function(id){
		 ui.SetCurrentNodeID(id);

        nodeID = id;

        setNodeList();
        setBreadcrumb();
        setSortColumnHead();

        //setShareInfo relies on information obtained from setFolderInfo
        setFolderInfo().done(setShareInfo).done(function() {
			Collaborators.editAllCollaboratorsDialog.dialog('open');
		});

        setPendingShareRequestsAndCount();

        Browse.SetCurrentFolderInfo(null);
	}

    /**
    * called by response.BrowseObject
    */
    this.DisplayNodes = function(data, totalCount, pageNumber){

		$('#updatingImage').data('PageRequested',false);
        $('#updatingImage').hide();
        if(totalCount >= 0)
        {
           SelectionController.SetTotalInFolder(totalCount);
        }

		var browseObject = Browse.GetBrowseObjectMode();

		$('.leftColumnItemHeader').removeClass('selected');

		// do filters (only need to do this on root browse, browse into subfolders should behave normally)
		var atRoot = ( ui.GetCurrentNodeID() == info.userRootFolderID );
		var ssData = [];
		var csShareData = [];
		var myFilesData = [];
		var inSharesData = [];

		if ( atRoot ) {
			for (var i = 0; i < data.length; i++) {
					if( data[i].SHAREDFOLDER == CONST_SHAREDFOLDER.SHAREDNOTOWNER ){
						if( data[i].SHARECLASS == CONST_SHARECLASS.ENTERPRISE ){
							csShareData = csShareData.concat(data[i]);
						} else if( data[i].ISSUBSCRIBED == true ){
							ssData = ssData.concat(data[i]);
						} else {
							inSharesData = inSharesData.concat(data[i]);
						}
					} else {
						myFilesData = myFilesData.concat(data[i]);
					}
			}

			if( ssData.length > 0 ){
				$('#myCommunities').show();
			}
			if( csShareData.length > 0 ){
				$('#myCSShares').show();
			}
			if( inSharesData.length > 0 ){
				$('#incomingShares').show();
			}
			if( myFilesData.length > 0 ){
				$('#myFiles').show();
			}
			$('#pageActions').hide();
		} else {
			$('#pageActions').show();
		}

		if( browseObject === CONST_BROWSE_OBJECT.MYFILES ){
			if ( atRoot ) {
				data = myFilesData.slice(0);
			}
			$('#myFiles').children('.leftColumnItemHeader').addClass('selected');

			$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24.png');
			$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24_white.png');
			$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24.png');
			$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24.png');
			$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24.png');

			SelectionController.SetTotalInFolder(data.length);
			$('#pageActions').show();
		}
		else if( browseObject === CONST_BROWSE_OBJECT.INCOMINGSHARES ){
			if ( atRoot ) {
				data = inSharesData.slice(0);
			}
			$('#incomingShares').children('.leftColumnItemHeader').addClass('selected');

			$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24.png');
			$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24.png');
			$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24_white.png');
			$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24.png');
			$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24.png');

			SelectionController.SetTotalInFolder(data.length);
		}
		else if( browseObject === CONST_BROWSE_OBJECT.ENTERPRISE ){
			if ( atRoot ) {
				data = csShareData.slice(0);
			}
			$('#myCSShares').children('.leftColumnItemHeader').addClass('selected');

			$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24.png');
			$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24.png');
			$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24.png');
			$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24_white.png');
			$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24.png');

			if( csShareData.length > 0 ){
				 SelectionController.SetTotalInFolder(csShareData.length);
			}
		}
		else if( browseObject === CONST_BROWSE_OBJECT.SYSTEMSHARE ){
			if ( atRoot ){
				data = ssData.slice(0);
			}
			$('#myCommunities').children('.leftColumnItemHeader').addClass('selected');

			$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24.png');
			$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24.png');
			$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24.png');
			$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24.png');
			$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24_white.png');

			SelectionController.SetTotalInFolder(data.length);
		}
		else{
			$('#allFiles').children('.leftColumnItemHeader').addClass('selected');

			$('#allFiles').find('.leftTabIcon').attr('src', info.repo+'/img/all_files24_white.png');
			$('#myFiles').find('.leftTabIcon').attr('src', info.repo+'/img/my_files24.png');
			$('#incomingShares').find('.leftTabIcon').attr('src', info.repo+'/img/shared_with_me24.png');
			$('#myCSShares').find('.leftTabIcon').attr('src', info.repo+'/img/enterprise_content24.png');
			$('#myCommunities').find('.leftTabIcon').attr('src', info.repo+'/img/my_communities24.png');

			$('#pageActions').show();
		}

		var browseView = Browse.GetBrowseViewMode();

        if(data.length > 0)
        {

			for(var i in data){
                data[i].uncheckedImage = info.repo + "/img/chkbox.png";
                data[i].checked = false;

				if (typeof data[i].ISBRAVA === 'undefined' || data[i].ISBRAVA === null){
					data[i].ISBRAVA = false;
				}

				if (typeof data[i].HASBRAVAMARKUP === 'undefined' || data[i].HASBRAVAMARKUP === null){
					data[i].HASBRAVAMARKUP = false;
				}
            };

            if(pageNumber === 1)
            {

				if(browseView === CONST_BROWSE_VIEW.THUMBNAIL){
					ui.LoadTemplateInEmptyElement("#browseItemThumbnail_tmpl", utils.MarkLast(data), "#itemsForFileTab");
					Browse.SwitchBrowseViewSelector($('#thumbnailViewSelector'));
					$('#columnHeaderWrapper').hide();
					$('#sortMenu').show();
				}
				else
				{
					ui.LoadTemplateInEmptyElement("#browseItem_tmpl", utils.MarkLast(data), "#itemsForFileTab");
					Browse.SwitchBrowseViewSelector($('#listViewSelector'));
					$('#columnHeaderWrapper').show();
					$('#sortMenu').hide();

				}

				SelectionController.SetTotalOnPage();
            }
            else{
                $('.browseItem').removeClass('itemLast');
                ui.LoadTemplate("#browseItem_tmpl", utils.MarkLast(data), "#itemsForFileTab");
                //check the new rows if checkAll is selected
                SelectionController.SetTotalOnPage();
            }

            SelectionController.UpDateNewRowsCheckStatus();

            //display the process indicator for items currently being processed
            ui.DisplayProcessingIndicatorForItemRow();

            /*
             If there is no scroll bar and items on current page are less then the total items then try to get more items
            */
            if($(document).height() === $(window).height() && data.length < totalCount)
            {
                $('#updatingImage').data('PageRequested', true);
                Browse.BrowseObjectMore(ui.GetCurrentNodeID());
            }
        }
        else
        {
            if(browseView === CONST_BROWSE_VIEW.THUMBNAIL){
				Browse.SwitchBrowseViewSelector($('#thumbnailViewSelector'));
				$('#sortMenu').show();
			}

			if(pageNumber === 1 && totalCount >= 0)
            {
                ui.LoadTemplateInEmptyElement("#message_tmpl", {message: T('LABEL.EmptyFolderMessage'), id: 'emptyFolderMessage'}, '#itemsForFileTab');
            }
        }
		ui.ManagePageHeight();
    }

    /**
     * called by Browse.response.GetObjectInfo()
     */
    this.DisplayFolderInfo = function(data){

        if(data.length === 0)
        {
            return;
        }

        //update current folderInfo with the new data
        folderInfo = data;

        var folderIcon;

		if(data.ISROOTSHARE){
			folderIcon = 'sharedFolderIcon';
		}
		else{
			folderIcon = 'folderIcon';
		}

		Browse.UpdateObjectInfo(data);

    }

	/**
	This function sets the Backup one level up navigation

	@param {Array}	data	breadcrumb data

	*/
	this.setBackupALevelNav= function(data){

		if (data instanceof Array && data.length > 1)
		{
			// parent of current node for 'Backup one level' nav
			ui.LoadTemplateInEmptyElement("#backupLevel_tmpl", data[data.length-2], "#backupLevel");
		}
		else if ($('#backUpLevelNav').length)
		{
			$('#backUpLevelNavWrapper').remove();
		}
	}

	this.ReadOnlyUIUpdate = function(data)
	{
		if(data.ISREADONLY)
		{
			// hide top button items
			$('#uploadButton').parents('.btn').hide();
			$('#newFolderButton').parents('.btn').hide();
		}

	}

    this.UpdateObjectInfo = function(data){
		if(typeof data === "undefined"){
			data = this.currentData;
		}
		else {
			this.currentData = data;
		}

		var tmplVar =
			{
				iconClass: 'folderIcon',
				name: ' ',
				ownerID:'',
				ownerName: '',
				ownerPhotoURL:'',
				lastModified: '',
				isReadOnly:'',
				isRootShare:'',
				isShared:'',
				isShareable:'',
				isOwner:'',
				isNotifySet:'',
				isNotifyEnabled:'',
				isDeletable:'',
				displayModifyDate:'',
				isReservable:'',
				reservedByUserName:''
			}

		if(data.NAME !== undefined){
			tmplVar.name = data.NAME;
		}

		if(data.OWNERNAME !== undefined){
			tmplVar.ownerName = data.OWNERNAME;
		}

		if(data.OWNERPHOTOURL !== undefined){
			tmplVar.ownerPhotoURL = data.OWNERPHOTOURL;
		}

		if(data.MODIFYDATE !== undefined){
		    tmplVar.lastModified = utils.DateDifferenceUptoYesterday(  data.MODIFYDATE ) ;
		}

        if (data.DISPLAYMODIFYDATE !== undefined){
            tmplVar.displayModifyDate = utils.DateDifferenceUptoYesterday(  data.DISPLAYMODIFYDATE ) ;
        }

		if(data.ISREADONLY !== undefined){
			tmplVar.isReadOnly = data.ISREADONLY;
		}
		if(data.ISROOTSHARE !== undefined){
			tmplVar.isRootShare = data.ISROOTSHARE;
		}
		if(data.ISSHARED !== undefined){
			tmplVar.isShared = data.ISSHARED;
		}
		if(data.ISSHAREABLE !== undefined){
			tmplVar.isShareable = data.ISSHAREABLE;
		}
		if(data.USERID !== undefined){
			tmplVar.ownerID = data.USERID;
			tmplVar.isOwner = (data.USERID == info.userID) ? true:false;
		}
		if(data.ISNOTIFYSET !== undefined){
			tmplVar.isNotifySet = data.ISNOTIFYSET;
		}
		tmplVar.isNotifyEnabled = tmplVar.isRootShare && info.emailEnabled &&!info.settings.notifyOnFolderChange;
		if(data.ISDELETABLE !== undefined){
			tmplVar.isDeletable = data.ISDELETABLE;
		}
		if(data.ISRESERVABLE !== undefined){
			tmplVar.isReservable = data.ISRESERVABLE;
		}
		if(data.RESERVEDBYUSERNAME !== undefined){
			tmplVar.reservedByUserName = data.RESERVEDBYUSERNAME;
		}

		ui.LoadTemplateInEmptyElement("#objectInfo_tmpl", tmplVar, '#objectInfo');
		$("#folderNotifyCheckBox").checkbox(tmplVar.isNotifySet, Browse.SetFolderNotify);
	};


    /**
     * add browse related events
     */
    this.AddEvents = function(){

        var bodyTag = $('body');

        bodyTag.delegate('.browseItem .itemInfo .itemName,.thumbnailViewBrowseItem .itemInfo .itemName, .browseItem .itemInfo .itemIcon, .thumbnailViewBrowseItem .itemInfo .itemIcon', 'click', function(e){
			var id = $(this).tmplItem().data.DATAID;

			e.stopPropagation();
			var subtype = $(this).tmplItem().data.SUBTYPE;

			if(subtype == CONST_SUBTYPE.FOLDER){
				e.preventDefault();
			}

			if($(this).parents('.browseItem').hasClass('disabled'))
			{
				return;
			}

			//if is a document, download file
			if(subtype===CONST_SUBTYPE.DOCUMENT)
			{
				if (utils.IsSupportedImageMimetype($(this).tmplItem().data.MIMETYPE)) {
					$("#node" + id).trigger('click');
				}
				else {
					window.location.href = ui.FormatDownloadFileURL($(this).tmplItem().data.DATAID);
				}
				return;
			}

			Browse.SetCurrentFolderInfo($(this).tmplItem().data);

			$.address.value(TAB.FILE+'?action=browse&id='+id+'&sortby='+SortController.GetBrowseSortBy()+'&sortorder='+SortController.GetBrowseSortOrder()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
		});

		bodyTag.delegate('.browseItem', 'click', function(e){
			e.stopPropagation();
			var checkBox = $(this).find('.itemCheckBox a');
			if($(this).hasClass('disabled'))
			{
				return false;
			}
			SelectionController.ToggleCheckBox(checkBox);
			SelectionController.UpdateMultiActionMenu();
			return false;
		});

		bodyTag.delegate('.itemIcon', 'mouseover', function(){
			$(this).siblings('.itemNameContainer').addClass('iconHoverUnderlineName');
		});

		bodyTag.delegate('.itemIcon', 'mouseout', function(){
			$(this).siblings('.itemNameContainer').removeClass('iconHoverUnderlineName');
		});
        /*
		 When a matching item is first hovered over, it will not have the bound class,
		 and thus will execute this function. This function adds the bound class, which
		 prevents this function from triggering again for this item, but it also then
		 binds the real hover in and out events. This is a workaround to be able to use
		 the much nicer mouseenter mouseleave events that jquery provides (needed for the
		 css dropdown menus to work with a hover state).
		 */

		bodyTag.delegate('.browseItem:not(.bound),.thumbnailViewBrowseItem:not(.bound)', 'mouseover', function(){

				$(this).hover(function(){
						//reset all rows when mouse hovers on a row
						$('.browseItem,.thumbnailViewBrowseItem').each(function(){
                            $(this).find('.BrowseMoreMenu .dropdown button').removeClass('moreMenuButtonActive');
							$(this).removeClass('browseItemHover');
							$(this).find('.dropDownMenu').attr('style', '');
							});

						if(!$(this).hasClass('disabled'))
						{
                            //set style of the current hovered row
							$(this).addClass('browseItemHover');

							if($(this).hasClass('browseItemSelected'))
							{
								$(this).removeClass('browseItemSelected');
							}
						}

					},
					function(){
						if(!$(this).hasClass('disabled')){
							$(this).removeClass('browseItemHover');
							if($(this).tmplItem().data.checked === true)
							{
								$(this).addClass('browseItemSelected');
							}
						}
				});

				//reset all rows
				$('.browseItem,.thumbnailViewBrowseItem').each(function(){
                    $(this).find('.BrowseMoreMenu .dropdown button').removeClass('moreMenuButtonActive');
					$(this).removeClass('browseItemHover');
					$(this).find('.dropDownMenu').attr('style', '');
				});

				if(!$(this).hasClass('disabled'))
				{
					$(this).addClass('browseItemHover bound');
				}

		});

		 bodyTag.delegate('.thumbnailViewBrowseItem .itemName ', 'focus', function(){

			var self = $(this);

			if(self.parents('.thumbnailViewBrowseItem').find('.moreMenuButton').hasClass('moreMenuButtonActive')){
				self.parents('.thumbnailViewBrowseItem').find('.moreMenuButton').removeClass('moreMenuButtonActive');
				self.parents('.thumbnailViewBrowseItem').find('.dropDownMenu').hide();
			}

		 });

		//set the row when it gets focus
        bodyTag.delegate('.browseItem,.thumbnailViewBrowseItem', 'focus', function(){
            var self = $(this);
            //reset all rows
            $('.browseItem, .thumbnailViewBrowseItem').each(function() {
				if($(this).attr('id') === self.attr('id'))
				{
					return;
				}
                $(this).find('.BrowseMoreMenu .dropdown button').removeClass('moreMenuButtonActive');
				$(this).find('.dropDownMenu').attr('style', '');
                $(this).removeClass('browseItemHover');

				if($(this).hasClass('disabled'))
				{
					return;
				}

				if($(this).tmplItem().data.checked)
				{
					$(this).addClass('browseItemSelected');
				}else
				{
					$(this).removeClass('browseItemSelected');
				}
            });
			if($(this).hasClass('disabled'))
			{
				return false;
			}
			if(!$(this).hasClass('browseItemHover'))
			{
				$(this).addClass('browseItemHover');
				$(this).removeClass('browseItemSelected');
			}
            return false;
        });

		// reset the row when the row loses focus
		bodyTag.delegate('.browseItem,.thumbnailViewBrowseItem', 'blur', function(e){
			$(this).removeClass('browseItemHover');
			if($(this).tmplItem().data.checked)
			{
				$(this).addClass('browseItemSelected');
			}else
			{
				$(this).removeClass('browseItemSelected');
			}
		});

		//upwards dropdown if necessary
		bodyTag.delegate('.browseItem .dropdown', 'hover focus', function(){
			var button = $("button", this);
			var menu = button.parent('li').children('.dropDownMenu');
			var menuHeight = menu.height();
			var viewPortHeight =  $(window).height();
			var viewPortOffsetTop = $(window).scrollTop();
			var buttonOffsetTop = button.offset().top;
			var buttonHeight = button.height();

			if (viewPortHeight + viewPortOffsetTop - buttonOffsetTop - buttonHeight < menuHeight) {
				button.parents('.browseItem').addClass('needUpwardMenu');
				button.next('div').children('.whiteLine').addClass('upward');
				menu.css('top', '-' + menu.height() + 'px' );
			}
			else {
				button.parents('.browseItem').removeClass('needUpwardMenu');
				button.next('div').children('.whiteLine').removeClass('upward');
			}
		});

		//remove the dropdown in the last row after tab leaves
		bodyTag.delegate('.browseItem:last .dropdown ul li:last', 'keydown', function(e){
			if(e.keyCode === 9 && !e.shiftKey)
			{
				$(this).parents('.browseItem').find('.dropDownMenu').attr('style', '');
			}
		});

        //change the background of the more button when it gets focus
        bodyTag.delegate('.BrowseMoreMenu .dropdown button', 'focus', function(e){
            $(this).addClass('moreMenuButtonActive');
		});

        //hide the dropdown when an action is performed
		bodyTag.delegate('.BrowseMoreMenu .dropdown ul li', 'keydown', function(e){
			if(e.keyCode === 13)
			{
				$(this).parents('.browseItem').find('.dropDownMenu').attr('style', '');
			}
		});


		//add click event for the keydown(enter key) on the "more" button for TAB users
		bodyTag.delegate('.BrowseMoreMenu .dropdown button', 'keydown', function(e){
			e.stopPropagation();
			var menu = $(this).parents('.dropdown').find('.dropDownMenu');
			//bring up the dropdown when the Enter key is hit
			if(e.keyCode===13)
			{
				if(menu.css('display') === 'block')
				{
					menu.attr('style', '');
				}
				else{
					$(this).parents('.dropdown').find('.dropDownMenu').css('display', 'block');
				}
			}
            //if user press TAB+SHIFT (leave the button backwards), hide the dropdown and change the background of the button
			if(e.keyCode===9 && e.shiftKey)
			{
				if(menu.css('display') === 'block')
				{
					menu.attr('style', '');
				}
                $(this).removeClass('moreMenuButtonActive');
			}
		});

        //prevent click event to bubble up when the more button is clicked.
		bodyTag.delegate('.BrowseMoreMenu .dropdown button', 'click', function(e){
			e.stopPropagation();
		});



		// register click event for backup one level navigation
		bodyTag.delegate('#backUpLevelNavText a, #backUpLevelNavIcon', 'click', function(e){
			e.preventDefault();
			var id = $('#backUpLevelNav').tmplItem().data.nodeID;
			if(typeof id === 'undefined')
			{
				return;
			}
			$.address.value(TAB.FILE+'?action=browse&id='+id+'&sortby='+SortController.GetBrowseSortBy()+'&sortorder='+SortController.GetBrowseSortOrder()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
		});

		 //set browse to thumbnail or list view
		bodyTag.delegate('#thumbnailViewSelector', 'click', function(e){
			e.preventDefault();
			Browse.SwitchBrowseViewSelector($(this));
			$('#columnHeaderWrapper').hide();
			$('#sortMenu').show();
			$.address.value(TAB.FILE+'?action=browse&id='+ui.GetCurrentNodeID()+'&sortby='+SortController.GetBrowseSortBy()+'&sortorder='+SortController.GetBrowseSortOrder()+'&browseView=2&browseObject='+Browse.GetBrowseObjectMode());
		});
		bodyTag.delegate('#listViewSelector', 'click', function(e){
			e.preventDefault();
			Browse.SwitchBrowseViewSelector($(this));
			$('#columnHeaderWrapper').show();
			$('#sortMenu').hide();
			$.address.value(TAB.FILE+'?action=browse&id='+ui.GetCurrentNodeID()+'&sortby='+SortController.GetBrowseSortBy()+'&sortorder='+SortController.GetBrowseSortOrder()+'&browseView=1&browseObject='+Browse.GetBrowseObjectMode());
		});

    }

	this.GetBrowseViewMode = function(){

		var browseView = parseInt($.address.parameter('browseView'), 10);

		if(typeof browseView !="undefined" && ($.inArray(browseView, [CONST_BROWSE_VIEW.THUMBNAIL, CONST_BROWSE_VIEW.LIST])!=-1)){
			return browseView;
		}
		else{
			return CONST_BROWSE_VIEW.LIST;
		}
	}
	this.SwitchBrowseViewSelector = function(element){

		element.parent('div').siblings('div').children('button').removeClass("on");
		element.toggleClass("on", true);


	}

	this.GetBrowseObjectMode = function(){

		var browseObject = parseInt($.address.parameter('browseObject'), 10);

		if(typeof browseObject !="undefined" && ($.inArray(browseObject, [CONST_BROWSE_OBJECT.All, CONST_BROWSE_OBJECT.MYFILES, CONST_BROWSE_OBJECT.INCOMINGSHARES, CONST_BROWSE_OBJECT.ENTERPRISE, CONST_BROWSE_OBJECT.SYSTEMSHARE])!=-1)){
			return browseObject;
		}
		else{
			return CONST_BROWSE_OBJECT.ALL;
		}
	}

	/**
	This function will set e-mail notification settings for this folder

	*/
	this.SetFolderNotify = function(notify){

		var url = 'v4/shares/incoming/'+ui.GetCurrentNodeID()+'?notify='+notify;
		var type = 'request';
		var subtype = 'UpdateFolderNotify';
		var requestID = type + subtype +"(" + Math.floor(Math.random()*65536)  + ")";
		var ajaxData = new request.RestAPIRequest(url, 'PUT');
		return $.when(queue.AddSet(requestID, ajaxData)).pipe(request.ValidateRestResponse).done(function(resultData){
			queue.ClearCache("requestUpdateFolderNotify");
			ui.MessageController.ShowMessage(T('LABEL.FolderNotifyStatusUpdated'));
		});
	};
}
