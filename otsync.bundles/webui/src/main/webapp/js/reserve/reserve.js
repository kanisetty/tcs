var Reserve = new function(){
    this.AddEvents = function(){
        var bodyTag = $('body');

        bodyTag.delegate('.objectReserve', 'click', function(e){
			e.stopPropagation();
		
			if($(".objectReserve").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
				$(this).parents('.dropDownMenu').hide();
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;

			var textMsg = T('LABEL.ConfirmReserveFile');
			var confirmTitle = T('LABEL.ReserveItem');
			var reserveButtonCaption = T('LABEL.Reserve');
			
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
						text:reserveButtonCaption,
						click: function() {
							$(this).dialog("close");
							ui.ToggleProcessingIndicatorForItemRow(data.DATAID);
							Reserve.ReserveObject(data.DATAID, data);
						}	
					}
				]
			});
			
			$("#actionConfirmation").dialog("open");
			return false;
		});
   };
};