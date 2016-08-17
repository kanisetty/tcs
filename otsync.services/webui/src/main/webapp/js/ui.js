/**
This object contains all of the utility functions used to update the user interface.

The way this object is constructed allows JavaScript to have private and public functions but only works as a singleton.

Public functions notation:
	this.MyPublicFunction

Private function notation:
	var _MyPrivateFunction



*/
"use strict";
var ui = new function(){

	/**
	This function loads the named template with the given data and appends using the given selector.

	@param {String}			templateName		Name of the template to laod
	@param {Object, Array}	data				data to pass to the template
	@param {String}			selectorToAppendTo	jQuery selector used to select where to append to

	*/
	this.LoadTemplate = function( templateID, data, selectorToAppendTo ){

		$( selectorToAppendTo ).append( $(templateID).tmpl( data ) );
	};

	/**
	This function removes current html from the given selector then loads the named template with the given data and appends back using the given selector.

	@param {String}			templateName		Name of the template to laod
	@param {Object, Array}	data				data to pass to the template
	@param {String}			selectorToAppendTo	jQuery selector used to select where to append to

	*/
	this.LoadTemplateInEmptyElement = function( templateID, data, selectorToAppendTo ){
		$(selectorToAppendTo).empty().append($(templateID).tmpl(data));
	};

	/**
	This function loads the named template with the given data and prepends back using the given selector.

	@param {String}			templateName		Name of the template to laod
	@param {Object, Array}	data				data to pass to the template
	@param {String}			selectorToPrependTo	jQuery selector used to select where to append to

	*/
	this.LoadTemplatePreprend = function( templateID, data, selectorToPrependTo ){

		$( selectorToPrependTo ).prepend(  $(templateID).tmpl( data ) );
	};


	this.RemoveItemRow = function (targetObject){

		targetObject.animate({"height": "toggle", "opacity": "toggle"}, 500,function(){
			targetObject.remove();
			SelectionController.UpdateMultiActionMenu();
			}
		);

	};


	/**
	Replaces not found or timed out user images with our default

	@param {Object} imgTag				DOM Element of the img tag that needs a new src
	*/
	this.MissingUserImg = function (imgTag, isExternalUser ) {

		if(typeof isExternalUser === "undefined" || !isExternalUser){

			$(imgTag).attr('onerror','').attr('src', info.repo + '/img/image_user_placeholder.svg');

		}
		else{


			$(imgTag).attr('onerror','').attr('src', info.repo + '/img/image_user_placeholder.svg');

		}
	};

	/**
	Gets a photoURL for the user

	@parm {Integer} UserID

	@return {String} 			new URL value to use
	*/
	this.GetProfilePicUrl = function(userID){
		var url = "";
	  if (userID < 0) {
			url = info.repo + "/img/image_user_placeholder.svg"
		}
		else {
			url = utils.GetBaseUrl() + utils.GetBaseAPIVersion() + "/users/" + userID + "/photo" + "?" + new Date().getTime();
		}
		return url;
	};




	/**
	Gets the thumbnail of the node based on the nodeID
	@param {Integer} NodeID
	@param {String} MimeType
	@param {String} Size

	@return {String}
	*/
	this.GetThumbnailImage = function(nodeID, mimeType, size) {
		var url;

		switch (mimeType) {
			case 'image/jpeg':
			case 'image/pjpeg':
			case 'image/jpg':
			case 'image/png':
			case 'image/gif':
			case 'image/bmp':
				url = utils.GetBaseUrl() + utils.GetBaseAPIVersion() + "/nodes/" + nodeID + "/thumbnail" + "?type=" + size;
				break;

			default:
				url = utils.FileIcon(mimeType, size);
				break;
		}

		return url;
	}

	this.ThumbnailSize = new function() {
		this.small = "small";
		this.large = "large";
	}

	/**
	Formats a download URL for a file
	@param {Integer} NodeID
	@param {Integer} VersionID

	@return {String}
	*/
	this.FormatDownloadFileURL = function(nodeID,versionID){
		versionID = utils.DefaultValue(versionID,0);
		return window.location.pathname + 'ContentChannel?nodeID=' + nodeID + '&vernum=' + versionID;

	}



	this.ClearObjectInfoArea = function()
	{
		$('#objectInfo').html('');
	}

//TODO add comments to the function , buttons css
	this.LoadFileTopButtons = function(){
		var fileButtons =[
						{	id: 'uploadButton',
								name: 'upload',
								textRight: T('LABEL.AddFile'),
								img: 'upload.png',
								classes:'topButton'
						},
						{	id: 'newFolderButton',
							name: 'newFolderButton',
							textRight:T('LABEL.NewFolder'),
							img: 'folder_icon.png',
							classes:'topButton'
						}];
		ui.LoadTemplateInEmptyElement("#wrappedButton_tmpl",fileButtons,$("#pageActions"));
		SelectionController.LoadMultiActionButton();
	}

	this.LoadSearchTopButtons = function(){
		$('#pageActions').empty();
	}

	this.LoadPageTabs = function(page){
		var pageTabs;
		switch(page)
		{
			case TAB.FILE:
				pageTabs =[
					{
						tabName: T('LABEL.AllFiles'),
						tabIcon: 'all_files24_white.png',
						tabId: 'allFiles',
						tabSelected: true,
						tabAddressValue: TAB.FILE+'?action=browse&id='+info.userRootFolderID+'&browseObject='+CONST_BROWSE_OBJECT.ALL
					},
					{
						tabName: T('LABEL.MyFiles'),
						tabIcon: 'my_files24.png',
						tabId: 'myFiles',
						tabSelected: true,
						tabAddressValue: TAB.FILE+'?action=browse&id='+info.userRootFolderID+'&browseObject='+CONST_BROWSE_OBJECT.MYFILES

					},
					{
						tabName: T('LABEL.IncomingShares'),
						tabIcon: 'shared_with_me24.png',
						tabId: 'incomingShares',
						tabSelected: false,
						tabAddressValue: TAB.FILE+'?action=browse&id='+info.userRootFolderID+'&browseObject='+CONST_BROWSE_OBJECT.INCOMINGSHARES
					},
					{
						tabName: T('LABEL.MyCSShares'),
						tabIcon: 'enterprise_content24.png',
						tabId: 'myCSShares',
						tabSelected: false,
						tabAddressValue: TAB.FILE+'?action=browse&id='+info.userRootFolderID+'&browseObject='+CONST_BROWSE_OBJECT.ENTERPRISE
					},
					{
						tabName: T('LABEL.MyCommunities'),
						tabIcon: 'my_communities24.png',
						tabId: 'myCommunities',
						tabSelected: false,
						tabAddressValue: TAB.FILE+'?action=browse&id='+info.userRootFolderID+'&browseObject='+CONST_BROWSE_OBJECT.SYSTEMSHARE
					}
				];
				break;
			case TAB.SEARCH:
				pageTabs =[
					{
						tabName: T('LABEL.SearchResults'),
						tabIcon: 'searchIcon.png',
						tabId: 'searchResult',
						tabSelected: true
						//tabAddressValue: TAB.FILE+'?action=browse&id='+info.userRootFolderID
					},
					{
						tabName: T('LABEL.ReturnToAllFiles'),
						tabIcon: 'returntoallfiles.png',
						tabId: 'returnToAllFiles',
						tabSelected: false,
						tabAddressValue: TAB.FILE+'?action=browse&id='+info.userRootFolderID
					}
				];
				break;
		}
		ui.LoadTemplateInEmptyElement("#leftColumnTabItem_tmpl",pageTabs,$("#leftColumn"));
	}

	/**
	Get the translated label text for
	*/

	this.GetSortLabelText = function(){

		var currentSortLabel="";

		switch(ui.GetBrowseSortOrder()){
			case CONST_SORT.SIZE:
				currentSortLabel = T('LABEL.Size');
				break;
			case CONST_SORT.DATE:
				currentSortLabel = T('LABEL.Date');
				break;
			default:
				currentSortLabel = T('LABEL.Name');
		}

		return currentSortLabel;
	};


	/**
	Prepare the areas before switching tab, generally used function by both tabs
	@param {String}	tab		the tab whose area is prepared
	**/
	this.PrepareAreasForTab = function(tab)
	{
		switch(tab)
		{
			case TAB.FILE:
				$('#breadcrumBar').show();
				$('#backupLevel').show();
				$('#itemsForSearchTab').empty().hide();
				$('#itemsForFileTab').empty().show();
				$('#centerColumn').css('margin-right', '250px');
				$('#centerColumnWrapper').css('min-width', '530px');
				break;
			case TAB.SEARCH:
				$('#breadcrumBar').hide();
				$('#backupLevel').hide();
				$('#itemsForFileTab').empty().hide();
				$('#itemsForSearchTab').empty().show();
				$('#centerColumn').css({'margin-right':'0px'});
				$('#centerColumnWrapper').css('min-width', '1000px');
				$('.searchCount').empty();
				break;
		}
		//clear the objectinfo area
		this.ClearObjectInfoArea();
		//clear the collaborators area
		Collaborators.ClearCollobaratorsArea();
	}

	/**
	 * This variable is used to store the current node ID;
	*/
	var _currentNodeID = info.userRootFolderID;

	/**
	This function will return the current node ID.

	@return {Integer}						object ID

	@public
	*/
	this.GetCurrentNodeID = function(){
		return _currentNodeID;
	};

	/**
	This function will set the current node ID.

	@public
	*/
	this.SetCurrentNodeID = function(id){
		if(typeof id === 'number' && !isNaN(id)){
			_currentNodeID = id;
		}else{
			_currentNodeID = parseInt($.address.parameter('id'), 10);
		}
	};

	/**
	This function set the breadcrumb

	@param {Array}	data	the breadcrumb data back from the server

	@public
	*/
	this.SetBreadcrumb = function(data)
	{

		var totalWidth = 0;
		var chopPosition = 2;

		//clone the data object in order to keep it unchanged in case it becomes cached
		var copyOfData = $.extend([], data);

		//clear the breadcrumb area first
		$('#breadcrumb').remove();

		//in admin mode, force the first item to the specified root, not the one the server provided
		if(info.isAdminModeRequested){
			var first = $(copyOfData).first();
			first.prop('nodeID', info.userRootFolderID);
		}

		//create a shortname that cuts the foldername down to 15
		$(copyOfData).each(function(){
				if (typeof this.name != 'undefined'){
					this.shortName = this.name.length > 18 ? this.name.substring(0,15) + '...' : this.name;
				}
		});

		utils.MarkLast(copyOfData);
		ui.LoadTemplatePreprend("#breadcrumb_tmpl", {breadcrumbItem: copyOfData}, '#breadcrumbWrapper');

		//maxWidth is the dynamically set to the size of the area for breadcrumbs
		var maxWidth = utils.DefaultValue($('#breadcrumb').width(), 530);

		$('#breadcrumb li').each(function(){
			totalWidth += $(this).width();
		});

		//While the width of the total breadcrumb area is > max chop off breadcrumb next to otsync
		if(totalWidth > maxWidth && maxWidth > 0)
		{
			var removedText = '> ';

			//add the ...>
			$('#breadcrumb').tmplItem().data.breadcrumbItem.splice(1,0, {shortName: "...", name: removedText, nodeID: null});
			$('#breadcrumb').tmplItem().update();

			//add the width of ...> to totalWidth
			totalWidth += $($('#breadcrumb li')[1]).width();

			while(totalWidth > maxWidth)
			{
				totalWidth -= $($('#breadcrumb li')[chopPosition]).width();

				if($('#breadcrumb').tmplItem().data.breadcrumbItem.length > 1)
				{
					removedText += $('#breadcrumb').tmplItem().data.breadcrumbItem[2].name + ' > ';
					$('#breadcrumb').tmplItem().data.breadcrumbItem.splice(2,1);
					chopPosition++;
				}
				else
				{
					break;
				}
			}
			$('#breadcrumb').tmplItem().data.breadcrumbItem[1].name = removedText;
			$('#breadcrumb').tmplItem().update();
		}

	}

	/**
	 * prepare the sort menu for thumbnail view
	 *
	 * @public
	 */
	this.sortMenu = function(){
		var returnValue =  {button:{classes: 'sortMenuButton'},textLeft: T('LABEL.SortBy'), options:[]};


			returnValue.options= [{
					linktext:  T('LABEL.Name'),
					classes:'sortDropdownItem',
					id:'sortName'},
					{
					linktext: T('LABEL.LastModifiedLowerCase'),
					classes:'sortDropdownItem',
					id:'sortLastModified'},
					{
					linktext: T('LABEL.Size'),
					classes:'sortDropdownItem',
					id:'sortSize'}
					];

			return returnValue
	}

	/**
	 * prepare the more menu for file
	 *
	 * @public
	 */
	this.moreMenuFile = function(isBrava, isReadOnly, isDeletable, isReservable, reservedBy, userName){
		var returnValue =  {button:{classes: 'moreMenuButton'},options:[]};
		returnValue.options = new Array();

		var isReserved = (reservedBy != null);
		var reservedByMe = (reservedBy == userName);

		returnValue.options.push({ linktext:  T('LABEL.Download'), classes:'objectDownload'});

		if(isBrava){
			returnValue.options.push({ linktext: T('LABEL.Brava'),classes:'objectBrava'});
		}

		if(!isReadOnly && (reservedByMe || !isReserved)){
			returnValue.options.push({ linktext: T('LABEL.AddVersion'), classes:'objectAddVersion'});
		}
		if (isReservable && !isReserved){
			returnValue.options.push({ linktext: T('LABEL.Reserve'), classes:'objectReserve'});
		}
		if (reservedByMe){
			returnValue.options.push({ linktext: T('LABEL.Unreserve'), classes:'objectUnreserve'});
		}
		if(!isReadOnly && (reservedByMe || !isReserved)){
			returnValue.options.push({ linktext: T('LABEL.Rename'), classes:'objectRename'});
		}

		returnValue.options.push({ linktext: T('LABEL.Copy'), classes:'objectCopy'});

		if(!isReadOnly && (reservedByMe || !isReserved)){
			returnValue.options.push({ linktext: T('LABEL.Move'), classes:'objectMove'});
		}
		if (info.canPublish && (reservedByMe || !isReserved)){
			returnValue.options.push({ linktext: T('LABEL.Publish'), classes:'objectPublishDestinationOption'})
		}

		returnValue.options.push({ linktext: T('LABEL.History'),classes:'objectHistory'});

		if (isDeletable && (reservedByMe || !isReserved)){
			returnValue.options.push({ linktext:  T('LABEL.Delete'), classes:'objectDelete'});
		}

			return returnValue
	}

	/**
	 * prepare the more menu for folder
	 *
	 * @param {Integer} sharedFolder		shared status of a folder (0=not shared, 1=shared & owner, 2=shared)
	 *
	 * @public
	 */
	this.moreMenuFolder = function (sharedFolder, isShared, isReadOnly, isRootShared, isShareable, isCopyable, isSystemShare){
		var menu = {button:{classes: 'moreMenuButton'},options:[]};

		if(isReadOnly){
			menu.options = [{
				linktext: T('LABEL.Copy'),
				classes:'objectCopy'},
				{
				linktext: T('LABEL.Publish'),
				classes:'objectPublish'},
				{
				linktext: T('LABEL.History'),
				classes:'objectHistoryFolder'}
			];

			// add this option only for root folder
			if(isRootShared){
				$.merge(menu.options,[{
					linktext:  T('LABEL.Remove'),
					classes:'objectDelete'
				}]);
			}

			// remove publish from the menu if they are not allowed to publish
			if (!info.canPublish || isSystemShare){
				var indexOfPublishInOptions = 1;
				menu.options.splice(indexOfPublishInOptions,1);
			}
			// remove copy from the menu if they are not allowed to copy
			if (!isCopyable){
				var indexOfCopyInOptions = 0;
				menu.options.splice(indexOfCopyInOptions,1);
			}
		}
		else if(sharedFolder !== CONST_SHAREDFOLDER.SHAREDNOTOWNER) // has the perm to move, rename and delete
		{
			menu.options = [{
				linktext: T('LABEL.Rename'),
				classes:'objectRename'},
				{
				linktext: T('LABEL.Copy'),
				classes:'objectCopy'},
				{
				linktext: T('LABEL.Move'),
				classes:'objectMove'},
				{
				linktext: T('LABEL.Publish'),
				classes:'objectPublish'},
				{
				linktext: T('LABEL.History'),
				classes:'objectHistoryFolder'},
				{
				linktext:  T('LABEL.Delete'),
				classes:'objectDelete'}
			];
			// remove publish from the menu if they are not allowed to publish
			if (!info.canPublish || isSystemShare){
				var indexOfPublishInOptions = 3;
				menu.options.splice(indexOfPublishInOptions,1);
			}
			// remove copy from the menu if they are not allowed to copy
			if (!isCopyable){
				var indexOfCopyInOptions = 1;
				menu.options.splice(indexOfCopyInOptions,1);
			}
		}
		else
		{
			menu.options = [{
				linktext: T('LABEL.Copy'),
				classes:'objectCopy'},
				{
				linktext: T('LABEL.Publish'),
				classes:'objectPublish'},
				{
				linktext: T('LABEL.History'),
				classes:'objectHistoryFolder'},
				{
				linktext:  T('LABEL.Remove'),
				classes:'objectDelete'}
			];
			// remove publish from the menu if they are not allowed to publish
			if (!info.canPublish || isSystemShare){
				var indexOfPublishInOptions = 1;
				menu.options.splice(indexOfPublishInOptions,1);
			}
			// remove copy from the menu if they are not allowed to copy
			if (!isCopyable){
				var indexOfCopyInOptions = 0;
				menu.options.splice(indexOfCopyInOptions,1);
			}
		}

		if(info.canShare && isShareable)
			menu.options.unshift({linktext: T('LABEL.Share'),classes:'objectShare'});
		return menu;
	}
	/**
	 * manages the notification of messages
	 * error message is closed by the user clicking the close button
	 * confiratmion message is closed automatically after 10 secs or by the user clicking the close button
	 *
	 * TODO: wait for mockup and then adjust template and css;
	 */
	this.MessageController = new function()
	{
		var _messageCount = 0;
		var _errorCount = 0;
		var _timeOut = 5 * 1000; //TODO: 10 seconds according to the macro story
		var _messageTimer = {};
		var self = this;
		/**
		 * display the error message
		 * @param {String}	errorText		The xlated error text to be displayed
		 * @public
		 */
		this.ShowError = function(errorText)
		{
			var errorID = 'error' + _errorCount;
			ui.LoadTemplatePreprend("#notification_tmpl", {messageType: 'error', messageID: errorID, text: errorText}, '#contentmain');
			var timer = setTimeout(function(){self.ClearMessage('#' + errorID);}, _timeOut);
			_messageTimer[errorID] = timer;
			_errorCount++;
		}

		/**
		 * display the  message
		 * @param {String}	messageText		The xlated message text to be displayed
		 * @public
		 */
		this.ShowMessage = function(messageText)
		{
			var msgID = 'message' + _messageCount;
			ui.LoadTemplatePreprend("#notification_tmpl", {messageType: 'message', messageID: msgID, text: messageText}, '#contentmain');
			var timer = setTimeout(function(){self.ClearMessage('#' + msgID);}, _timeOut);
			_messageTimer[msgID] = timer;
			_messageCount++;
		}

		/**
		 * display the upload processing information
		 *
		 * @param {String} text			The xlated message text
		 * @param {percent} text		The percentage of the process
		 * @returns {Object}			The dom object of the notification area
		 */
		this.ShowProcessInfo = function(text, percent)
		{
			var msgID = 'processInfo' + _messageCount;
			if($('#contentmain').find('#processInfo').length === 0)
			{
				$('#contentmain').prepend('<div id="processInfo"></div>');
			}

			var dom =  $("#processInfo_tmpl").template({messageID: msgID, text: text, percent: percent} );
			$('#processInfo').append(dom);
			_messageCount++;
			return dom;
		}
		/**
		 * clear the error message or message
		 * @param {String}	messageID		the id of the message to be cleared
		 * @public
		 */
		this.ClearMessage = function(messageID)
		{
			$(messageID).animate({"height": "toggle", "opacity": "toggle"}, 500, function(){$(this).remove();});
		}

		/**
		 * clear the timer on the message
		 * @param {String}	messageID		the id of the message to be cleared
		 * @public
		 */
		this.ClearTimer = function(messageID)
		{
			var timer = _messageTimer[messageID];
			clearTimeout(timer);
		}

		/**
		 * clear all the notifications
		 *
		 * @public
		 */
		this.ClearAllMessages = function()
		{
			$('.notification').remove();
		}

		/**
		 * add the click event on the close button
		 * NOTE: this could be done in addEvent in startup.js too; put it here to make things more organized
		 */
		$().ready(function(){
			$('body').delegate('.notificationOperation', 'click' ,function(){
				//clear the timer
				ui.MessageController.ClearTimer($(this).parents('.notification').attr('id'));
				// clear the message
				ui.MessageController.ClearMessage($(this).parents('.notification'));
			});
		});
	};

	/**
	 * singleton object to controll the dialog shadow
	 *
	 * @public
	 */
	this.DialogShadowController = new function()
	{
		var shadowID = 'dialogShadow';
		this.AddShadow = function(currentDialog, id)
		{
			id=id?id:shadowID;
			$('<div id="'+id+'" class="ui-widget-shadow ui-corner-all"></div>').css({
				'position': 'absolute',
				'top': currentDialog.position().top,
				'left': currentDialog.position().left,
				'height': currentDialog.height(),
				'width': currentDialog.width()
				}).appendTo($('body'));
		}
		this.RemoveShadow = function(id)
		{
			id=id?id:shadowID;
			$('#'+id).remove();
		}
	};


	/**
	 * toggle the item icon while in process
	 *
	 * @param {Integer/Array} sourceID	the ID(s) of the item
	 *
	 * @public
	 */
	var _indicatorRegistry = [];
	this.ToggleProcessingIndicatorForItemRow = function(sourceID)
	{

		if(typeof sourceID !== 'object')
		{
			sourceID = [sourceID];
		}

		$.each(sourceID, function(index, value){
			var itemRow = $('#browseFile-'+value);
			var itemIcon = itemRow.find('.itemIcon');
			if(_indicatorRegistry.indexOf(value)!==-1)
			{
				_indicatorRegistry.splice(_indicatorRegistry.indexOf(value), 1);
				itemIcon.removeClass('processIndicator');
				itemRow.removeClass('disabled');
				itemRow.find('.dropdown button').show();
			}
			else
			{
				_indicatorRegistry.push(value);
				itemRow.find('.dropdown button').hide();
				//remove the check status
				var checkBoxDom = $(itemRow).find('.itemCheckBox a');
				if($(checkBoxDom).tmplItem().data.checked === true)
				{
					SelectionController.ToggleCheckBox(checkBoxDom);
				}
				itemRow.addClass('disabled');
				itemIcon.addClass('processIndicator');
			}
		});
	};
	/**
	 * this function set the process indicator for the items currently being processed
	 * should only be called when a new page is loaded
	 *
	 * @public
	 */
	this.DisplayProcessingIndicatorForItemRow = function()
	{
		$.each(_indicatorRegistry, function(index, value){
			var itemRow = $('#browseFile-'+value);
			//make the item disabled and highlighted
			itemRow.addClass('disabled');
			itemRow.addClass('browseItemHover');

			var itemIcon = itemRow.find('.itemIcon');
			itemIcon.addClass('processIndicator');

		});
	};

	this.Authenticate = function()
	{
		//TODO: gotta figure out login
		//parent.webaccess.showLoginContainer(true);
		var currentURL = window.location.href;

		//old login stuff
		if($.address.path()!== "/LOGIN"){
			info.nexturl = $.address.value();
		}

		if(typeof info.nexturl === 'undefined' || info.nexturl.length < 1) {
			info.nexturl = "/";
		}

		$.address.value(TAB.LOGIN);

		$.when(startup.PrepareAuthWithLogin())
			.pipe(ui.Redirect);

	};

	this.Redirect = function()
	{


			startup.loadFrame();
			$.address.value(info.nexturl);

	};

	this.RedirectToCurrentFileTab = function(){

		$.address.value(TAB.FILE + "?action=BROWSE&id=" + ui.GetCurrentNodeID() );
	}



	var showUserActions = false;

	this.showUserActionsMenu = function() {
		this.showUserActions = true;
		$('#userActions ul').css('display', 'block');
		$('#userActions').addClass('active');
	}
	this.hideUserActionsMenuDelayed = function() {
		this.showUserActions = false;
		// set the timeout to allow for another item to come into focus,
		// and if after 100ms no items have come into focus, hide the menu
		setTimeout('ui.hideUserActionsMenu()', '100');
	}
	this.hideUserActionsMenu = function() {
		if (!this.showUserActions) {
			$('#userActions ul').css('display', 'none');
			$('#userActions').removeClass('active');
		}
	}


	// This method is used to reset the page height when browsing from a page with a large height
	// to a page with a smaller height
	this.ResetPageHeight = function() {
		$("#leftColumn").height(0);
		ui.ManagePageHeight();
	}

	this.ManagePageHeight = function() {
		var headerHeight = $("#header").height() + $("#toolBar").height();

		if ($(window).height() > $(document).height()) {
			$("#leftColumn").height($(window).height() - headerHeight);
		}
		else {
			// subtract 4px at the bottom due to 100% height quirk in IE
			$("#leftColumn").height($(document).height() - headerHeight - 4);
		}
	};

	this.drawDiskUsageArea =  function(usage,diskLimit) {

		if(typeof(diskLimit) != "undefined" && typeof(usage) != "undefined" && diskLimit != 0)
		{
			var percentage = (usage / diskLimit) * 100 ;

			if(diskLimit > 1024)
			{
				diskLimit = (diskLimit /1024).toFixed(2) + T('LABEL.Disk_limit_GB');
			}
			else
			{
				diskLimit = diskLimit + T('LABEL.Disk_limit_MB');
			}
			$('#DiskUsageDisplayHeaderWrapper').css('display', 'block');
			ui.LoadTemplateInEmptyElement("#diskUsageTemplate_tmpl",{ usage: percentage.toFixed(2), limit: diskLimit },"#disk");
			percentage = percentage>100? 100 : percentage;
			$( "#diskProgressBar" ).progressbar({ value: parseInt(percentage) });
			$('#diskUsageWrapper').css('display', 'block');
		}
	};

	/**
	Formats a Brava URL for a file
	@param {Integer} NodeID

	@return {String}
	*/
	this.FormatBravaURL = function(nodeID){

		var csUrl = document.createElement('a');
		csUrl.href = info.contentServerURL;

    var csPathName = csUrl.pathname.charAt(0)=='/'?csUrl.pathname:'/'+csUrl.pathname;

		return csPathName + '?func=brava.bravaviewer&nodeid='+nodeID+'&OpenInNewWin=_blank';
	};
};







