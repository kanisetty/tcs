$.extend(UserProfile, new function(){
    
    var response = new function(){
        /**
        This function will process the response from a successful Delete Profile Photo request.
    
        @param {Boolean} error					whether an error has occurred
        
        @public
        */
        this.DeleteProfilePhoto = function(error){		
            if(error)
                ui.MessageController.ShowError(T('LABEL.DeleteProfilePhotoError'));	
            else
			{
				$("#profilePhoto").attr("src", user.GetProfilePicUrl());
				//reset the user profile picture;
				$("#userPic").attr("src", user.GetProfilePicUrl());
                ui.MessageController.ShowMessage(T('LABEL.DeleteProfilePhotoSuccess'));					
			}
        };

    };
    /**
	This function will delete the profile photo.
	
	@private
	*/
	var _DeleteProfilePhoto = function(){
		
		var type = 'request';
		var subtype = 'DeleteProfilePhoto';
		var requestID = type + subtype;
		
		var requestData = new request.ObjectRequestSet(type, subtype);	
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
    
    /**
     * This function will change the user password
     * 
     * @param {String} oldPassword          user's old password
     * @param {String} newPassword          user's new password
     * @private
     */ 
    var _UpdatePassword = function(oldPassword, newPassword){
		
		var type = 'request';
		var subtype = 'changepassword';
		var requestID = type + subtype + "(" + Math.floor(Math.random()*65536)  + ")";
		
		var requestData = new request.ObjectRequestSet(type, subtype);
		
		requestData.info = {
			oldPassword: oldPassword,
			newPassword: newPassword
		};
		
		var ajaxData = new request.ObjectFrontChannel(requestData);
		
		return queue.AddSet(requestID, ajaxData);
	};
    
    /**
	This function will delete the profile picture.

	@param {Integer} nodeID					object ID
	@param {String} name					new name
	
	@public
	*/
	this.DeleteProfilePhoto = function(){
		
		return $.when(_DeleteProfilePhoto()).pipe(request.ValidateResponse)
		.done(function(resultData){
			response.DeleteProfilePhoto(false);
		})
		.fail(function(){
			response.DeleteProfilePhoto(true);
		});
	};
    
    /**
	This function will update the current user's password

	@param {String} oldPassword					user's current password (will be verified before changing)
	@param {String} newPassword					desired new password

	@public
	*/
	this.UpdatePassword = function(oldPassword, newPassword){		
		
		return $.when(_UpdatePassword(oldPassword, newPassword))
		.pipe(request.ValidateResponse)
		.done(function(resultData){
			ui.MessageController.ShowMessage('password changed');
		})
		.fail(function(responseData){
		});
	};
});
