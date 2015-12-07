var FileUploadController = new function(){
   var _uploadPictureFileController = null;

   /**
    * generate a singleton object for uploading new file
    *
    * @param {Object} options		options used to initialize the fileuploadcontroller
    * @returns {Object}			a fileuploadcontroller object
    *
    *	@public
    */
   this.GetUploadPictureFileController = function(options)
   {
       if(_uploadPictureFileController === null)
       {
           _uploadPictureFileController = new FileUpload(options);
           _uploadPictureFileController.Initialize();
       }

       return _uploadPictureFileController;
   }

   var _uploadNewFileController = null;
   /**
    * generate a singleton object for uploading new file
    *
    * @param {Object} options		options used to initialize the fileuploadcontroller
    * @returns {Object}			a fileuploadcontroller object
    *
    *	@public
    */
   this.GetUploadNewFileController = function(options)
   {
       if(_uploadNewFileController === null)
       {
           _uploadNewFileController = new FileUpload(options);
           _uploadNewFileController.Initialize();
       }

       return _uploadNewFileController;
   }

   var _addNewVersionController = null;
   /**
    * generate a singleton object for adding a new version
    *
    * @param {Object} options		options used to initialize the fileuploadcontroller
    * @returns {Object}			a fileuploadcontroller object
    *
    *	@public
    */
   this.GetAddNewVersionController = function(options)
   {
       if(_addNewVersionController === null)
       {
           _addNewVersionController = new FileUpload(options);
           _addNewVersionController.Initialize();
       }

       return _addNewVersionController;
   }

   this.UnRegisterFileUpload = function(options)
   {
		if(_addNewVersionController != null )
		{
			_addNewVersionController.RemoveDropZone();
		}

		if(_uploadNewFileController != null){

			_uploadNewFileController.RemoveDropZone();
		}
   }

   this.AddDropZone = function(){
		_uploadNewFileController.AddDropZone();
   }
};

