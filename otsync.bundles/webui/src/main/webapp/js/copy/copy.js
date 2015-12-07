var Copy = new function(){
    this.AddEvents = function(){
        var bodyTag = $('body');
        bodyTag.delegate('.multiActionCopy', 'click', function(e){

			var multiCopyIDs = SelectionController.GetCheckedItems();
			var parentID = SelectionController.GetParentID();

			//store the data to be used later, we need to know which item we are copying
			$('#multiCopyDialog').data('multiCopyIDs', multiCopyIDs);
			$('#multiCopyDialog').data('parentID', parentID);

			$('#multiCopyDialog').dialog('open');
		});
        
        bodyTag.delegate('.objectCopy', 'click', function(e){
			e.stopPropagation();
			
			if($(".objectCopy").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
				$(this).parents('.dropDownMenu').hide();
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}			
			
			var data = targetObject.tmplItem().data;
			//store the data to be used later, we need to know which item we are copying
			$('#copyItemDialog').data('sourceItemData', data);

			$('#copyItemDialog').dialog('open');
		});
    };  
};
