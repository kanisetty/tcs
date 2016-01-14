var RenameController = new function(){

    /**
    * handle the rename functionality
    *
    * @param {Object} obj		the dom object of the node
    * @private
    */
    var renameItemHandler = function(obj)
    {

	   if($(obj).isChildOf(".thumbnailViewBrowseItem")){
			var targetObject = $(obj).parents('.thumbnailViewBrowseItem');
		}
		else{
			var targetObject = $(obj).parents('.browseItem');
		}

	   var newName = targetObject.find('.newItemName');
       if(validateItemName(newName))
       {
           var data = targetObject.tmplItem().data;
           ui.ToggleProcessingIndicatorForItemRow(data.DATAID);
           RenameController.RenameObject(data.DATAID, newName.val());
       }
       else
       {
           //show error
           targetObject.find('.errorText').addClass('showError');
       }
    };

    /**
	 * toggle the rename item interface
	 *
	 * @param {Integer} itemID		the node id of the item
	 * @public
	 */
	this.ToggleRenameItem = function(itemID)
	{
		if($('#browseFile-'+itemID).hasClass('thumbnailViewBrowseItem')){

			var container = $('#browseFile-'+itemID+' .thumbnailViewBrowseItemInfo');
		}
		else{
			var container = $('#browseFile-'+itemID+' .itemIconNameActionWrapper');
		}
		var row = $('#browseFile-'+itemID);
		var panel = $('#browseFile-'+itemID).find('.renameItem');

		if (panel.length === 0){
			//remove the addversion panel
			$('#addVersion').remove();

			// rename interface not showing... so show it.
			var renameItemOptions = {
				renameItemInput: {
					type:'text',
					id:'newItemName'+itemID,
					placeHolder: container.tmplItem().data.NAME,
					value: container.tmplItem().data.NAME,
					wrapperClasses:'inline',
					classes: 'newItemName'
				},
				renameItemSubmitButton: {
					id:'renameItemSubmit'+itemID,
					name:'renameItemSubmit' + itemID,
					textLeft:T('LABEL.Rename'),
					classes: 'submitButton'
				},
				renameItemCancelButton: {
					id:'renameItemCancel'+itemID,
					name:'renameItemCancel'+itemID,
					textLeft:T('LABEL.Cancel'),
					classes: 'cancelButton'
				}
			};
			container.find('.itemNameContainer').hide();
			container.find('.BrowseMoreMenu').hide();
            row.find('.itemLastModifiedWrapper').hide();
            row.find('.itemSizeWrapper').hide();

			var renameInterface = $("#renameItem_tmpl").template( renameItemOptions).appendTo(container);
			renameInterface.find('input').focus();
		}else{
			// it's showing so get rid of it
			panel.remove();
			container.find('.itemNameContainer').show();
			container.find('.BrowseMoreMenu').show();
            row.find('.itemLastModifiedWrapper').show();
            row.find('.itemSizeWrapper').show();
		}

    };

    this.AddEvents = function(){
        var bodyTag = $('body');

        bodyTag.delegate('.objectRename', 'click', function(e){
			e.stopPropagation();

			if($(".objectRename").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
				$(this).parents('.dropDownMenu').hide();
				$(this).parents('.thumbnailViewBrowseItem').find('.moreMenuButton').removeClass('moreMenuButtonActive');
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;
			RenameController.ToggleRenameItem(data.DATAID);
			$('#newItemName' + data.DATAID).select();
		});

        //prvent the row being selected while clicking the rename input
		bodyTag.delegate('.renameItem input', 'click', function(e){
			e.stopPropagation();
		});

		//register the Enter keydown event on the rename input
		bodyTag.delegate('.renameItem input', 'keydown', function(e){
			e.stopPropagation();
			if(e.keyCode === 13)
			{
				renameItemHandler(this);
			}
		});

		//register click event for the rename submit button
		bodyTag.delegate('.renameItem .submitButton', 'click', function(e){
			e.stopPropagation();
			renameItemHandler(this);
		});

		//register click event for the rename cancel button
		bodyTag.delegate('.renameItem .cancelButton', 'click', function(e){
			e.stopPropagation();

			if($(".renameItem .cancelButton").isChildOf(".thumbnailViewBrowseItem")){
				var targetObject = $(this).parents('.thumbnailViewBrowseItem');
			}
			else{
				var targetObject = $(this).parents('.browseItem');
			}
			var data = targetObject.tmplItem().data;
			RenameController.ToggleRenameItem(data.DATAID);
		});
    };
};

//requset and response
$.extend(RenameController, new function(){

    var response = new function(){

        /**
        This function will process the response from a successful RenameObject request.

        @param {Integer} nodeID					object ID
        @param {String} name					object name
        @param {Object} data					result data

        @public
        */
        this.RenameObject = function(nodeID, name, data){

            //remove the rename interface
            RenameController.ToggleRenameItem(nodeID);
			var tmplData = $('#browseFile-'+nodeID).tmplItem().data;
			var subType = T('LABEL.File');
			if(tmplData.SUBTYPE === CONST_SUBTYPE.FOLDER)
			{
				subType = T('LABEL.Folder');
			}
			//reload the content area
			Browse.BrowseObject(ui.GetCurrentNodeID());
			//display the confirmation message
			ui.MessageController.ShowMessage(T('LABEL.ObjectRenameConfirmation', {subType: subType, name: name}));
            ui.ToggleProcessingIndicatorForItemRow(nodeID);
        };

		/**
        This function will process the response from a failed RenameObject request.

        @param {Integer} nodeID					object ID
        */

		this.RenameObjectFail = function(nodeID){

            //remove the rename interface
            RenameController.ToggleRenameItem(nodeID);
            ui.ToggleProcessingIndicatorForItemRow(nodeID);
        };

    };

    /**
    This function will rename the given object with the specified name.

    @param {Integer} nodeID					object ID
    @param {String} name					new name

    @private
    */
    var _RenameObject = function(nodeID, name){

        var type = 'request';
        var subtype = 'rename';
        var requestID = type + subtype + "(" + nodeID + ")";

        var requestData = new request.ObjectRequestSet(type, subtype);

        requestData.info = {
            nodeID: nodeID,
            newName: name
        };

        var ajaxData = new request.ObjectFrontChannel(requestData);

        return queue.AddSet(requestID, ajaxData);
    };

    /**
    This function will rename the given object with the specified name.

    @param {Integer} nodeID					object ID
    @param {String} name					new name

    @public
    */
    this.RenameObject = function(nodeID, name){

        return $.when(_RenameObject(nodeID, name)).pipe(request.ValidateResponse)
        .done(function(resultData){

            // Clear all breadcrumbs from the cache, since we don't know what impact the rename had.
            queue.ClearCache("requestgetlocationpath");

            // Clear all browse breadcrumbs from the cache, this will keep the cache size small.
            queue.ClearCache("requestgetfoldercontents");

            response.RenameObject(nodeID, name, resultData);
        })
        .fail(function(){
            response.RenameObjectFail(nodeID);
        });
    };
});
