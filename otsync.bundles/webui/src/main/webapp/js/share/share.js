/**
This object is responsible for sending requests to OTSync.

The way this object is constructed allows JavaScript to have private and public functions but only works as a singleton.

Public functions notation:
	this.MyPublicFunction

Private function notation:
	var _MyPrivateFunction
	
	
// variables
sharingRequests
maxRequests
_showShareRequests

// methods
AddEvents
_sortData
DecrementAndUpdateShareSummary

// requests
_AcceptSharingRequest
AcceptSharingRequest
_RejectSharingRequest
RejectSharingRequest
__BrowseSharedObjects
_BrowseSharedObjects
_BrowseSharedObjectsMore
BrowseSharedObjects
BrowseSharedObjectsMore
_CountPendingShareRequests
_GetPendingShareRequests
_InviteUser
_InviteUsers
_UninviteUser
_UnshareObject
GetPendingShareRequests
GetPendingShareRequestSummary
ShareNewFolder
ShareObject
UnshareObject
UserShare
UserUnshare
CountPendingShareRequests

// responses
AcceptSharingRequestResponse
BrowseSharedObjectsResponse
CountPendingShareRequestsResponse
GetPendingShareRequestsResponse
GetPendingShareRequestSummaryResponse
RejectSharingRequestResponse
ShareNewFolderResponse
ShareObjectResponse
UnshareObjectResponse
UserShareResponse
UserUnshareResponse


//ui
UpdateRequestNotification
_GetShareRequest
FadeShareRequest
MarkRequestAcceptSuccess
MarkRequestRejectSuccess
ConfirmRejectSharingRequest
CancelShareReject
InitializePendingShareRequest
AddLeftShareButton
ModifyShare
UpdateLeftShareInfo
showShareRequestsMenu
hideShareRequestsMenuDelayed
hideShareRequestsMenu

**/

