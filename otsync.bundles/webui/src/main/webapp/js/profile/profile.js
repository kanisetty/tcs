var UserProfile = new function(){
    
    /**
     * Get the jQuery dom element of the profile dialog
     *
     * @returns {Object}
     * @public
     */ 
    this.GetDialogDom = function(){
        return $('#profilePictureDialogView');
    }
    /**
     * Reset the profile dialog
     *
     * @public
     */ 
    this.Reset = function(){
        $('#profilePictureError').text('');
        $('#passwordMismatchError').hide();
        $('.newPassword2TextRight').removeClass('passwordError');
        $('.newPassword2TextRight').removeClass('passwordOK');
        $('#currentPassword').val('');
        $('#newPassword1').val('');
        $('#newPassword2').val('');
        FileUploadController.GetUploadPictureFileController().TogglePictureUploadArea();
    };
    
    /**
     * Save the profile picture and/or the new password
     *
     * @param {Object} dialog       The dom object of the profile dialog
     * 
     * @public
     */ 
    this.SaveChanges = function(dialog){
        var letItGo = UserProfile.SavePassword();
        if(letItGo){
            UserProfile.SaveProfilePicture();
            dialog.dialog('close');
        }
    };
    
    /**
     * Save password
     *
     * @returns {Boolean}           if the new password is set and validated, return ture;
     *                              if the new password is not set, return true;
     *                              if the new password is set but not validated, return false;
     * @public
     */ 
    this.SavePassword = function(){
        //return true for non-external user
        if(!info.canChangePassword)
        {
            return true;
        }
        
        var oldPassword = $('#currentPassword').val();
        var newPassword1 = $('#newPassword1').val();
        var newPassword2 = $('#newPassword2').val();
        if( newPassword1 === newPassword2 ){
            
            if(oldPassword !=='' && newPassword1!=='' )
            {
                $('#changePasswordButton').attr('disabled', true);
                $('#changePasswordButton .ui-button-text').text(T('LABEL.SettingPassword'));
                UserProfile.UpdatePassword(oldPassword, newPassword1);
                return true;
            }
            if(newPassword1 === '')
            {
                return true;
            }
        }
        else{
            $('#passwordMismatchError').fadeIn('fast');
            $('.newPassword2TextRight').removeClass('passwordOK').addClass('passwordError').show();
        }
        return false;
  
    };
    
    /**
     * Set the profile picture. Call FileUpload methods.
     *
     * @public
     */ 
    this.SaveProfilePicture = function(){
        var uploader = FileUploadController.GetUploadPictureFileController();
        if(uploader.GetFileInputDom().val()!== '' )
        {
            if(uploader.GetCurrentUploadData() !== null)
            {
                uploader.SubmitData(uploader.GetCurrentUploadData());
            }
        }
    };
    
    /**
     * Add events
     *
     * @public
     */ 
    this.AddEvents = function(){
        var bodyTag = $('body');
        
        bodyTag.delegate('#newPassword1, #newPassword2', 'keyup', function(){
            var newPassword1 = $('#newPassword1').val();
            var newPassword2 = $('#newPassword2').val();
            
            if(newPassword1 === '' & newPassword2 === '')
            {
                $('.newPassword2TextRight').removeClass('passwordOK');
                $('.newPassword2TextRight').removeClass('passwordError');
                $('#passwordMismatchError').hide();
                return;
            }
            if(newPassword1 !== newPassword2){
                $('#passwordMismatchError').show();
                $('.newPassword2TextRight').removeClass('passwordOK').addClass('passwordError');
            }
            else{
                $('.newPassword2TextRight').removeClass('passwordError').addClass('passwordOK');
                 if($('#passwordMismatchError').is(':visible')){
                     $('#passwordMismatchError').hide();
                 } 
            }		
        });
        
        bodyTag.delegate('#useDefaultProfile', 'click', function(){
            UserProfile.DeleteProfilePhoto();	
            UserProfile.GetDialogDom().dialog("close");
        });
    };
};