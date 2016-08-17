/**
 * Extend the Share Object with functions that build the dialogs
 *
 * public methods:
 * RegisterDialogVars
 * InitializeShareFolderDialogs
 *
 **/

$.extend(Share, new function () {
    this.seeAllShareRequestsDialog = null;


    /**
     This method is called by dialogs.js in order to register the dialog

     */
    this.RegisterDialogVars = function (vars) {
        vars.seeAllShareRequestsDialog = {
            title: T('LABEL.SharingRequests'),
            shareFolderUserInput: {
                id: 'shareFolderUserInput',
                type: 'text',
                name: 'shareFolderUserInput',
                instructionText: T('LABEL.SelectUserToShareWith'),
                classes: 'shareFolderUserInput',
                wrapperClasses: 'shareFolderUserInputWrapper'
            },
            shareFolderAddUserButton: {
                id: 'addUser',
                name: 'adduser',
                textRight: T('LABEL.Add'),
                classes: 'addUser'
            }
        };

        return vars;
    }

    this.InitializeShareDialogs = function () {
        _InitializeSeeAllShareRequestsDialog();
    }

    var _pendingShareRequestNodeIDs = [];

    var _GetPendingShareIDs = function () {
        _pendingShareRequestNodeIDs = [];

        if (Share.sharingRequests != null) {
            $.each(Share.sharingRequests, function (index, value) {
                _pendingShareRequestNodeIDs.push(value.DataID);
            });
        }

        return _pendingShareRequestNodeIDs;
    }

    var _InitializeSeeAllShareRequestsDialog = function () {
        ui.LoadTemplate("#seeAllSharingRequestsTemplate_tmpl", null, '#dialogs');
        Share.seeAllShareRequestsDialog = $('#seeAllSharingRequests');

        Share.seeAllShareRequestsDialog.dialog({
            title: T('LABEL.SharingRequests'),
            modal: true,
            bgiframe: true,
            width: 515,
            height: 550,
            closeOnEscape: true,
            draggable: false,
            resizable: false,
            dialogClass: 'popUpDialog seeAllSharingRequestsDialog',
            autoOpen: false,
            buttons: [
                {
                    text: T('LABEL.Cancel'),
                    click: function () {
                        //reload the content area
                        Browse.BrowseObject(ui.GetCurrentNodeID());

                        //update the share summary menu
                        Share.GetPendingShareRequestSummary();

                        $(this).dialog("close");
                    }
                },
                {
                    text: T('LABEL.AcceptAll'),
                    click: function () {
                        Share.AcceptAllShareRequests(_GetPendingShareIDs());
                        $(this).dialog("close");
                    }
                }
            ],//end buttons
            open: function (dialogEvent, dialogUI) {

                ui.LoadTemplateInEmptyElement("#shareRequestItemFull_tmpl", Share.sharingRequests, "#seeAllSharingRequests");

                Dialogs.CorrectTabOrder(".seeAllSharingRequestsDialog", false);

                $(".seeAllSharingRequestsDialog a").first().focus();
            },
            close: function (dialogEvent, dialogUI) {
            }
        });

        // add a blank anchor to fix the tab order when tabbing through a confirm-reject scenario
        $(".seeAllSharingRequestsDialog .ui-dialog-title").wrap('<a href="#" onclick="return false;" style="float: left;" />');

        Share.seeAllShareRequestsDialog.bind('requestsUpdated', function (event, ID) {
            // TODO: add trigger on getsharelist and update sharing requests in this dialogs
        });

    }; // end _InitializeConfrimationDialog

});
