$.extend(Move, new function(){
    /**
     * Add any template variables if needed here
     * @param {Object}      vars        The object that will be added with new template varabiles
     *
     * @returns {Object}                The object with the new template variables added 
     * @public
     */ 
    this.RegisterDialogVars = function(vars){
        return vars;
    };
    
    /**
     * Initialize the copy and multicopy dialog
     *
     * @public
     */ 
    this.InitializeMoveDialogs = function(){
        initializeMoveDialog();
        initializeMultiMoveDialog();
    };
    
    //TODO: when move a file, we might want make the current folder unselectable
    var initializeMoveDialog = function(){
        var moveItemTreeView = new TreeView({wrapperID: 'moveItemDialog', wrapperTitle:T('LABEL.Move'), treeID: 'moveTree', treeTemplate: 'moveFolderItem', parent: 'body'} );
        var moveItemDialog = $('#moveItemDialog');
        moveItemDialog.dialog({
            autoOpen: false,
            height: 400,
            width: 550,
            resizable: false,
            draggable: false,
            modal: true,
            dialogClass: 'popUpDialog moveItemDialog',
            buttons: [{
                    text:T('LABEL.Cancel'),
                    click: function(){
                    $(this).dialog("close");
                }}, {
                    text:T('LABEL.Move'),
                    click:function(){
                        var selectedItem = moveItemTreeView.GetSelected();
                        var destinationID = selectedItem.tmplItem().data.DATAID;
                        if (destinationID !== null &&  destinationID !== undefined )
                        {
                            var sourceID = moveItemDialog.data('sourceItemData').DATAID;
                            ui.ToggleProcessingIndicatorForItemRow(sourceID);

                            Move.MoveObject(sourceID, destinationID, moveItemDialog.data('sourceItemData'));
                            $(this).dialog("close");
                        }
                    }
                }],
            open: function(dialogEvent, dialogUI){
                var currentDialog = $('.moveItemDialog');
                $('.moveItemDialog .ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');
                var sourceName = moveItemDialog.data('sourceItemData').NAME;
                // maximum 40 characters to be displayed as title
				// commented out older version of dialog title that allowed html but is not supported from jQueryUI 1.10 and up.
                //$(this).dialog( "option", "title", $('<div class="dialogWordWrap"/>').attr('title',sourceName).text(T('LABEL.MoveItem',{sourceName:utils.TrimLongString(sourceName,40)})).appendTo($('<div>')).parent().html());
				$(this).dialog( "option", "title", T('LABEL.MoveItem',{sourceName:utils.TrimLongString(sourceName,40)}));
                ui.DialogShadowController.AddShadow(currentDialog);
                if( moveItemDialog.data('sourceItemData').PARENTID === info.userRootFolderID) {
                    moveItemDialog.find('.root').addClass('isparent');
                } else {
                    moveItemDialog.find('.root').addClass('browseable selectable selected');
                }
                currentDialog.find('.loadingTree').show();
                moveItemTreeView.LoadDataFromServer();
            },
            close: function(dialogEvent, dialogUI) {
                ui.DialogShadowController.RemoveShadow();
                moveItemDialog.find('.errorText').hide();
                moveItemTreeView.RemoveTree();
                moveItemDialog.find('.root').removeClass('isparent');
                moveItemDialog.find('.root').removeClass('browseable selectable selected');
            }

        });

    }; // end initializeMoveDialog 

    var initializeMultiMoveDialog = function(){

        var multiMoveTreeView = new TreeView({wrapperID: 'multiMoveDialog', wrapperTitle:T('LABEL.Move'), treeID: 'multiMoveTree', treeTemplate: 'multiMoveItem', parent: 'body'} );
        var multiMoveDialog = $('#multiMoveDialog');
        multiMoveDialog.dialog({
            autoOpen: false,
            height: 400,
            width: 550,
            modal: true,
            resizable: false,
            draggable: false,
            dialogClass: 'popUpDialog multiMoveDialog',
            buttons: [{
                    text:T('LABEL.Cancel'),
                    click: function(){
                    $(this).dialog("close");
                }}, {
                    text:T('LABEL.Move'),
                    click:function(){
                        var selectedItem = multiMoveTreeView.GetSelected();
                        if (selectedItem.tmplItem().data.DATAID !== null && selectedItem.tmplItem().data.DATAID !== undefined) {
                            var multiMoveIDs = multiMoveDialog.data('multiMoveIDs');
                            ui.ToggleProcessingIndicatorForItemRow(multiMoveIDs);
                            SelectionController.UpdateMultiActionMenu();
                            Move.MoveObjects(multiMoveIDs, selectedItem.tmplItem().data.DATAID);
                            $(this).dialog("close");
                        }
                    }
                }],
            open: function(dialogEvent, dialogUI){
                var currentDialog = $('.multiMoveDialog');
                $('.multiCopyDialog .ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');
                if( multiMoveDialog.data('parentID') === info.userRootFolderID) {
                    multiMoveDialog.find('.root').addClass('isparent');
                } else {
                    multiMoveDialog.find('.root').addClass('browseable selectable');
                }
                currentDialog.find('.loadingTree').show();
                multiMoveTreeView.LoadDataFromServer();
            },
            close: function(dialogEvent, dialogUI) {
                multiMoveDialog.find('.errorText').hide();
                multiMoveTreeView.RemoveTree();
                multiMoveDialog.find('.root').removeClass('isparent');
                multiMoveDialog.find('.root').removeClass('browseable selectable selected');
            }

        });
    }; // end initializeMultiMoveDialog 
});