var TreeView = function(config){
	var self = this;

	var CONST_TREETMPL = {COPYFOLDERITEM: 'copyFolderItem', MOVEFOLDERITEM: 'moveFolderItem', MULTICOPY: '#multiCopyItem_tmpl', MULTIMOVE: 'multiMoveItem' };

	//default config parameters
	var defaultConfig = {
		wrapperID: 'treeViewWrapper',
		wrapperTitle: '',
		treeID: 'treeID',
		treeTemplate: 'shareFolderItem',
		parent: 'body'
		};

	config = $.extend({},defaultConfig, config);


	//initialization
	var tmplVar = {
		wrapperID: config.wrapperID,
		wrapperTitle: config.wrapperTitle,
		treeID: config.treeID,
		//add this field to the tmplVar of the root node, in order to be consistent with the tmplVar for other nodes
		DATAID: info.userRootFolderID
		};
	ui.LoadTemplate("#itemTreeTemplate_tmpl", tmplVar, config.parent);


	//the dom of the wrapper, usually the dialog div
	var wrapperDom = $('#'+config.wrapperID);

	//the dom of the tree view root: e.g. shareTree, copyTree
	var treeViewDom = $('#'+config.treeID);

	//the dom of the currently selected node
	var currentTargetDom = treeViewDom;

	/**
	 * load data From Server
	 * @param {String}	rootFolderID		the root of the tree
	 * @param {Object}	rootFolderDom		the Dom element to which the tree is appended
	 *
	 * @public
	 */
	this.LoadDataFromServer = function(rootFolderID, rootFolderDom)
	{
		rootFolderID = rootFolderID?rootFolderID: info.userRootFolderID;
		//update instance variable to store the current root
		currentTargetDom = rootFolderDom?rootFolderDom: treeViewDom;
		//store this(the current object) to be used later in response
		currentTargetDom.data('treeViewObject', this);
		request.GetContentsForSelection(rootFolderID, currentTargetDom);
	}

	/**
	 * draw the tree view based on different templates
	 * supported tempaltes: shareFolderItem, copyFolderItem
	 *
	 * @param {Array}	data		the data back from the server, array of objects
	 *
	 * @public
	 */
	this.DrawTree = function(data)
	{
		var folderContents = data.contents;
		var ul = currentTargetDom.children('ul');
		var items;
		switch(config.treeTemplate)
		{
			case CONST_TREETMPL.COPYFOLDERITEM:
			case CONST_TREETMPL.MOVEFOLDERITEM:
				//need to add a variable ISSELF to draw the tree for copy
				for(var i in folderContents)
				{
					if(wrapperDom.data('sourceItemData').DATAID == folderContents[i].DATAID )
					{
						folderContents[i].ISSELF = true;
					}else{
						folderContents[i].ISSELF = false;
					}
					if(wrapperDom.data('sourceItemData').PARENTID == folderContents[i].DATAID)
					{
						folderContents[i].ISPARENT = true;
					}
					else
					{
						folderContents[i].ISPARENT = false;
					}
				}

				items = $(config.treeTemplate).template( folderContents);
				break;
			case CONST_TREETMPL.MULTICOPY:
				for(var i in folderContents)
				{
					if(wrapperDom.data('multiCopyIDs').indexOf(folderContents[i].DATAID)!==-1)
					{
						folderContents[i].ISSELF = true;
					}else{
						folderContents[i].ISSELF = false;
					}
					if(wrapperDom.data('parentID') == folderContents[i].DATAID )
					{
						folderContents[i].ISPARENT = true;
					}
					else
					{
						folderContents[i].ISPARENT = false;
					}
				}
				items = $(CONST_TREETMPL.MULTICOPY).template( folderContents);

				break;
			case CONST_TREETMPL.MULTIMOVE:
				for(var i in folderContents)
				{
					if(wrapperDom.data('multiMoveIDs').indexOf(folderContents[i].DATAID)!==-1)
					{
						folderContents[i].ISSELF = true;
					}else{
						folderContents[i].ISSELF = false;
					}
					if(wrapperDom.data('parentID') == folderContents[i].DATAID )
					{
						folderContents[i].ISPARENT = true;
					}
					else
					{
						folderContents[i].ISPARENT = false;
					}
				}
				//multimove and multicopy use the same template
				CONST_TREETMPL.MULTICOPY
				items = $(CONST_TREETMPL.MULTICOPY).template( folderContents);
				break;
		}

		ul.append(items);

		// we just altered the contents of the tree window, so
		// we need to make sure we reset the selectin bar to keep
		// it highlighting the correct item


		this.UpdateSelectionBarInTreeView('#'+config.wrapperID+' .selectedBar','#'+ config.treeID+' .selected');


		// mark the target as either open or containing nochildren
		// so that it displays correctly

		if(currentTargetDom.children('ul').children('li').length > 0){
			currentTargetDom.addClass('open').data('loaded',true);
		}else{
			currentTargetDom.addClass('nochildren').data('loaded',true);
		}
	}

	/**
	Updates the selection bar in a tree view to be positioned behind the selected item

	@param {String} barSelector jquery selector used to select the bar
	@param {String} selectedItemSelector jquery selector used to select the selected item
	*/
	this.UpdateSelectionBarInTreeView = function(barSelector,selectedItemSelector){
		var selectedItem = $(selectedItemSelector);
		if(selectedItem.length === 0)
		{
			$(barSelector).addClass('hidden');
			return;
		}

		var width = selectedItem.width() +  selectedItem.offset().left - $(barSelector).offset().left;
		$(".selectedBar").width(width);


		$(barSelector).offset({top:selectedItem.offset().top-2}).removeClass('hidden');
		var height = selectedItem.find('ul').length ? selectedItem.children('.nameForFolder').height(): selectedItem.height();
		height += 4;
		$(barSelector).height(height);

	}

	/**
	 * get the selected item from the tree
	 * @returns {Object} 	The dom(jQuery) of the selected item;
	 *
	 * @public
	 */
	this.GetSelected = function()
	{
		return treeViewDom.find('.selected');
	}

	/**
	 * clear the tree before loading
	 *
	 * @public
	 */
	this.RemoveTree = function()
	{
		treeViewDom.children('ul').empty();
	}

	//add click event to the root node
	$('body').delegate('#'+config.treeID+' > li', 'click', function(){
		var item = $(this);
		var selectable = item.hasClass('selectable')

		if (selectable){
			$('#'+config.treeID+' .selected').toggleClass('selected');
			item.toggleClass('selected');
		}
		self.UpdateSelectionBarInTreeView('#'+config.wrapperID+' .selectedBar','#'+config.treeID+' .selected');
		});

	//add click event to other nodes
	$('body').delegate('#'+config.treeID+' ul li:not(.noselect)','click',function(){

			var item = $(this);
			var selectable = item.hasClass('selectable')

			if (selectable){
				$('#'+config.treeID+' .selected').toggleClass('selected');
				item.toggleClass('selected');
			}

			if (!item.data('loaded')){
				// not loaded, so load it
				self.LoadDataFromServer(item.tmplItem().data.DATAID, item);
			}else{
				if( item.hasClass('open')){
					// open and loaded, so close it
					item.removeClass('open');
					item.children('ul').hide();
				}else{
					// closed and loaded, so open it
					item.addClass('open');
					item.children('ul').show();
				}
			}

			self.UpdateSelectionBarInTreeView('#'+config.wrapperID+' .selectedBar','#'+config.treeID+' .selected');

			// prevent event from continuing
			return false;
		}); // end folder select function

	// dummy event to prevent clicking on a noselect
	// child from firing parent's event
	$('body').delegate('#'+config.treeID+' ul li.noselect','click',function(){
		return false;
	});
}
