	/**
	This function initializes all of the dialogs required by the UI to the page.

	*/
var Dialogs = new function(){

	this.vars = function(){
		var vars = {
			confirmationDialog:
			{
				title: '',
				message:''
			},
			historyDialog:
			{
				historyTabList : [
					{
						tabName: CONST_HISTORYTABS.AUDIT,
						tabText: T('LABEL.TabAudit')
					},
					{
						tabName: CONST_HISTORYTABS.VERSION,
						tabText: T('LABEL.TabVersion')
					}
				]
			},
			historyDialogFolder:
			{
				historyFolderTabList : [
					{
						tabName: CONST_HISTORYTABS.AUDIT,
						tabText: T('LABEL.TabAudit')
					}
				]
			},
			publishDestinationOptionDialog:
			{
				destinationFolderButton:{
					id:'publishToFolderButton',
					name:'publishToFolderButton',
					textRight:T('LABEL.PublishInFolder'),
					classes: 'publishToFolderButton'
				},
				destinationFileButton:{
					id:'PublishToFileButton',
					name:'PublishToFileButton',
					textRight:T('LABEL.PublishInFile'),
					classes: 'PublishToFileButton'
				}
			},
			publishDialog:
			{
				browseCSInput:
				{
					id:'publishDestinationPath',
					type:'text',
					name:'publishDestinationPath',
					wrapperClasses: 'browseDestinationInput',
					classes: 'publishDestinationPath'
				},
				browseCSInputHidden:
				{
					id:'publishDestinationNode',
					type:'hidden',
					name:'publishDestinationNode'
				},
				browseCSButton:
				{
					id:'browseCSButton',
					name:'browseCSButton',
					textRight:T('LABEL.BrowseContentServer'),
					classes: 'browseCSButton'
				},
				copyOption:
				{
					id:'publishCopy',
					type:'radio',
					name:'publishOptionRadio',
					textRight:T('LABEL.CopyInOtsync'),
					defaultChecked: 'checked'
				},
				moveOption:
				{
					id:'publishMove',
					type:'radio',
					name:'publishOptionRadio',
					textRight:T('LABEL.MoveFromOtsync')
				}
			},
			aboutDialog:
			{
				title:'',
				copyrightMessage: T('LABEL.CopyrightOpenText'),
				webUIVersion: info.version.ui,
				repoLocation: info.repo,
				webUIBuildDate: info.version.buildDate,
				serverAPIVersion: info.version.api
			}
		};

		// allow other modules to register their dialogs
		
		vars = Share.RegisterDialogVars(vars);
		vars = Collaborators.RegisterDialogVars(vars);
        vars = UserProfile.RegisterDialogVars(vars);
		vars = UserNotificationConfig.RegisterDialogVars(vars);
		vars = Copy.RegisterDialogVars(vars);
		vars = Move.RegisterDialogVars(vars);
		return vars;
	};

	this.Initialize = function(defer){

		var _InitializeHistoryDialog = function(){
			var targetObject = $(this).parents('.browseItem');
			var historyDialog = $('#historyView');
			historyDialog.dialog({
				autoOpen: false,
				height: 410,
				width: 580,
				modal: true,
				resizable: false,
				draggable: false,
				dialogClass: 'popUpDialog historyDialog',
				buttons: [{
						text: T('LABEL.Close'),
						click: function(){
							$(this).dialog("close");
						}
				}],
				open: function(dialogEvent, dialogUI){
					var currentDialog = $('.historyDialog');
					var sourceID = historyDialog.data('sourceItemData').DATAID;
					request.GetAuditHistory(sourceID);
					request.GetVersionHistory(sourceID);
					$( "#historyTabs" ).tabs({
						show: function(tabEvent,tabUI){
							if(tabUI.tab.className === 'tabVersionHeader') {
								$('.versionDownload:first').focus();
							}
						}
					});
                
          $(".ui-tabs a").click(function() { this.focus(); });
				},
				close: function(dialogEvent, dialogUI) {
				}

			});

		};// end _InitializeHistoryDialog 

		var _InitializeHistoryDialogFolder = function(){
			var historyDialogFolder = $('#historyViewFolder');
			historyDialogFolder.dialog({
				autoOpen: false,
				height: 410,
				width: 580,
				modal: true,
				resizable: false,
				draggable: false,
				dialogClass: 'popUpDialog historyDialogFolder',
				buttons: [{
					text: T('LABEL.Close'),
					click: function(){
						$(this).dialog("close");
					}
				}],
				open: function(dialogEvent, dialogUI) {
					var currentDialog = $('.historyDialogFolder');
					var sourceID = historyDialogFolder.data('sourceItemData').DATAID;
					var sourceSubType = historyDialogFolder.data('sourceItemData').SUBTYPE;
					request.GetAuditHistory(sourceID);
					$("#historyFolderTabs").tabs();
          $(".ui-tabs a").click(function() { this.focus(); });
				},
				close: function(dialogEvent, dialogUI) {
				}

			});

		}; // end _InitializeHistoryDialogFolder 

        //initialize the publish file dialog
		var _InitializePublishDestinationOptionDialog = function(){
			var publishDestinationOptionDialog = $('#publishDestinationOptionDialogView');
			publishDestinationOptionDialog.dialog({
				autoOpen: false,
				height: 'auto',
				width: 550,
				modal: true,
				resizable: false,
				draggable: false,
				dialogClass: 'popUpDialog publishDestinationOptionDialog',
				buttons: [{
					text:T('LABEL.Cancel'),
					click: function() {
						$(this).dialog("close");
					}
				}],
				open: function(dialogEvent, dialogUI){
					var currentDialog = $('.publishDestinationOptionDialog');
					var sourceName = publishDestinationOptionDialog.data('sourceItemData').NAME;
					var publishData = publishDestinationOptionDialog.data('sourceItemData');
					// maximum 40 characters to be displayed as title
					// commented out older version of dialog title that allowed html but is not supported from jQueryUI 1.10 and up.
					//$(this).dialog( "option", "title", $('<div class="dialogWordWrap"/>').attr('title',sourceName).text(T('LABEL.PublishName',{sourceName:utils.TrimLongString(sourceName,40)})).appendTo($('<div>')).parent().html());
					$(this).dialog( "option", "title", T('LABEL.PublishName',{sourceName:utils.TrimLongString(sourceName,40)}));
					$('#publishDialogView').data('sourceItemData',publishData);
					$('.publishDestinationOptionDialog .ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');
				},
				close: function(dialogEvent, dialogUI) {
					
				}

			});

		}; // end _InitializePublishDestinationOptionDialog 

        //initialize publish folder dialog
		var _InitializePublishDialog = function(){
			var publishDialog = $('#publishDialogView');
			publishDialog.dialog({
				autoOpen: false,
				height: 340,
				width: 550,
				modal: true,
				resizable: false,
				draggable: false,
				dialogClass: 'popUpDialog publishDialog',
				buttons: [{
						text:T('LABEL.Cancel'),
						click: function(){
						$(this).dialog("close");
					}},
					{
						text:T('LABEL.Publish'),
						click: function(){
							var destinationType = publishDialog.data('publishDestinationType');
							var checkedId = $('input[name="publishOptionRadio"]:checked').attr('id');
							if($('#publishDestinationNode').val()!==""){
								if(checkedId === 'publishMove') {
									if(destinationType===info.versionCreateInSubtype){
										ui.ToggleProcessingIndicatorForItemRow(publishDialog.data('sourceItemData').DATAID);
										// 0 represents latest version of file
										Move.MoveVersion(publishDialog.data('sourceItemData').DATAID, 0, $('#publishDestinationNode').val(), publishDialog.data('sourceItemData'));

									} else {
										ui.ToggleProcessingIndicatorForItemRow(publishDialog.data('sourceItemData').DATAID);
										Move.MoveObject(publishDialog.data('sourceItemData').DATAID, $('#publishDestinationNode').val(), publishDialog.data('sourceItemData'));
									}
								} else {
									if(destinationType===info.versionCreateInSubtype){
										ui.ToggleProcessingIndicatorForItemRow(publishDialog.data('sourceItemData').DATAID);
										// 0 represents latest version of file
										Copy.CopyVersion(publishDialog.data('sourceItemData').DATAID, 0, $('#publishDestinationNode').val(), publishDialog.data('sourceItemData'));

									} else {
										ui.ToggleProcessingIndicatorForItemRow(publishDialog.data('sourceItemData').DATAID);
										Copy.CopyObject(publishDialog.data('sourceItemData').DATAID, $('#publishDestinationNode').val(), publishDialog.data('sourceItemData'));
									}
								}
								$(this).dialog("close");
							} else{

								 $('#PublishError').addClass('showError');
							}

						}
					}
					],
				open: function(dialogEvent, dialogUI){
					var currentDialog = $('.publishDialog');
					var destinationType = publishDialog.data('publishDestinationType');
					if(destinationType === info.versionCreateInSubtype ){
						$('#browseCSButton').attr('class','browseCSButton browseCSVersionButton');
					}
					else if (destinationType === info.documentCreateInSubtype){
						$('#browseCSButton').attr('class','browseCSButton browseCSDocumentButton');
					} else {
						$('#browseCSButton').attr('class','browseCSButton browseCSFolderButton');
					}
					// reset inputs
					$('#publishDestinationPath').val("");
					$('#publishCopy').attr("checked", true);
					var sourceName = publishDialog.data('sourceItemData').NAME;
					// maximum 40 characters to be displayed as title
					// commented out older version of dialog title that allowed html but is not supported from jQueryUI 1.10 and up.
					//$(this).dialog( "option", "title", $('<div class="dialogWordWrap"/>').attr('title',sourceName).text(T('LABEL.PublishName',{sourceName:utils.TrimLongString(sourceName,40)})).appendTo($('<div>')).parent().html());
					$(this).dialog( "option", "title", T('LABEL.PublishName',{sourceName:utils.TrimLongString(sourceName,40)}));
					var sourceSubType = publishDialog.data('sourceItemData').SUBTYPE;
					var sourceIsReadOnly = publishDialog.data('sourceItemData').ISREADONLY;					
					if(sourceSubType===CONST_SUBTYPE.FOLDER){
						$('.publishCopyTextRight').text(T('LABEL.CopyFolderInOtsync'));
						
						if(sourceIsReadOnly){
							currentDialog.find('.publishMoveTextRight').parent('div').hide();
						}
						else{							
							$('.publishMoveTextRight').text(T('LABEL.MoveFolderFromOtsync'));
						}
	
					} else {
						$('.publishCopyTextRight').text(T('LABEL.CopyInOtsync'));
						
						if(sourceIsReadOnly){							
							currentDialog.find('.publishMoveTextRight').parent('div').hide();
						}
						else{							
							$('.publishMoveTextRight').text(T('LABEL.MoveFromOtsync'));
						}
					}
					$('.publishDialog .ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');
					
				},

				close: function(dialogEvent, dialogUI) {
					 $('#PublishError').removeClass('showError');
					 
					 if( !$(this).find('.publishMoveTextRight').parent('div').is(":visible") ){
					 
						 $(this).find('.publishMoveTextRight').parent('div').show();						
					 }
				}
			});

		}; // end _InitializePublishDialog 
		
		var _InitializeAboutDialog = function(){		
			var aboutDialog = $('#aboutDialogView');
			aboutDialog.dialog({
				autoOpen: false,
				height: 280,
				width: 550,
				modal: true,
				resizable: false,
				draggable: false,
				dialogClass: 'popUpDialog aboutDialog',
				open: function(dialogEvent, dialogUI){
					var currentDialog = $('.aboutDialog');
					$('.aboutDialog .ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');
					ui.DialogShadowController.AddShadow(currentDialog);
				},

					close: function(dialogEvent, dialogUI) {
					ui.DialogShadowController.RemoveShadow();
				}

			});

		}; // end _InitializeAboutDialog 

		var	_InitializeConfirmationDialog = function(){
			var confirmationDialog= $('#actionConfirmation');

			confirmationDialog.dialog({
				modal: true,
				bgiframe: true,
				width: 500,
				closeOnEscape: true,
				draggable: false,
				resizable: false,
				dialogClass: 'popUpDialog itemRequestDialog confirmationDialog',
				autoOpen: false,
				open: function(dialogEvent, dialogUI){
					// the buttons get removed automatically as part of the confirmation dialog
					// logic, so we must call this every time we open the confirmation dialog
					Dialogs.ModifyButtonHTML(".confirmationDialog");
					Dialogs.CorrectTabOrder(".confirmationDialog");
					$(".confirmationDialog button").first().focus();
				},
				close: function(dialogEvent, dialogUI) {
				}
			});

		}; // end _InitializeConfrimationDialog 
			
		var _InitializeDialogs = function() {
			Collaborators.InitializeCollaboratorsDialogs();
			Share.InitializeShareDialogs();
			UserProfile.InitializeProfileDialogs();
			Copy.InitializeCopyDialogs();
			UserNotificationConfig.InitializeUserNotificationConfigDialog();
			Move.InitializeMoveDialogs();
			_InitializeConfirmationDialog();
			_InitializeHistoryDialog();
			_InitializeHistoryDialogFolder();
			_InitializePublishDestinationOptionDialog();
			_InitializePublishDialog();
			_InitializeAboutDialog();
			
			// modify the jquery dialog button html
			Dialogs.ModifyButtonHTML(".popUpDialog");
			Dialogs.CorrectTabOrder(".popUpDialog");
		}		
		
		defer = $.when();

		defer.pipe(_InitializeDialogs);
	
		return defer;

	};
	
	/**
	This function modifies the stock jquery button html by adding
	some div wrappers for the rounded corner buttons.
	*/
	this.ModifyButtonHTML = function(selector) {
	
		if (selector != "") selector += " ";
		
		$(".ui-dialog-titlebar-close").remove();
		
		if ( !$( selector + ".ui-dialog-buttonset-wrapper" ).length ) { 

			$(selector + ".ui-dialog-buttonset").wrap('<div class="ui-dialog-buttonset-wrapper" />');		
		}
			$(selector + ".ui-button").wrap('<div class="dialogButton" />');
			$(selector + ".ui-button").before('<div class="dialogButtonLeft" />');
			$(selector + ".ui-button").after('<div class="dialogButtonRight" />');
			$(selector + ".ui-button").wrap('<div class="dialogButtonMid" />');

	};
	
	/**
	This method solves the tab order issue for dialogs where the tab focus is
	set to elements under the dialog
	**/
	this.CorrectTabOrder = function(selector, skipFirst) {
    skipFirst = utils.DefaultValue(skipFirst, true);
  
		$(selector).each(function() {
			//unbind all keydown event in case it was registered some element in the last call.
			$("a, button, input", this).unbind('keydown');
			
			var first = $("a, button, input", this).first();
			var last = $("a, button, input", this).last();
			
			// x button is hidden on dialogs with a cancel/close button
			// so we want to set the first to the first visible tabbable element
			
			if ($(first).css('display') == 'none') {
				var i = 0;
				$("a, button, input", this).each(function() {
					if (i++ == 1 || !skipFirst) {
						first = this;
						return false;
					}
				});				
			}
			
			// handle tab
			$(last).keydown(function(e) {
				if (e.keyCode == 9) {
					if (!e.shiftKey) {
						e.preventDefault();
						$(first).focus();
					}
				}
			});
			
			// handle shift + tab
			$(first).keydown(function(e) {
				if (e.keyCode == 9) {
					if (e.shiftKey) {
						e.preventDefault();
						$(last).focus();
					}
				}
			});
		});
	};
};
