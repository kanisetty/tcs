$.extend(UserNotificationConfig, new function(){
    
	/**
     * Add any template variables if needed here
     * @param {Object}      vars        The object that will be added with new template varabiles
     *
     * @returns {Object}                The object with the new template variables added 
     * @public
     */ 
    this.RegisterDialogVars = function(vars){
        
        vars.userNotificationConfigDialog = {
            				
            userNotificationConfigTabList : [
					{
						tabName: "Notifications",
						tabText: T('LABEL.Notifications'),
						checked: info.repo + "/img/chkbox_checked.png",
						unchecked: info.repo + "/img/chkbox.png"
					}
				]
        };
        
        return vars;
    
    };
    
    /**
     * Initialize notification dialog
     *
     * @public
     */ 
    this.InitializeUserNotificationConfigDialog = function(){
        initializeUserNotificationDialog();
    };
    
    /**
     * Initilize the notification config dialog
     *
     * @private
     */ 
    var initializeUserNotificationDialog = function(){
        var userNotificationConfigDialog = $('#userNotificationConfigDialogView');
        userNotificationConfigDialog.dialog({
            autoOpen: false,
            height: 350,
            width: 500,
            modal: true,
            resizable: false,
            draggable: false,
            dialogClass: 'popUpDialog userNotificationConfigDialog',
            buttons: [{
				text: T('LABEL.Cancel'),
                click: function(){				
                    $(this).dialog("close");
                }},
                {
                text: T('LABEL.SaveSettings'),
                click: function(){
                    UserNotificationConfig.SaveUserNotificationConfig(info.userID);
					$(this).dialog("close");
                }}
                ],
            open: function(dialogEvent, dialogUI){
				$("#userNotificationConfigTabs").tabs();
                $('.userNotificationConfigDialog .ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');				
				$("#notificationConfigShareRequest").checkbox(info.settings.notifyOnShareRequest);
				$("#notificationConfigTaskAssigned").checkbox(info.settings.notifyOnTaskAssigned);
				$("#notificationConfigFolderChange").checkbox(info.settings.notifyOnFolderChange);
            },
            close: function(dialogEvent, dialogUI) {
				$("#notificationConfigShareRequest").empty();
				$("#notificationConfigTaskAssigned").empty();
				$("#notificationConfigFolderChange").empty();
            }				
        });
    };
});