/**
* class definition for managing file upload
*
* @public
*/
var FileUpload = function(options)
{
   var default_options = {upload: 'FileUpload', fileInputID: 'fileupload', triggerElementSelector: '#uploadButton'  };
   options = $.extend({}, default_options, options);

   var self = this;
   //variable to check whether it's uploading a new file or adding a version. true for uploading, false for adding a version;
   var upload = options.upload;

   var triggerElementSelector = options.triggerElementSelector;

   var fileInputID = options.fileInputID;

   var fileInputSelector = '#' + fileInputID;

   var currentUploadData = null;

   var MAXFILESIZE = 2*1024*1024*1024;

   /**
    * detect the browser
    *
    * @returns {Boolean}  true if IE or FF4-
    */
   this.BrowserNeedNativeFileUpload = function()
   {
       if($.browser.msie)
       {
           return true;
       }
       if($.browser.mozilla)
       {
           return true; // return true for FF, temporarily solve the 500 error
           var geckoVersion = $.browser.version;
           var majorVersion = geckoVersion.substring(0, 1);
           if(majorVersion==='1' || majorVersion === '0' )
           {
               return true;
           }
       }
       return false;
   };
   /**
    * toggle display of the file upload area for IE and lower version browser
    *
    * @public
    */
   this.ToggleFileUploadArea = function()
   {
       var panel = $('#uploadFile');
       if(panel.length === 0)
       {
           //remove the new folder panel
           $('#newFolder').remove();
           var templateVar = {
               fileInput: {wrapperClasses: 'fileUploadWrapper', type: 'file', id: fileInputID, name: 'versionFile', value: ''},
               uploadButton: {id: 'fileUploadSubmit', textLeft: 'Upload'},
               cancelButton: {id: 'fileUploadCancel', textLeft: 'Cancel'}
               };
           $("#uploadFile_tmpl").template(templateVar).insertAfter('#columnHeaderWrapper');
           self.RegisterPlugIn();
       }
       else
       {
           panel.remove();
       }
   };

   /**
    * toggle display of the file upload area for IE and lower version browser
    *
    * @public
    */
   this.TogglePictureUploadArea = function()
   {
       var panel = $('#uploadPicture');
       if(panel.length === 0)
       {
           var templateVar = {
               fileInput: {type: 'file', id: fileInputID, name: 'Photo', value: ''}
               };
           $("#uploadPicture_tmpl").template(templateVar).appendTo('.uploadPicWidgetWrapper');
           self.RegisterPlugIn();
       }
       else
       {

           panel.remove();
       }
   };

   var currentAddVersionNode = 0;
   /**
    * toggle display of the add version area for IE and lower version browser
    *
    * @public
    */
   this.ToggleAddVersionArea = function(data, container)
   {

       var panel = $('#addVersion');
       if(data.DATAID!== currentAddVersionNode)
       {
           panel.remove();
       }

       currentAddVersionNode = data.DATAID;
       panel = $('#addVersion');
       if(panel.length === 0)
       {
           //remove the rename panel
           $('.renameItem').remove();
           var templateVar = {
               fileInput: {wrapperClasses: 'addVersionWrapper', type: 'file', id: fileInputID, name: 'versionFile', value: ''},
               uploadButton: {id: 'addVersionSubmit', textLeft: T('LABEL.AddVersion')},
               cancelButton: {id: 'addVersionCancel', textLeft: T('LABEL.Cancel')}
               };

           $("#addVersion_tmpl").template(templateVar).appendTo(container);
           self.RegisterPlugIn();
           self.GetFileInputDom().data('dataID', data.DATAID);
       }
       else
       {
           panel.remove();
       }
   };
   /**
    * initialize the upload functionality
    * 1. add the input widget to the page
    * 2. register the input widget with the plugin
    *
    * @public
    */
   this.Initialize = function()
   {
       //for browsers that require native file upload widget
       if(self.BrowserNeedNativeFileUpload() || upload === 'UploadProfilePicture')
       {
           if(upload == 'FileUpload')
           {
               $('body').delegate(triggerElementSelector, 'click', function(){
                   self.ToggleFileUploadArea();
               });
               $('body').delegate('#fileUploadCancel', 'click', function(){
                   self.ToggleFileUploadArea();
               });

               $('body').delegate('#fileUploadSubmit', 'click', function(){
                   if(currentUploadData === null)
                   {
                       return;
                   }
                   self.ToggleFileUploadArea();
                   self.SubmitData(currentUploadData);
               });
               $('body').delegate(fileInputSelector, 'hover', function(){
                   $('#fileUploadWidgetTextPlaceHolder').remove();
               });
               $('body').delegate('#fileUploadWidgetTextPlaceHolder', 'hover', function(){
                   $('#fileUploadWidgetTextPlaceHolder').remove();
               });
               $('body').delegate(fileInputSelector, 'focus', function(){
                   $('#fileUploadWidgetTextPlaceHolder').remove();
               });
           }
           else if(upload == 'AddVersion'){
               $('body').delegate('.objectAddVersion', 'click', function(e){
                   e.stopPropagation();
                   var targetObj = $(this);

				   if($(".objectAddVersion").isChildOf(".thumbnailViewBrowseItem")){

						var data = targetObj.parents('.thumbnailViewBrowseItem').tmplItem().data;
						targetObj.parents('.thumbnailViewBrowseItem').find('.dropDownMenu').hide();
						self.ToggleAddVersionArea(data, targetObj.parents('.itemInfo').find('.thumbnailViewBrowseItemInfo'));
					}
					else{
						var data = targetObj.parents('.browseItem').tmplItem().data;


					   //Hide the dropdown when AddVersion is clicked. Because the dropdown is brought out
					   //by the mouse hover event, so if the user does not move the mouse, we have to force the whole
					   //dropdown area to disapear. Then we have to bring the more button back after that.
					   targetObj.parents('.browseItem').find('.BrowseMoreMenu').hide();
					   setTimeout(function(){targetObj.parents('.browseItem').find('.BrowseMoreMenu').show()}, 50);

					   //when use keyboard(TAB), remove the dropdown's active state
					   targetObj.parents('.browseItem').find('.BrowseMoreMenu .dropdown button').removeClass('moreMenuButtonActive');

					   self.ToggleAddVersionArea(data, targetObj.parents('.itemInfo').find('.itemIconNameActionWrapper'));
					}
               });

               $('body').delegate('#addVersionCancel', 'click', function(e){
                   e.stopPropagation();

					if($('#addVersionCancel').isChildOf(".thumbnailViewBrowseItem")){

						var data = $(this).parents('.thumbnailViewBrowseItem').tmplItem().data;
					}
					else{
						var data = $(this).parents('.browseItem').tmplItem().data;
					}
                   self.ToggleAddVersionArea(data, $(this).parents('.itemInfo'));
               });

               $('body').delegate('#addVersionSubmit', 'click', function(e){
                   e.stopPropagation();
                   if(currentUploadData === null)
                   {
                       return;
					}

					if($('#addVersionSubmit').isChildOf(".thumbnailViewBrowseItem")){

					var data = $(this).parents('.thumbnailViewBrowseItem').tmplItem().data;
					}
					else{
						var data = $(this).parents('.browseItem').tmplItem().data;
					}
                   self.ToggleAddVersionArea(data, $(this).parents('.itemInfo'));
                   self.SubmitData(currentUploadData);
               });
               $('body').delegate(fileInputSelector, 'click', function(e){
                   e.stopPropagation();
               });
               $('body').delegate(fileInputSelector, 'hover', function(){
                   $('#addVersionWidgetTextPlaceHolder').remove();
               });
               $('body').delegate('#addVersionWidgetTextPlaceHolder', 'hover', function(){
                   $('#addVersionWidgetTextPlaceHolder').remove();
               });
               $('body').delegate(fileInputSelector, 'focus', function(){
                   $('#addVersionWidgetTextPlaceHolder').remove();
               });
           }else if(upload == 'UploadProfilePicture'){

           }

           return;
       }

       //for modern browsers
       if($(fileInputSelector).length <= 0 && upload != 'UploadProfilePicture')
       {
           self.GetInputFileWidget().appendTo('body');
           //register for event
           if(upload == 'FileUpload') //upload a new file
           {
               $('body').delegate(triggerElementSelector, 'click', function(){
                   self.ShowFileChooser();
               });

           }else if(upload=='AddVersion') // add a new version
           {
               $('body').delegate('.objectAddVersion', 'click', function(e){
                   e.stopPropagation();

				   if($(".objectAddVersion").isChildOf(".thumbnailViewBrowseItem")){

						var data = $(this).parents('.thumbnailViewBrowseItem').tmplItem().data;
					}
					else{
						var data = $(this).parents('.browseItem').tmplItem().data;
					}

				   //get the dataID and store it
                   self.GetFileInputDom().data('dataID', data.DATAID);
                   self.ShowFileChooser();
               });
           }

           self.RegisterPlugIn();
       }

   };

   /**
    * submit the data to the server
    *
    * @param {Object}	data	the plugin-prepared data
    * @public
    */
   this.SubmitData = function(data){
       data.context = ui.MessageController.ShowProcessInfo(T('LABEL.UploadQueued', {name: data.files[0].name}));
       var defer = $.Deferred();
       var parentID;
       var dataID;
       if(!self.BrowserNeedNativeFileUpload())
       {
           if(upload == 'FileUpload')
           {
               parentID = ui.GetCurrentNodeID() ? ui.GetCurrentNodeID() : info.userRootFolderID;
           }else if(upload == 'AddVersion')
           {
               dataID = self.GetFileInputDom().data('dataID');
           }
       }

       defer = queue.AddUpload(utils.GenerateUUID(), function(){
           data.context.find('.notificationText').text(T('LABEL.UploadInProcess', {name: data.files[0].name}));

           //for chrome and FF4+, set the upload parameters here to prevent the parameters to be overwritten by a successive upload from DragNDrop
           if(!self.BrowserNeedNativeFileUpload() && upload !== 'UploadProfilePicture')
           {
               if(upload == 'FileUpload')
               {
                   self.SetFileUploadData(data.files[0].name, parentID);
               }else if(upload == 'AddVersion')
               {
                   self.SetVersionAddData(data.files[0].name, dataID);
               }
               else if(upload == 'UploadProfilePicture')
               {
                   self.SetPictureUploadData(data.files[0].name);
               }
           }
           data.submit().fail(function(data){
               	   	if (data.status == 404){
					   						ui.MessageController.ShowError(T('LABEL.UploadFileError'));
				   					}else{
					   						ui.MessageController.ShowError(T('LABEL.ServerError'));
				   					}
               }
           ).done(function(){
               //update the user pic if user uploads a new profile picture
               if(upload === 'UploadProfilePicture')
               {
                  $('#userPic').attr('src', user.GetProfilePicUrl());
               }
            })
           .always(function(){
               data.context.remove();
               defer.resolve();
           });
       });
       currentUploadData = null;
       self.GetFileInputDom().val('');
   };
   /**
    * register the inputfile widget with the plugin
    *
    * @public
    */
   this.RegisterPlugIn = function()
   {
       //register the field with the plugin
       var uploadSettings = {
           replaceFileInput: false,
           dataType: 'json',
           url: 'ContentChannel',
           dropZone:(upload == 'FileUpload') ? $(document) : null,
           forceIframeTransport: (self.BrowserNeedNativeFileUpload() && upload !== 'UploadProfilePicture' )? true:false,
           done: function (e, data) {

               var validResult = false;

               if(data!==null)
               {
                   if(data.hasOwnProperty("result"))
                   {
                       if(data.result!==null)
                       {
                           if(data.result.hasOwnProperty("info"))
                           {
                               validResult=true;
                               var result= data.result.info;
                               if(result.ok)
                               {
                                   var message;

                                   if(upload == 'FileUpload')
                                       message = T('LABEL.FileUploadConfirmation', {name: result.results.name});
                                   else if(upload == 'AddVersion')
                                       message = T('LABEL.VersionAddConfirmation', {name: $('#browseFile-'+result.results.id).tmplItem().data.NAME});
                                   else if(upload == 'UploadProfilePicture'){
                                       message = T('LABEL.ProfilePictureUploadConfirmation');
                                       $("#profilePhoto").attr("src", ui.GetProfilePicUrl(info.userID));
                                   }

                                   ui.MessageController.ShowMessage(message);
                                   //clear the cache to always return fresh data
                                   if(upload !== 'ProfilePictureUpload'){
                                       queue.ClearCache("requestgetfoldercontents");
                                       Browse.BrowseObject(ui.GetCurrentNodeID());
                                   }
                               }else
                               {
                                   ui.MessageController.ShowError(unescape(result.errMsg));
                               }
                           }
                       }
                   }
               }
               if(!validResult)
               {
                   ui.MessageController.ShowError(T('LABEL.ServerError'));
               }

           },

           add: function (e, data) {

               //prevent 0 byte file
               if(data.files[0].size === 0)
               {
                   ui.MessageController.ShowError(T('LABEL.ZeroByteFileError'));
                   return;
               }
               if(data.files[0].size >= MAXFILESIZE)
               {
                   ui.MessageController.ShowError(T('LABEL.LargeFileError'));
                   return;
               }

               if(upload == 'UploadProfilePicture'){
                   //this is to make sure we only allow gif, png, jpg files to be uploaded
                   var ext = data.files[0].name.split('.').pop().toLowerCase();

                   if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
                       $("#profilePictureError").text(T('LABEL.InvalidProfilePhotoFileExtension'));
                       return;
                   }else{
                       $("#profilePictureError").text('');
                   }
               }


               if(self.BrowserNeedNativeFileUpload() || upload === 'UploadProfilePicture')
               {
                   //for IE and FF4-, set the upload parameters here before calling SubmitData, as setting them in SubmitData causes unexpected error
                   if(upload == 'FileUpload')
                   {
                       self.SetFileUploadData(data.files[0].name);
                   }else if(upload == 'AddVersion')
                   {
                       //retrieve the dataID
                       var dataID = self.GetFileInputDom().data('dataID');
                       self.SetVersionAddData(data.files[0].name, dataID);
                   }
                   else if(upload == 'UploadProfilePicture')
                   {
                       self.SetPictureUploadData(data.files[0].name);
                   }
                   currentUploadData = data;
               }else
               {
                   self.SubmitData(data);
               }


           }
       };
       $(fileInputSelector).fileupload(uploadSettings);



       //IE, FF4- does not support progress bar
       if(!self.BrowserNeedNativeFileUpload())
       {
           $(fileInputSelector).fileupload('option', 'progress', function(e, data){

               if(data.context)
               {
                   var progress = parseInt(data.loaded / data.total * 100, 10);

                   if(progress>=99)
                   {
                       data.context.find('.notificationPercent').text('');
                       data.context.find('.notificationText').text(T('LABEL.UploadContentServerProcess'));
                   }
                   else
                   {
                       data.context.find('.notificationPercent').text(progress + '%');
                   }
               }
           });
       }
   };

	this.RemoveDropZone = function()
	{
		$(fileInputSelector).fileupload({dropZone:null});
	}
	this.AddDropZone = function()
	{
		$(fileInputSelector).fileupload({dropZone:(upload == 'FileUpload') ? $(document) : null});

	}



   /**
    * return the temporary dom object of the fileinput widget
    *
    * @public
    */
   this.GetInputFileWidget = function(){
       var style='style="position: absolute; left: -9999px;"';
       var multiple = (upload == "FileUpload") ? ' multiple' : '';
       //disable mulitple upload for now
       multiple = '';
       return $('<input id="'+ fileInputID+'" type="file" name="versionFile" '+ style + multiple + '>');
   };

   /**
    * set the extra data to be sent to the server for uploading a file
    *
    * @param {String}	fileName	the file name of the file being uploaded
    * @public
    */
   this.SetFileUploadData = function(fileName, parentID){
       //if parentID is passed in, use it. otherwise use the current node ID;
       var id = parentID?parentID:(ui.GetCurrentNodeID() ? ui.GetCurrentNodeID() : info.userRootFolderID);
       var formData = {
           "func": "otsync.otsyncrequest",
           "payload": JSON.stringify({ type: 'content',
                                       subtype: 'upload',
                                       contentType: 'html',
                                       info:{parentID: id, name: fileName}
                                     }),
           "name": fileName
       };

       $(fileInputSelector).fileupload('option', 'formData', formData);
   };

   /**
    * set the extra data to be sent to the server for uploading a file
    *
    * @param {String}	fileName	the file name of the file being uploaded
    * @public
    */
   this.SetPictureUploadData = function(fileName){
       var formData = {
           "func": "otsync.otsyncrequest",
           "payload": JSON.stringify({ type: 'content',
                                       subtype: 'UploadProfilePhoto',
                                       contentType: 'html'
                                     }),
           "name": fileName
       };

       $(fileInputSelector).fileupload('option', 'formData', formData);
   };

   /**
    * set the extradata to be sent to the server for adding a new version
    *
    * @param {String}	fileName	the file name of the file being uploaded
    * @param {Integer} nodeID		the nodeID of which a new version is added
    *
    * @public
    */
   this.SetVersionAddData = function(fileName, nodeID){
       var formData = {
           "func": "otsync.otsyncrequest",
           "payload": JSON.stringify({ type: 'content',
                                       subtype: 'uploadversion',
                                       contentType: 'html',
                                       info:{nodeID: nodeID, name: fileName}
                                       }),
           "name": fileName
       };

       $(fileInputSelector).fileupload('option', 'formData', formData);
   };

   /**
    * display the file chooser dialog by sending a click event to the file input
    *
    * @public
    */
   this.ShowFileChooser = function()
   {
       $(fileInputSelector).click();
   };

   /**
    * get the fileInput dom
    *
    * @returns {Object}
    * @public
    */
   this.GetFileInputDom = function()
   {
       return $(fileInputSelector);
   };

   /**
    * get the currentUploadData
    *
    * @returns {Object}          this object is used to check whether there is somethign to upload
    *                            when:
    *                            1. is non-morden browse
    *                            2. uploading a profile picture
    * @public
    */
   this.GetCurrentUploadData = function(){
       return  currentUploadData;
   };
};