var Share = new function() {

	var _showShareRequests = false;		
	this.maxRequests = 5;
	this.sharingRequests = null;
	
	this.AddEvents = function() {
		var bodyTag = $("body");

        bodyTag.delegate('.addNewShare', 'click', function(){
            $.address.value(TAB.FILE+'?action=addshare&id='+ ui.GetCurrentNodeID()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
        });

		bodyTag.delegate('#adduser','click',function(){
			displayUsers($('#shareFolderUserInput').val());
		});


        bodyTag.delegate('.removeShareUser', 'click', function () {
            utils.RemoveIfExists($(this).tmplItem().data.UserName, $('#usersList').tmplItem().data.usersListData, 'UserName');
            $('#usersList').tmplItem().update();

			if($('#usersList').children().length===0){				
				$('#usersList').html(T('LABEL.NoUsersSelected'));
			}

            $('#shareFolderUserInput').focus();

        });

        bodyTag.delegate('.objectShare', 'click', function(e){
            
			if($(".objectShare").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;

            Browse.SetCurrentFolderInfo(data);
            $.address.value(TAB.FILE+'?action=addshare&id='+ data.DATAID+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
			e.stopPropagation();
        });

		bodyTag.delegate('#shareRequest a', 'focus', function(){
			Share.showShareRequestsMenu();
		});
		bodyTag.delegate('#shareRequest', 'mouseover', function(){
			Share.showShareRequestsMenu();
		});
		bodyTag.delegate('#shareRequest a', 'mouseover', function(){
			Share.showShareRequestsMenu();
		});
		bodyTag.delegate('#shareRequest a', 'blur', function(){
			Share.hideShareRequestsMenuDelayed();
		});
		bodyTag.delegate('#shareRequest', 'mouseout', function(){
			Share.hideShareRequestsMenuDelayed();
		});
		bodyTag.delegate('#shareRequest a', 'mouseout', function(){
			Share.hideShareRequestsMenuDelayed();
		});
		
		bodyTag.delegate('#shareRequestSummary .acceptShare', 'click', function(event){
      event.preventDefault();
			Share.AcceptSharingRequest($(this).attr('dataid'), 'menu');
		});
		bodyTag.delegate('#shareRequestSummary .rejectShare', 'click', function(event){
      event.preventDefault();
			Share.ConfirmRejectSharingRequest('#shareRequest', $(this).attr('dataid'));
		});
		bodyTag.delegate('#shareRequestSummary .rejectConfirm', 'click', function(){
			Share.RejectSharingRequest($(this).attr('dataid'), 'menu');
		});
		bodyTag.delegate('#shareRequestSummary .rejectCancel', 'click', function(){
			Share.CancelShareReject('#shareRequest', $(this).attr('dataid'));
		});
		
		bodyTag.delegate('#seeAllSharingRequests .acceptShare', 'click', function(event){
      event.preventDefault();
			Share.AcceptSharingRequest($(this).attr('dataid'), 'dialog');
		});
		bodyTag.delegate('#seeAllSharingRequests .rejectShare', 'click', function(event){
      event.preventDefault();
			Share.ConfirmRejectSharingRequest('#shareRequestFull', $(this).attr('dataid'));
		});
		bodyTag.delegate('#seeAllSharingRequests .rejectConfirm', 'click', function(){
			Share.RejectSharingRequest($(this).attr('dataid'), 'dialog');
			$(".seeAllSharingRequestsDialog a").first().focus();
		});
		bodyTag.delegate('#seeAllSharingRequests .rejectCancel', 'click', function(){
			Share.CancelShareReject('#shareRequestFull', $(this).attr('dataid'));
			$(".seeAllSharingRequestsDialog a").first().focus();
		});
		
		bodyTag.delegate('#shareRequestMenuBottomLink', 'click', function(){
			Share.seeAllShareRequestsDialog.dialog('open');
		});
	}
	

	this.FadeShareRequest = function(elementID, context) {
		$(elementID).animate({"height": 0, "min-height": 0, "padding-top": 0, "padding-bottom": 0}, 500, function() { $(this).remove(); });
		
		if ((Share.sharingRequests.length) <= Share.maxRequests) {
			$("#shareRequestMenuBottom").animate({"height": 0, "min-height": 0, "padding-top": 0, "padding-bottom": 0}, 500, function() { $(this).remove(); });
		}
		
		if (Share.sharingRequests.length == 0) {
			$(".shareRequest").hide();
		}

		if (context == "menu") {
			for (var i in Share.sharingRequests) {
				if (Share.sharingRequests[i].hidden) {
					Share.sharingRequests[i].hidden = false;
					$("#shareRequest" + Share.sharingRequests[i].DataID).slideDown(500);
					break;
				}
			}
		}
	}
	

	// UI methods
	
	/**
	This function initializes and updates share request notification.
	*/
	this.UpdateRequestNotification = function(addRequest){

		var totalRequest;
		var highestRequest=10;

		addRequest=utils.DefaultValue(addRequest,0);
		totalRequest = parseInt($("#shareRequestCount").attr('title'),10);
		
		totalRequest = totalRequest + addRequest;

		$('#shareRequestMenuBottomLink').html(T('LABEL.SeeAllXNotifications', {total: totalRequest}));

		if(totalRequest<=0) {
			$("#shareRequestCount").css( "display", 'none');
		}
		else if(totalRequest<highestRequest){
			$(".shareRequest").css( "display", 'block' );
			$("#shareRequestCount").attr('class', 'shareRequestCount');
			$("#shareRequestCount").attr('title',totalRequest);
			$("#shareRequestCount").text(totalRequest);
		}
		else if(totalRequest==highestRequest){
			$(".shareRequest").css( "display", 'block' );
			$("#shareRequestCount").attr('class', 'shareRequestCountMedium');
			$("#shareRequestCount").attr('title',totalRequest);
			$("#shareRequestCount").text(totalRequest);
		}
		else if(totalRequest>highestRequest){
			$(".shareRequest").css( "display", 'block' );
			$("#shareRequestCount").attr('class', 'shareRequestCountBig');
			$("#shareRequestCount").attr('title',totalRequest);
			$("#shareRequestCount").text(highestRequest+'+');
		}
	};
	
	
	var _GetShareRequest = function (nodeID) {
		var shareRequest = null;
		var i;
		
		for (i = 0; i < Share.sharingRequests.length; i++) {
			if (Share.sharingRequests[i].DataID == nodeID) {
				shareRequest = Share.sharingRequests[i];
				break;
			}
		}
		
		return shareRequest;
	}
	
	
	/**
	This method will update the dom to display a success message for accepting share requests
	elementID = the prefix of the share request css id.
	nodeID = the id of the request that was accepted.
	ie, if the id of the element to update was #shareRequest1234, elementID would be '#shareRequest' and the nodeID would be 1234.
	
	*/
	this.MarkRequestAcceptSuccess = function (elementID, nodeID) {
		var shareRequest = _GetShareRequest(nodeID);
		
		if (shareRequest != null) {
			ui.LoadTemplateInEmptyElement('shareRequestSuccess', [shareRequest], elementID + nodeID + ' .shareSummaryText');
			$(elementID + nodeID).addClass('shareRequestHighlight');
			$(elementID + nodeID + ' .shareSummaryButtons').css('display', 'none');
		}
	}
	
	
	this.MarkRequestRejectSuccess = function (elementID, nodeID) {
		var shareRequest = _GetShareRequest(nodeID);
		
		if (shareRequest != null) {
			ui.LoadTemplateInEmptyElement('shareRequestRejectSuccess', [shareRequest], elementID + nodeID + ' .shareSummaryText');
			$(elementID + nodeID).addClass('shareRequestHighlight');
		}
	}
	
	
	this.ConfirmRejectSharingRequest = function (elementID, nodeID) {
		var shareRequest = _GetShareRequest(nodeID);
		
		if (shareRequest != null) {
			if (elementID == '#shareRequest') {
				ui.LoadTemplateInEmptyElement('confirmRejectShare', [shareRequest], elementID + nodeID + ' .shareSummaryText');
			}
			else {
				ui.LoadTemplateInEmptyElement('confirmRejectShareFull', [shareRequest], elementID + nodeID + ' .shareSummaryText');
				$(elementID + nodeID + ' .rejectConfirm').focus();
			}
			$(elementID + nodeID).addClass('shareRequestHighlight');
			$(elementID + nodeID + ' .shareSummaryButtons').css('display', 'none');
		}
	}
	
	
	this.CancelShareReject = function (elementID, nodeID) {
		var shareRequest = _GetShareRequest(nodeID);
		
		if (shareRequest != null) {
			ui.LoadTemplateInEmptyElement('shareRequestItem', [shareRequest], elementID + nodeID + ' .shareSummaryText');
			$(elementID + nodeID).removeClass('shareRequestHighlight');
			$(elementID + nodeID + ' .shareSummaryButtons').css('display', 'block');
		}
	}
	
	
	/**
	This function will update the ui share request counter to the specified amount.

	@param {Integer} totalRequest

	*/
	this.InitializePendingShareRequest = function (totalRequest){
		// reset to 0 as we have been given the total number,
		// and not a number to add  or subtract

		$("#shareRequestCount").attr('title',0);
		this.UpdateRequestNotification(totalRequest);
	};
	
	this.AddLeftShareButton = function(){
		ui.LoadTemplateInEmptyElement("shareInfoTemplate", {shareInvitation: info.canShare, SelectID: 'dropdownShareTypeInvite', ShareType: SHARETYPE.READWRITE}, "#shareInfo");
		SelectBox('dropdownShareTypeInvite', true);
		Collaborators.AddSearchUserAutocomplete("#inviteeinput");
		ui.LoadTemplateInEmptyElement('message', {message: T('LABEL.NoShareMessage'), classes: 'noSharesMessage'},'#collaborators');

	};

	this.ModifyShare = function(ID){

		ui.LoadTemplateInEmptyElement("loadingImage", '', "#shareInfo");

		return Collaborators.GetSharedObjectInfo(ID);

	};
	
	
	this.showShareRequestsMenu = function() {
		Share._showShareRequests = true;
		$('#shareRequest ul').css('display', 'block');
		$('#shareRequest').addClass('active');
	}

	this.hideShareRequestsMenuDelayed = function() {
		Share._showShareRequests = false;
		// set the timeout to allow for another item to come into focus,
		// and if after 100ms no items have come into focus, hide the menu
		setTimeout('Share.hideShareRequestsMenu()', '100');	
	}

	this.hideShareRequestsMenu = function() {
		if (!Share._showShareRequests) {
			$('#shareRequest ul').css('display', 'none');
			$('#shareRequest').removeClass('active');
		}
	}
	
}
