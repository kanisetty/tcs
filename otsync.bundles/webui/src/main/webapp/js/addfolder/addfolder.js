var AddFolderController = new function(){

    /**
	 * toggle the create new folder interface
	 *
	 * @public
	 */
	this.ToggleCreateNewFolder = function(){
		var panel = $('#newFolder');
		if (panel.length === 0){
			//remove the fileupload area first, for IE and FF4-
			$('#uploadFile').remove();

			// new folder interface not showing... so show it.
			$('#newFolderError').removeClass("showError");
			var createNewFolderOptions = {
				newFolderInput: {
					type:'text',
					id:'newFolderName',
					placeHolder:T('LABEL.NewFolderName'),
					wrapperClasses:'newFolderInputWrapper'},
				newFolderCreateButton: {
					id:'createNewFolderButton',
					name:'createNewFolderButton',
					textLeft:T('LABEL.Create'),
					type:'submit'
				},
				newFolderCancelButton: {
					id:'cancelCreateFolder',
					name:'cancelCreateFolder',
					textLeft:T('LABEL.Cancel')
				}
			};
			$("#createNewFolder_tmpl").template(createNewFolderOptions).insertAfter('#columnHeaderWrapper');
			document.getElementById('newFolderName').focus();
		}else{
			// it's showing so get rid of it
			panel.remove();
		}
	};

    this.AddEvents = function(){

        var bodyTag = $('body');

        bodyTag.delegate('#newFolderButton, #cancelCreateFolder', 'click', function(){
			AddFolderController.ToggleCreateNewFolder();
            $('#newFolderName').focus();
		});

		bodyTag.delegate('#createNewFolderForm', 'submit', function(){
			if(validateItemName($('#newFolderName')))
			{
				AddFolderController.CreateFolder(ui.GetCurrentNodeID(),$('#newFolderName').val());
				AddFolderController.ToggleCreateNewFolder();
			}else
			{
				//highlight the input, as we do in the share popup
				$('#newFolderName').addClass("ui-state-error");
                $('#newFolderError').addClass("showError");
			}

			//we don't want it to actually submit a real form
			return false;
		});
    };
};
