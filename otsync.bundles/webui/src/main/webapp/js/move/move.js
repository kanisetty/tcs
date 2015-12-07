var Move = new function(){
    this.AddEvents = function(){
        
        var bodyTag = $('body');
        
        bodyTag.delegate('.multiActionMove', 'click', function(e){

			var multiMoveIDs = SelectionController.GetCheckedItems();
			var parentID = SelectionController.GetParentID();

			//store the data to be used later, we need to know which item we are moving
			$('#multiMoveDialog').data('multiMoveIDs', multiMoveIDs);
			$('#multiMoveDialog').data('parentID', parentID);

			$('#multiMoveDialog').dialog('open');
		});
        
        bodyTag.delegate('.objectMove', 'click', function(e){
			e.stopPropagation();
			
			if($(".objectMove").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
				$(this).parents('.dropDownMenu').hide();
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;
			//store the data to be used later, we need to know which item we are moving
			$('#moveItemDialog').data('sourceItemData', data);

			$('#moveItemDialog').dialog('open');
		});
    };
};
