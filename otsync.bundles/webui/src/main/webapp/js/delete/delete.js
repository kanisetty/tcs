var Delete = new function(){
    this.AddEvents = function(){
        var bodyTag = $('body');
        bodyTag.delegate('.multiActionDelete', 'click', function(e){

			var multiDeleteIDs = SelectionController.GetCheckedItems();
			$("#actionConfirmation").dialog('option', 'title',  T('LABEL.DeleteItem'));
			$("#confirmationMessage").text(T('LABEL.ConfirmDeleteItem', {count: multiDeleteIDs.length }));
			$("#actionConfirmation").dialog('option', 'buttons', {
				"Cancel" : function() {
					$(this).dialog("close");
				},
				"Delete" : function() {
					$(this).dialog("close");
					ui.ToggleProcessingIndicatorForItemRow(multiDeleteIDs);
					SelectionController.UpdateMultiActionMenu();
					Delete.DeleteObjects(multiDeleteIDs);
				}
			});
			$("#actionConfirmation").dialog("open");
		});
        
        bodyTag.delegate('.objectDelete', 'click', function(){
			
			if($(".objectDelete").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
				$(this).parents('.dropDownMenu').hide();
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;

			
			var textMsg = '';
			var confirmTitle = '';
			var deleteButtonCaption = '';
			if(data.SUBTYPE === CONST_SUBTYPE.DOCUMENT)
			{
				textMsg = T('LABEL.ConfirmDeleteFile');
				confirmTitle = T('LABEL.DeleteItem');
				deleteButtonCaption = T('LABEL.Delete');				
			}
			else
			{
				switch(data.SHAREDFOLDER)
				{
					case 0:
						textMsg = T('LABEL.ConfirmDeleteFolder');
						confirmTitle = T('LABEL.DeleteItem');
						deleteButtonCaption = T('LABEL.Delete');
						break;
					case 1:
						textMsg = T('LABEL.ConfirmDeleteOwnSharedFolder');
						confirmTitle = T('LABEL.DeleteItem');
						deleteButtonCaption = T('LABEL.Delete');
						break;
					case 2:
						textMsg = T('LABEL.ConfirmDeleteSharedFolder');
						confirmTitle = T('LABEL.DeleteItemNonOwnerShare');
						deleteButtonCaption = T('LABEL.Remove');						
						break;
				}
			}
			
			$("#actionConfirmation").dialog('option', 'title',  confirmTitle);
			$("#confirmationMessage").text(textMsg);
			$("#actionConfirmation").dialog({			
				buttons:
				[	
					{
						text:T('LABEL.Close'),
						click: function() {$(this).dialog("close");}
					},
					{
						text:deleteButtonCaption,
						click: function() {
							$(this).dialog("close");
							ui.ToggleProcessingIndicatorForItemRow(data.DATAID);
							Delete.DeleteObject(data.DATAID, data);
						}	
					}
				]
			});
			
			$("#actionConfirmation").dialog("open");
			return false;
		});
    };
};