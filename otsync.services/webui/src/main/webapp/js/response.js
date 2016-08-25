/**
This object is responsible for recieving responses from OTSync.

The way this object is constructed allows JavaScript to have private and public functions but only works as a singleton.

Public functions notation:
	this.MyPublicFunction

Private function notation:
	var MyPrivateFunction

Authenticate
AuthenticateWithToken
BrowseObject
CriticalError
Error
GetAuditHistory
GetObjectPath
GetVersionHistory
SearchUser
*/
"use strict";
var response = new function () {

	/**
	 This function will process the response from a successful Authenticate request.

	 @param {Boolean} status					indicates if the authentication was successful or not
	 @param {Object} responseInfo
	 @paramFeature {String} errMsg			error message to be returned to user
	 @paramFeature {String} exceptionCode	string code to determine why response failed

	 @public
	 */
	this.Authenticate = function(status, responseInfo){

		if (status===true){
			window.location.reload();
			/*
			// TEMPO-6645
			// To avoid a problem with promise resolution and loading tabs post-Authentication
			// we are now simply refreshing the app
			// TODO: refactor the authentication handling logic to avoid this reload and duplicate server requests

			var buttonDefer = $("#loginButton").data("defer");
			user.init();

			if ( typeof buttonDefer != 'undefined' ){
				buttonDefer.resolve();
			}
			 */
		}else{

			if( typeof responseInfo != 'undefined' )
			{
				alert( responseInfo.errMsg );

				if ( responseInfo.exceptionCode=='passwordExpired' ) {

					//TODO: redirect to password change page
					//that works for reg/external users
				}
			}
		}
	};


	/**
	This function will process the response from a successful AuthenticateWithToken request.

	@param {Boolean} status					indicates if the authentication was successful or not

	@public
	*/
	this.AuthenticateWithToken = function(status){
		user.init();
	};


    /**
    This function will handle a critical error.

    @param {Object} data
    @paramFeature {Integer} readyState
    @paramFeature {String} responseText		error page (HTML format)
    @paramFeature {Integer} status			error code (eg. 404)
    @paramFeature {String} statusText		error message

    @public
    */
    this.CriticalError = function (data) {
		
		if( data.status === 500 ){
		
			alert(T('LABEL.ServerErrorConnection'));
		}
		ui.MessageController.ShowError(T('LABEL.CriticalError', {code: data.status}));
    };
	

    /**
    This function will handle an error from the response.

    @param {String} errMsg

    @public
    */
    this.Error = function (errMsg) {
		//TODO: might still need the alert in some cases?
		ui.MessageController.ShowError(errMsg);
    };


	/**
	This function will process the response from a successful GetAuditHistory request.

	@param {Array} data
	@paramFeature {} APPLICATIONID
	@paramFeature {String} AUDITDATE		audit date
	@paramFeature {Integer} AUDITID			audit ID
	@paramFeature {String} AUDITSTR			string representation of AUDITID
	@paramFeature {Integer} DATAID			object ID
	@paramFeature {String} EVENTDISPLAYNAME verbose representation of AUDITSTR
	@paramFeature {Integer} EVENTID
	@paramFeature {Integer} ID				user ID?
	@paramFeature {String} LANGUAGECODE		language code
	@paramFeature {String} MAILADDRESS
	@paramFeature {Integer} PERFORMERID		user who performed the action
	@paramFeature {Integer} SUBTYPE			object subtype
	@paramFeature {Integer} USERID			user ID
	@paramFeature {String} USERNAME			user login name
	@paramFeature {String} VALUE1			old value
	@paramFeature {String} VALUE2			new value
	@paramFeature {String} VALUEKEY

	@public
	*/
	this.GetAuditHistory = function(data){
	
		if (data instanceof Array && data.length > 0) {

			utils.AddDisplayName(data);

			if( data[0].SUBTYPE === CONST_SUBTYPE.DOCUMENT)
			{
				ui.LoadTemplateInEmptyElement("#historyItemAudit_tmpl", data, ".historyDialog .historyDataAudit");
			}
			else {
				ui.LoadTemplateInEmptyElement("#historyItemAudit_tmpl", data, ".historyDialogFolder .historyDataAudit");
			}
		}
	};


	/**
	 * This function will process the resposne from a successful GetContentsForSelection request
	 * @param {Array} folderContents		the folder contents
	 * @param {Object} targetItem			the root of the node that will be expanded
	 *
	 * @public
	 */
	this.GetContentsForSelection = function(folderContents, targetItem){


		targetItem.parent().find('.loadingTree').hide();

		if( folderContents.length <1 )
		{
			targetItem.parent().find('.errorText').show();

		}
		else
		{
			targetItem.data('treeViewObject').DrawTree(folderContents);
		}
	};

	/**
	This function will process the response from a successful GetVersionHistory request.

	@param {Array} data
	@paramFeature {String} Comment			version comment
	@paramFeature {String} CreateDate		version create date
	@paramFeature {String} FileCreateDate	version create date
	@paramFeature {} FileCreator
	@paramFeature {} FileDataSize
	@paramFeature {String} FileModifyDate	version modify date
	@paramFeature {String} FileName			version file name
	@paramFeature {Integer} FilePlatform
	@paramFeature {Integer} FileResSize
	@paramFeature {String} FileType			version file extension
	@paramFeature {String} GUID
	@paramFeature {Integer} ID				version ID
	@paramFeature {Integer} Indexed
	@paramFeature {Integer} Locked			indicates if the version is locked by a user (>0)
	@paramFeature {Integer} LockedBy		user ID who has the version locked
	@paramFeature {String} LockedDate		date version was locked
	@paramFeature {String} MIMEType			version MIME type
	@paramFeature {String} ModifyDate		version modify date
	@paramFeature {String} Name				numeric representation of the version number (ie. "1")
	@paramFeature {Integer} NodeID			object ID
	@paramFeature {Integer} Number			version number
	@paramFeature {Integer} Owner			user ID who owns the version
	@paramFeature {Integer} ProviderID
	@paramFeature {String} ProviderName
	@paramFeature {} Type
	@paramFeature {Integer} VerMajor		version major number
	@paramFeature {Integer} VerMinor		version minor number

	@public
	*/
	this.GetVersionHistory = function(data){
	
		if (data instanceof Array && data.length > 0) {
			
			utils.AddDisplayName(data);
		
			data.reverse();
			ui.LoadTemplateInEmptyElement("#historyItemVersion_tmpl", data, ".historyDataVersion");
		}
	};


    /**
    This function will process the response from a successful SearchUser request.

    @param {Array} data
    @paramFeature {String} FirstName		user first name
    @paramFeature {Integer} ID				user ID
    @paramFeature {Integer} isFollowing		?number of users the user is following?
    @paramFeature {String} LastName			user last name
    @paramFeature {String} Name				user login name
    @paramFeature {String} PhotoURL			URL to user image
    @param {Object} callback				function that can consume the search results

    @public
    */
    this.SearchUser = function (data, callback) {
		
		utils.AddDisplayName(data);

        for (var i in data) {
			if(typeof data[i].IsExternalUser === "undefined" || !data[i].IsExternalUser)
			{
				data[i]['label'] = '';
	
				if(data[i].FirstName !== null) {
					data[i]['label'] = data[i].FirstName + ' ';
				}
	
				if(data[i].LastName !== null) {
					data[i]['label'] += data[i].LastName + ' ';
				}
	
				data[i]['label'] += '(' + data[i].Name + ')';
				data[i]['value'] = '';
			}
        };

        callback(data);
    };

};
