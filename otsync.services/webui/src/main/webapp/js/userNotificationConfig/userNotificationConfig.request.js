$.extend(UserNotificationConfig, new function(){

	/**
     This function will process the response from a successful user notifictaion config request.

     @param {object} 	response data

     @public
    */
	this.GetUserNotificationSettings = function(data){
			info.settings = data;
	};


	/**
	This function will get the users current notification settings.

	@param {Integer} userID					userID

	@public
	*/
	this.GetUserNotificationConfig = function(userID){

		return $.when(_GetUserNotificationConfig(userID)).pipe(request.ValidateRestResponse).done(function(resultData){
			UserNotificationConfig.GetUserNotificationSettings(resultData);
		});
	};

	/**
	This function will get the users current notification settings

	@private
	*/
	var _GetUserNotificationConfig = function(userID){

		var type = 'request';
		var subtype = 'notificationConfig';
		var requestID = type + subtype +"(" + Math.floor(Math.random()*65536)  + ")";
		var url = 'v5/users/'+userID+'/settings';
		var ajaxData = new request.RestAPIRequest(url, 'GET');

		// Cache successful results for 60 seconds.
		ajaxData.cacheDuration = 60000;

		return queue.AddGet(requestID, ajaxData);

	};
	/**
     * Save user notifications settings
     *
     * @returns {Boolean}
     *
     * @public
     */
    this.SaveUserNotificationConfig = function(userID){

		var notifyOnFolderChangeValue = false;
		var notifyOnShareRequestValue = false;
		var notifyOnTaskAssignedValue = false;

		if($("#notificationConfigShareRequest").checkbox("isChecked"))
		{
			notifyOnShareRequestValue = true;
		}
		if($("#notificationConfigTaskAssigned").checkbox("isChecked"))
		{
			notifyOnTaskAssignedValue = true;
		}
		if($("#notificationConfigFolderChange").checkbox("isChecked"))
		{
			notifyOnFolderChangeValue = true;
		}

		info.settings.notifyOnFolderChange = notifyOnFolderChangeValue;
		info.settings.notifyOnShareRequest = notifyOnShareRequestValue;
		info.settings.notifyOnTaskAssigned = notifyOnTaskAssignedValue;

		return $.when(_SetUserNotificationConfig(notifyOnFolderChangeValue, notifyOnShareRequestValue, notifyOnTaskAssignedValue))
		.pipe(request.ValidateResponse)
		.done(function(resultData){
			Browse.UpdateObjectInfo();
			ui.MessageController.ShowMessage(T('LABEL.NotificationsSaved'));
		})
		.fail(function(responseData){
		});
    };
	/**
	This function will set the users notification settings

	@private
	*/
	var _SetUserNotificationConfig = function(notifyOnFolderChangeValue, notifyOnShareRequestValue, notifyOnTaskAssignedValue){

		var type = 'request';
		var subtype = 'setsettings';
		var requestID = type + subtype + "(" + Math.floor(Math.random()*65536)  + ")";

		var requestData = new request.ObjectRequestSet(type, subtype);

		requestData.info = {
			notifyOnFolderChange: notifyOnFolderChangeValue,
			notifyOnShareRequest: notifyOnShareRequestValue,
			notifyOnTaskAssigned: notifyOnTaskAssignedValue
		};

		var ajaxData = new request.ObjectFrontChannel(requestData);

		return queue.AddSet(requestID, ajaxData);

	};

});
