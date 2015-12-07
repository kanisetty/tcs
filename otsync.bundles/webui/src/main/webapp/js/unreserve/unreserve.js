var Unreserve = new function(){
    this.AddEvents = function(){
        var bodyTag = $('body');

        bodyTag.delegate('.objectUnreserve', 'click', function(e){
			e.stopPropagation();
		
			if($(".objectUnreserve").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
				$(this).parents('.dropDownMenu').hide();
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;

			var textMsg = T('LABEL.ConfirmUnreserveFile');
			var confirmTitle = T('LABEL.UnreserveItem');
			var unreserveButtonCaption = T('LABEL.Unreserve');
			
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
						text:unreserveButtonCaption,
						click: function() {
							$(this).dialog("close");
							ui.ToggleProcessingIndicatorForItemRow(data.DATAID);
							Unreserve.UnreserveObject(data.DATAID, data);
						}	
					}
				]
			});
			
			$("#actionConfirmation").dialog("open");
			return false;
		});
   };
};
