$.extend(Copy, new function(){

    /**
     * Add any template variables if needed here
     * @param {Object}      vars        The object that will be added with new template varabiles
     *
     * @returns {Object}                The object with the new template variables added
     * @public
     */
    this.RegisterDialogVars = function(vars){
        return vars;
    }

    /**
     * Initialize the copy and multicopy dialog
     *
     * @public
     */
    this.InitializeCopyDialogs = function(){
        initializeCopyDialog();
        initializeMultiCopyDialog();
    };

    /**
     * Initilize the copy dialog
     *
     * @private
     */
    var initializeCopyDialog = function(){
        var copyItemTreeView = new TreeView({wrapperID: 'copyItemDialog', wrapperTitle:T('LABEL.Copy'), treeID: 'copyTree', treeTemplate: '#copyFolderItem_tmpl', parent: 'body'} );
        var copyItemDialog = $('#copyItemDialog');
        copyItemDialog.dialog({
            autoOpen: false,
            width: 550,
            height: 400,
            modal: true,
            resizable: false,
            draggable: false,
            dialogClass: 'popUpDialog copyItemDialog',
            buttons: [{
                    text:T('LABEL.Cancel'),
                    click: function(){
                    $(this).dialog("close");
                }}, {
                    text:T('LABEL.Copy'),
                    click:function(){
                        var selectedItem = copyItemTreeView.GetSelected();
                        if (selectedItem.tmplItem().data.DATAID != null && selectedItem.tmplItem().data.DATAID !== undefined) {
                            var sourceID = copyItemDialog.data('sourceItemData').DATAID;
                            ui.ToggleProcessingIndicatorForItemRow(sourceID);
                            Copy.CopyObject(sourceID, selectedItem.tmplItem().data.DATAID, copyItemDialog.data('sourceItemData'));
                            $(this).dialog("close");
                        }
                    }
                }],
            open: function(dialogEvent, dialogUI){
                var currentDialog = $('.copyItemDialog');
                $('.copyItemDialog .ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');
                var sourceName = copyItemDialog.data('sourceItemData').NAME;
                // maximum 40 characters to be displayed as title
				// commented out older version of dialog title that allowed html but is not supported from jQueryUI 1.10 and up.
               // $(this).dialog( "option", "title", $('<div class="dialogWordWrap"/>').attr('title',sourceName).text(T('LABEL.CopyItem',{sourceName:utils.TrimLongString(sourceName,40)})).appendTo($('<div>')).parent().html());
			    $(this).dialog( "option", "title", T('LABEL.CopyItem',{sourceName:utils.TrimLongString(sourceName,40)}));
                if( copyItemDialog.data('sourceItemData').PARENTID === info.userRootFolderID) {
                    copyItemDialog.find('.root').addClass('isparent');
                } else {
                    copyItemDialog.find('.root').addClass('browseable selectable');
                }
                currentDialog.find('.loadingTree').show();
                copyItemTreeView.LoadDataFromServer();
            },
            close: function(dialogEvent, dialogUI) {
                copyItemDialog.find('.errorText').hide();
                copyItemTreeView.RemoveTree();
                copyItemDialog.find('.root').removeClass('isparent');
                copyItemDialog.find('.root').removeClass('browseable selectable selected');
            }

        });

    };// end initializeCopyDialog

    /**
     * initialize the multi-copy dialog
     *
     * @private
     */
    var initializeMultiCopyDialog = function(){
        var multiCopyTreeView = new TreeView({wrapperID: 'multiCopyDialog', wrapperTitle:T('LABEL.Copy'), treeID: 'multiCopyTree', treeTemplate: '#multiCopyItem_tmpl', parent: 'body'} );
        var multiCopyDialog = $('#multiCopyDialog');
        multiCopyDialog.dialog({
            autoOpen: false,
            height: 400,
            width: 550,
            modal: true,
            resizable: false,
            draggable: false,
            dialogClass: 'popUpDialog multiCopyDialog',
            buttons: [{
                    text:T('LABEL.Cancel'),
                    click: function(){
                    $(this).dialog("close");
                }}, {
                    text:T('LABEL.Copy'),
                    click:function(){
                        var selectedItem = multiCopyTreeView.GetSelected();
                        if (selectedItem.tmplItem().data.DATAID !== null && selectedItem.tmplItem().data.DATAID!== undefined ) {
                            var multiCopyIDs = multiCopyDialog.data('multiCopyIDs');
                            ui.ToggleProcessingIndicatorForItemRow(multiCopyIDs);
                            SelectionController.UpdateMultiActionMenu();
                            Copy.CopyObjects(multiCopyIDs, selectedItem.tmplItem().data.DATAID);
                            $(this).dialog("close");
                        }
                    }
                }],
            open: function(dialogEvent, dialogUI){
                var currentDialog = $('.multiCopyDialog');
                $('.multiCopyDialog .ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');

                if( multiCopyDialog.data('parentID') === info.userRootFolderID) {
                    multiCopyDialog.find('.root').addClass('isparent');
                } else {
                    multiCopyDialog.find('.root').addClass('browseable selectable');
                }
                currentDialog.find('.loadingTree').show();
                multiCopyTreeView.LoadDataFromServer();
            },
            close: function(dialogEvent, dialogUI) {
                multiCopyDialog.find('.errorText').hide();
                multiCopyTreeView.RemoveTree();
                multiCopyDialog.find('.root').removeClass('isparent selected ');
                multiCopyDialog.find('.root').removeClass('browseable selectable selected');

            }

        });
    }; // end initializeMultiCopyDialog
});
