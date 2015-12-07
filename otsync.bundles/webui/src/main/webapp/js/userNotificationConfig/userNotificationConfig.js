var UserNotificationConfig = new function(){
    this.AddEvents = function(){
        
		var bodyTag = $('body');
        
        bodyTag.delegate('.userNotificationConfigLink', 'click', function(e){
			e.stopPropagation();
			return UserNotificationConfig.userNotificationConfigDialog();
		});
		
    };
	this.userNotificationConfigDialog = function(){
		$('#userNotificationConfigDialogView').dialog('open');
		return false;
	}
};
