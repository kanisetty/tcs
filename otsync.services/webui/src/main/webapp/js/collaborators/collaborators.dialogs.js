/**
 * Extend the Collaborators Object with functions that build the dialogs
 *
 * public methods:
 * RegisterDialogVars
 * InitializeCollaboratorsDialogs
 *
**/

$.extend(Collaborators, new function(){


	this.seeAllShareRequestsDialog = null;

	
	/**
	This method is called by dialogs.js in order to register the dialog
	*/

	this.RegisterDialogVars = function(vars) {
			
			vars.editAllCollaboratorsDialog = {
			title:T('LABEL.EditAllCollaborators'),
			shareFolderUserInput:{
				id:'shareFolderUserInput',
				type:'text',
				name:'shareFolderUserInput',
				instructionText:T('LABEL.SelectUserToShareWith'),
				classes: 'shareFolderUserInput',
				wrapperClasses: 'shareFolderUserInputWrapper'
			},
			shareFolderAddUserButton:{
				id:'addUser',
				name:'adduser',
				textRight:T('LABEL.Add'),
				classes: 'addUser'
			}
			
		};
		
		return vars;
	};
	
	this.InitializeCollaboratorsDialogs = function() {
		_InitializeEditAllCollaboratorsDialog();
	};
		
	var	_InitializeEditAllCollaboratorsDialog = function(){
	
		ui.LoadTemplate("#editAllCollaboratorsTemplate_tmpl", null, '#dialogs');
		Collaborators.editAllCollaboratorsDialog = $('#editCollaborators');
		Collaborators.editAllCollaboratorsDialog.dialog({
			title: T('LABEL.Collaborators'),
			modal: true,  // Looks like the bug is fixed and we can use the jQuery UI modal in this case and we don't need the workaround any more. Previous comment: Using our own modal dialog logic because of tabbing bug http://bugs.jqueryui.com/ticket/3123
			bgiframe: true,
			width: 515,
			height: 550,
			closeOnEscape: true,
			draggable: false,
			resizable: false,
			dialogClass: 'popUpDialog editAllCollaboratorsDialog',
			autoOpen: false,
			buttons: [
				{
					id:"unshareAllCloseButton",
					text: T('LABEL.Cancel'),
					click: function(){						
						$(this).dialog("close");
					}
				},
				{
					id:"saveCollaboratorsButton",
					text:T('LABEL.Save'),
					click:function(){						
						Collaborators.UpdateCollaborators(ui.GetCurrentNodeID(),$('#inviteMessageInput').val());					
						$(this).dialog("close");
					}
				}
			],//end buttons
			open: function(dialogEvent, dialogUI) {
				var shareInfoTmplVar;
				var currentUserIsOwner = $('#objectInfoName').tmplItem().data.isOwner;
				
				if( info.folderIsShareable ){
					shareInfoTmplVar = {shareInvitation: currentUserIsOwner, SelectID: 'dropdownShareTypeEditAll'};			
				}
				else{
					shareInfoTmplVar = {};
				}
				
				var dialogTitle = $('#objectInfoName').tmplItem().data.name;
				// commented out older version of dialog title that allowed html but is not supported from jQueryUI 1.10 and up.
				//$('#editCollaborators').dialog( "option", "title", $('<div class="dialogWordWrap"/>').attr('title',dialogTitle).text(T('LABEL.CollaboratorsFolderName',{folderName:utils.TrimLongString(dialogTitle,22)})).appendTo($('<div>')).parent().html());
				$('#editCollaborators').dialog( "option", "title", T('LABEL.CollaboratorsFolderName',{folderName:utils.TrimLongString(dialogTitle,22)}));
				
				if( info.folderIsShareable ){
					$('#saveCollaboratorsButton').parents('.dialogButton').show();
				}
				else
				{
					$('#saveCollaboratorsButton').parents('.dialogButton').hide();
				}
				
				Collaborators.DrawCollaboratorsArea();
				
				shareInfoTmplVar.ShareType = 2;
				
				if( info.folderIsShareable ){
					ui.LoadTemplateInEmptyElement("#shareInvitationMessageTemplate_tmpl", shareInfoTmplVar, '#inviteMessage');
					//fix for ie's implementation of placeholders for textareas
					clear_placeholder('inviteMessageInput', T('LABEL.EnterMessageToIncludeToNewCollaborators'));		
					ui.LoadTemplateInEmptyElement("#shareInvitationTemplate_tmpl", shareInfoTmplVar, '#searchInfo2');
					Collaborators.AddSearchUserAutocomplete("#inviteeinputEditCollaborators");
					SelectBox('dropdownShareTypeEditAll', true);
					$('#inviteeinputEditCollaborators').focus();
				}
			},
			close: function(dialogEvent, dialogUI) {
				Collaborators.cancelAllUnsaved();
				Collaborators.ClearCollobaratorsArea();
				Collaborators.DrawCollaboratorsArea();
				$('#modalOverlay').remove();
			}
		});		
	}; // end _InitializeEditAllCollaboratorsDialog 
	
});
