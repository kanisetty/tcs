$.extend(UserProfile, new function(){
    
    this.RegisterDialogVars = function(vars){
        
        vars.profilePictureAndPasswordDialog = {
            title:T('LABEL.MyProfile'),						
            changeProfilePictureSection: {
            userProfileImageUrl: user.profilePicUrl
            },
            changePasswordSection: {
            mismatchMessage:T('LABEL.MismatchedPasswords'),
            currentPasswordInput: {
                id:'currentPassword',
                    textRight:T('LABEL.CurrentPassword'),
                type:'password',
                    wrapperClasses: 'currentPasswordWrapper'
            },
            newPasswordInput1: {
                id:'newPassword1',
                    textRight:T('LABEL.NewPassword'),
                type:'password',
                    wrapperClasses: 'newPassword1Wrapper'
            },
            newPasswordInput2: {
                id:'newPassword2',
                    textRight:T('LABEL.NewPassword2'),
                type:'password',
                    wrapperClasses: 'newPassword2Wrapper'
                }
            }
        };
        
        return vars;
    
    };
    this.InitializeProfileDialogs = function(){
        initializePictureAndPasswordDialog();
        var options = {
                upload: 'UploadProfilePicture',
                fileInputID: 'pictureUploadInput',
                triggerElementSelector: '.myProfileLink'};
        FileUploadController.GetUploadPictureFileController(options);
    };
    
    var initializePictureAndPasswordDialog = function(){
        var profilePictureDialog = $('#profilePictureDialogView');
        profilePictureDialog.dialog({
            autoOpen: false,
            height: info.canChangePassword? 510 : 325,
            width: 500,
            modal: true,
            resizable: false,
            draggable: false,
            dialogClass: 'popUpDialog profilePictureDialog',
            buttons: [{
            text: T('LABEL.Cancel'),
                click: function(){				
                    $(this).dialog("close");
                }},
                {
                text: T('LABEL.SaveChanges'),
                click: function(){
                    UserProfile.SaveChanges(profilePictureDialog);
                },
                id: "pictureUploadSubmit"}
                ],
            open: function(dialogEvent, dialogUI){
                FileUploadController.GetUploadPictureFileController().TogglePictureUploadArea();
                var currentDialog = $('.profilePictureDialog');
                Dialogs.CorrectTabOrder(".profilePictureDialog");
                $('.profilePictureDialog .ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');
            },
            close: function(dialogEvent, dialogUI) {
                UserProfile.Reset();
            }				
        });
    };
});