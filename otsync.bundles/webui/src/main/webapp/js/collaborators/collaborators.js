var Collaborators = new function(){
    
    var _maxCollaboratorsToDislay = 7; // set maximum allowed number of collaborators to display in the Collaborators Area
	this.collaboratorsList = [];
	
	this.AddEvents = function() {
		
		var bodyTag = $("body");

		bodyTag.delegate('.collaborator.all .cancelCollaboratorIcon > a', 'click', function(e){
			
			var itemTemplate = $(this).parents('.collaborator').tmplItem();
			
			if(itemTemplate.data.MarkForAdd){
				Collaborators.removeCollaboratorFromList(itemTemplate.data.UserID);
				Collaborators.DrawCollaboratorsArea();
			}
			else{
				if(itemTemplate.data.MarkForDelete){
					itemTemplate.data.MarkForDelete = false;
					itemTemplate.update();
					//enable the select box if removing MarkForDelete
					SelectBox(itemTemplate.data.SelectID, true);
				}
				else{
					itemTemplate.data.MarkForDelete = true;
					itemTemplate.update();
					
				}
			}
			
		});
				
		bodyTag.delegate('#editAllCollaboratorsButton', 'click', function(e){
			e.stopPropagation();
			Collaborators.editAllCollaboratorsDialog.dialog('open');
		});
		
		bodyTag.delegate('#unshareAllButton', 'click', function(e){
			$('#unshareAllCancelButton').focus();
			$(Collaborators.collaboratorsList).each( function(index, value){
				if(value.MarkForAdd){
					Collaborators.removeCollaboratorFromList(value.UserID);
				}
				else if(value.UserID !== value.OwnerID) {
					value.MarkForDelete = true;
				}
			});
			Collaborators.DrawCollaboratorsArea();
		});
	
		bodyTag.delegate('.collaborator .cancelShareIcon > a', 'click', function(){
			var targetObject = $(this);
			var dialogTitle = targetObject.parents(".collaborator").find(".shareUserName").text();
			// commented out older version of dialog title that allowed html but is not supported from jQueryUI 1.10 and up.
			//$('#actionConfirmation').dialog( "option", "title", $('<div class="dialogWordWrap"/>').attr('title',dialogTitle).text(utils.TrimLongString(dialogTitle,35)).appendTo($('<div>')).parent().html());
			$('#actionConfirmation').dialog( "option", "title", utils.TrimLongString(dialogTitle,35));
			$("#confirmationMessage").text(T('LABEL.ConfirmUnShareWith', {name: htmlEncode(targetObject.parents(".collaborator").find(".shareUserName").text()) }));
			$("#actionConfirmation").dialog('option', 'buttons', {
				"Cancel" : function() {
					$(this).dialog("close");
				},
				"Unshare" : function() {
					$(this).dialog("close");
					var nodeId = targetObject.parents('.collaborator').tmplItem().data.DataID;
					var userName = targetObject.parents('.collaborator').tmplItem().data.Name;
					Collaborators.LoadCollaboratorUpdatingImage();
					Share.UserUnshare(nodeId, userName);
				}
			});
			$("#actionConfirmation").dialog("open");
		});	
		
		$("body").delegate("#saveCollaboratorsButton", "keydown", function(e) {
			if (e.keyCode == 9 && !e.shiftKey) {		//tab key, no shift
				e.preventDefault();
				$("#unshareAllButton").focus();
			}
		});
		
		$("body").delegate(" .select-option", "click", function(e) {
			
			var selectBoxID = $(this).attr('selectboxid');
			var itemTemplate = $('#' + selectBoxID ).tmplItem();
			itemTemplate.data.ShareType = $(this).attr('value');
			
			//update the template if this is a collaborator select-box
			if( Collaborators.editAllCollaboratorsDialog.dialog('isOpen') && selectBoxID !== 'dropdownShareTypeEditAll'){
				if(itemTemplate.data.ShareType == itemTemplate.data.origShareType){
					itemTemplate.data.MarkForEdit = false;
				}
				else if(!itemTemplate.data.MarkForAdd){
					itemTemplate.data.MarkForEdit = true;
				}
				$(this).parents('.collaborator').tmplItem().update();
				SelectBox(selectBoxID, true);
			}
			else{
				itemTemplate.update();
				SelectBox(selectBoxID, true);
			}
			
			$('#' + selectBoxID + ' a').focus();
			
		});
		
		$("body").delegate(".restoreCollaboratorBtn a", "click", function(e) {
			
			var itemTemplate = $(this).tmplItem();
			itemTemplate.data.MarkForDelete = false;
			itemTemplate.update();
			SelectBox(itemTemplate.data.SelectID, true);
			
		});
	}
	/*
	This function will remove the unshared user from the UI. First animate it off, and then remove the DOM.

	@param {String} userName

	@public
	*/
	this.UserUnshareUI = function(userName)
	{
		var count = 0;
	
		if($("#editCollaborators").parents(".ui-dialog").is(":visible") ){
			var collaborator = $('#allCollaborators .collaborator[username="'+userName+'"]');
		}
		else{
			var collaborator = $('#collaborators .collaborator[username="'+userName+'"]');
		}
		
		var newFocusObj = collaborator.next().find('a');
		// if current element is the last child we have to focus on a button
		if( newFocusObj.length === 0 )
		{
			if($('#unshareAllCloseButton').parents('.dialogButton').is(":visible")){
				newFocusObj = $('#unshareAllCloseButton');
			}
			else{
				newFocusObj = $('#unshareAllCancelButton');
			}
		}
		collaborator.animate({"height": "toggle", "opacity": "toggle"}, 500, function(){
			$(this).remove();			
			if($("#editCollaborators").parents(".ui-dialog").is(":visible") )
			{
				newFocusObj.focus();
			}
			else{
				Collaborators.DrawCollaboratorsArea();
			}
		});
	
	};
	
	this.ClearCollobaratorsArea = function()
	{
		$('#shareInfo').html('');
	};	
	
	/*
	* This function will add the updating image to the collaborators section of the left side of file tab
	* The image is cleared in the response.GetSharedObjectInfo
	*/
	
	this.LoadCollaboratorUpdatingImage = function(){
		ui.LoadTemplateInEmptyElement("#shareInfoTemplate_tmpl", {SelectID: 'dropdownShareTypeInvite', ShareType: SHARETYPE.READWRITE}, "#shareInfo");
        ui.LoadTemplate("#loadingImage_tmpl",null,'#collaborators');
	};
	
	/**
	This function will add the search user autocomplete to a textbox or textarea that is input

	*/
	this.AddSearchUserAutocomplete=function(inputid) {

	  /* If on file tab must use ui.GetCurrentNodeID() to get nodeid
		   because the nodeid will not be in the template data if the folder is not currently shared
		*/
		var nodeID = info.currentTab === TAB.FILE ? ui.GetCurrentNodeID() : $('#collaborators > .collaborator').tmplItem().data.DataID;

		if($(inputid).length<=0)
		{
			return;
		}
		$(inputid).autocomplete({
			source: function(arequest,aresponse) {
				request.SearchUser(arequest.term,nodeID,externalShare.SearchUserCallback(aresponse,inputid));
			},
			minLength: 2,
			select: function(event,uiItem) {

				var userName=uiItem.item.Name;
				var exists=false;

				//Check the collaboratorsList to see if user already exists
				for( var key in Collaborators.collaboratorsList){
					
					if(Collaborators.collaboratorsList[key].Name===userName){	
						exists=true;
					}
				}
				
				if(!exists && uiItem.item.ID !== info.userID) {
					//Set shareType to value of dropdown
					var shareType = $(inputid).siblings('.select-box').find('.select-value').attr('value');
					shareType = shareType !== undefined ? shareType : 2;
					uiItem.item.DataID = nodeID;
					
					//If entering user in EditCollaborators dialog mark user for add
					if(inputid === '#inviteeinputEditCollaborators') {
						
						var newUser = {};
						newUser.Name = uiItem.item.Name;
						newUser.FirstName = uiItem.item.FirstName;
						newUser.LastName = uiItem.item.LastName;
						newUser.PhotoURL = uiItem.item.PhotoURL;
						newUser.photoURL = uiItem.item.PhotoURL;
						newUser.UserID = (uiItem.item.userID) ? uiItem.item.userID : uiItem.item.ID;
						newUser.UserName = uiItem.item.Name;
						newUser.IsExternalUser = false;
						newUser.DisplayName = uiItem.item.DisplayName;
						newUser.dropDown = {textLeft: T('LABEL.Pending'),isOwner: true, classes:'pending' };
						newUser.ShareStatus = 0;
						newUser.IsOwner = 0;
						newUser.OwnerID = info.userID;
						newUser.IsReadOnly = shareType == SHARETYPE.READONLY;
						newUser.ShareType = shareType;
						newUser.SelectID = 'dropdownShareType' + uiItem.item.UserID;
						newUser.IsExternalUser = uiItem.item.hasOwnProperty("IsExternalUser") && uiItem.item.IsExternalUser;
						Collaborators.addCollaboratorInitalState(newUser);
						newUser.MarkForAdd = true;
						
						Collaborators.collaboratorsList.push(newUser);
						Collaborators.DrawCollaboratorsArea();
						
					}
					else{
						var message = $('#inviteMessageInputSidebar').val();
						Share.UserShare(nodeID,userName,shareType,message,uiItem.item);
					}
				}
			},
			open: function() {

				$("ul.ui-menu").width( $(this).innerWidth() ); // dynamically set the width from parent
				
				if ( $(this).is("#inviteeinputEditCollaborators")){
					
					 var styles = {
						left: "40px"
					};
					
					$("ul.ui-menu").css(styles);
				}
				
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close: function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		})
		.data( "ui-autocomplete" )._renderItem = function( ul, item ) {

			ul.addClass('searchUserAutoComplete');

			if(typeof item.IsExternalUser === "undefined" || !item.IsExternalUser ){
				return $( "<li></li>" )
					.data( "ui-autocomplete-item", item )
					.append( "<a class='AutoCompDisplay'><div class='shareUserImage AutoCompImg'><img src=" + ui.GetProfilePicUrl(item.ID) + " onerror='ui.MissingUserImg(this,false);'/></div><div class='AutoCompName autoCompSmall'>" + htmlEncode(item.label) + "</div><br style='clear: both;'></a>" )
					.appendTo( ul );
			}
			else{

			return $( "<li></li>" )
				.data( "ui-autocomplete-item", item )
					.append( "<a class='AutoCompDisplay'><div class='shareUserImage AutoCompImg'><img src=" + info.repo + "/img/image_user_placeholder.svg" + " /></div><div class='AutoCompName autoCompSmall'>" + htmlEncode(item.label) + "</div><br style='clear: both;'></a>" )
				.appendTo( ul );
			}
		};

	};
	
	/**
	This function will sort the data from GetSharedObjectInfoResponse.  It will sort by Owner First, accepted share, then pending share

	@param		  {Object}	a,b
	@paramFeature {Integer} DataID			object ID
	@paramFeature {String} FirstName		user first name
	@paramFeature {String} FolderName		object name
	@paramFeature {Integer} IsOwner			1=is the object owner
	@paramFeature {Integer} IsReadOnly		0=read/write, 1=read-only
	@paramFeature {String} LastName			user last name
	@paramFeature {String} LastUpdate		object modified date
	@paramFeature {String} Name				user login name
	@paramFeature {Integer} OwnerID			object owner ID
	@paramFeature {String} photoURL			URL to user image
	@paramFeature {Integer} ShareStatus		0=pending share, 1=accepted share
	@paramFeature {Integer} UserID			user ID
	*/
	this.sortData = function(a,b) {
		var order=b.IsOwner-a.IsOwner;
		if(order==0) {
			//Put pending users First
			order=a.ShareStatus-b.ShareStatus;
			if(order==0 && a.LastName !== b.LastName && a.LastName !== null && b.LastName !== null) {
				//Sort by lastname if not null and not equal
				order=b.LastName>=a.LastName ? -1: 1;
				if(order==0) {
					order=b.Name>=a.Name ? -1 : 1;
				}
			}
			else if(order==0){
				//if lastnames are equal or null then sort by username which is always unique
				order=b.Name>=a.Name ? -1 : 1;
			}
			
		}
		return order;
	};
	this.addCollaboratorInitalState = function (collaboratorItem) {
		
		collaboratorItem.MarkForAdd = false;
		collaboratorItem.MarkForDelete = false;
		collaboratorItem.MarkForEdit = false;
		collaboratorItem.CollaboratorIndex = null;
	};
	
	this.removeCollaboratorFromList = function (UserID) {
		
		$(Collaborators.collaboratorsList).each( function(index, value){
			if (value.UserID == UserID) {
				Collaborators.collaboratorsList.splice(index, 1);
			}
		});
		
	};
	
	this.cancelAllUnsaved = function() {
		$(Collaborators.collaboratorsList).each( function(index, value){
			
			value.MarkForDelete = false;
			if(value.MarkForAdd){
				Collaborators.removeCollaboratorFromList(value.UserID);
			}
			else if(value.MarkForEdit){
				value.ShareType = value.origShareType;
				value.MarkForEdit = false;
			}
			
		});
	};
	
	this.DrawCollaboratorsArea = function (){
		var currentUserIsOwner = $('#objectInfoName').tmplItem().data.isShareable;
		var numOfCollaborators = 0;
		var shareInfoTmplVar = {};
		
		if( currentUserIsOwner ){
			shareInfoTmplVar = {shareInvitation: currentUserIsOwner};
		}else{
			shareInfoTmplVar = {};
		}
		//Save the last state of the dropdown
		shareInfoTmplVar.ShareType = $('#dropdownShareTypeInvite .select-value').attr('value') == undefined ? SHARETYPE.READWRITE : $('#dropdownShareTypeInvite .select-value').attr('value');
		
		//Add select-box id to template
		shareInfoTmplVar.SelectID = 'dropdownShareTypeInvite';
		ui.LoadTemplateInEmptyElement("#shareInfoTemplate_tmpl", shareInfoTmplVar, "#shareInfo");
		SelectBox('dropdownShareTypeInvite', true);
		Collaborators.collaboratorsList.sort(Collaborators.sortData);
		
		var lastPendingSet=false;
		for (var i = 0; i < Collaborators.collaboratorsList.length; i++){
			
			if(!Collaborators.collaboratorsList[i].IsOwner && !Collaborators.collaboratorsList[i].MarkForAdd){
				Collaborators.collaboratorsList[i].CollaboratorIndex = numOfCollaborators++;
			}
			if(Collaborators.collaboratorsList[i].ShareStatus === 1 && !lastPendingSet && i > 0 && i < Collaborators.collaboratorsList.length) {
				Collaborators.collaboratorsList[i-1].LastPending = true;
				lastPendingSet = true;
			}
			else{
				Collaborators.collaboratorsList[i].LastPending = false;
			}
		};
		// update edit all dialog if it is open
		if(Collaborators.editAllCollaboratorsDialog.dialog('isOpen')){
			ui.LoadTemplateInEmptyElement("#collaboratorAll_tmpl", Collaborators.collaboratorsList, "#allCollaborators");
			ui.LoadTemplateInEmptyElement("#objectInfoDetailsDlgTemplate_tmpl", $('#objectInfoDetails').tmplItem().data, '#editCollaboratorsObjectInfo');
		}
		
		for (var i = 0; i < Collaborators.collaboratorsList.length; i++){
			SelectBox("dropdownShareType" + Collaborators.collaboratorsList[i].UserID, true);
		};

		ui.LoadTemplate("#collaborator_tmpl",Collaborators.collaboratorsList,"#collaborators");
		
		// Add button for Edit All
		if(currentUserIsOwner){
			ui.LoadTemplate("#button_tmpl",{textRight:T('LABEL.EditAllCollaborators',{ number: numOfCollaborators  } ), id:'editAllCollaboratorsButton'},"#editAllCollaborators");
		}
		else{
			ui.LoadTemplate("#button_tmpl",{textRight:T('LABEL.ViewAllCollaborators',{ number: numOfCollaborators  } ), id:'editAllCollaboratorsButton'},"#editAllCollaborators");
		}
		
		Collaborators.AddSearchUserAutocomplete("#inviteeinput");		
		
	};
};
