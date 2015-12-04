/**
This method will add the indexOf method for IE8 and below, to be compatible with other browsers.

@param {Any}     value				Element to locate in the array
@param {Integer} start				The index at which to begin the search. Defaults to 0

*/
if(!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(value, start)
	{
		for(var i=(start || 0); i<this.length; i++)
		{
			if (this[i] === value)
			{
				return i;
			}
		}
		return -1;
	}
}
/**
This method will add the filter method for IE8 and below, to be compatible with other browsers.
From: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter

@param {Function}		fun		Function to test each element of the array. Invoked with arguments (element, index, array). Return true to keep the element, false otherwise.
@param {Any} 			thisp		Optional. Value to use as this when executing callback.

*/
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}


// A no-dependancy quick and dirty method of adding basic
// placeholder functionality to Internet Explorer 5.5+
// Author: Jay Williams <myd3.com>
// License: MIT License
// Link: https://gist.github.com/1105055

function isPlaceholderSupported()
{
    var input = document.createElement("input");
    return ('placeholder' in input);
}

function add_placeholder (id, placeholder)
{
	var el = document.getElementById(id);
	el.placeholder = placeholder;

    el.onfocus = function ()
    {
		if(this.value == this.placeholder)
		{
			this.value = '';
			el.style.cssText  = '';
		}
    };

    el.onblur = function ()
    {
		if(this.value.length == 0)
		{
			this.value = this.placeholder;
			el.style.cssText = 'color:#A9A9A9;';
		}
    };

	el.onblur();

}

function clear_placeholder (id, placeholder)
{
	var el = document.getElementById(id);

	if ((el) && (el.value == placeholder))
	{
		el.value = '';
	}
}
/**
This object contains utility functions.

The way this object is constructed allows JavaScript to have private and public functions but only works as a singleton.

Public functions notation:
	this.MyPublicFunction

Private function notation:
	var _MyPrivateFunction

_ContentServerLogout
CheckIfAlreadyExists
DateStringToShortDate
DefaultValue
FileIcon
FormatFileSize
FormatFolderSize
GenerateUUID
GetCookie
DeleteCookie
HTMLEncode
MarkLast
PopulatePublishForm
RemoveAll
RemoveIfExists
StringToDate
TrimLongString
SessionLogout
GetBaseUrl
*/
var utils = new function() {

	/**
	This function checks if the Object list contains a key with the value in string

	@param {String} string
	@param {Object} list
	@param {String} key

	@public
	*/
	this.CheckIfAlreadyExists = function(string, list, key) {
		for (var i in list) {
			if (list[i][key] === string) {
				return true;
			}
		}
		return false;
	};


	/**
	This function will convert a String representation of a date based on ISO 8601 into the short date string representation.
	It supports input formats supported by utils.StringToDate

		12/25/2001
		4:23 PM

	@param {String} dateString
	@param {Boolean} dateOnly

	@public
	*/
	this.DateStringToShortDate = function(dateString, dateOnly ){

		var dateObject = new Date(Date.parse(dateString));
		var today = new Date();
		var returnDateString = 'BAD DATE FORMAT';
		var hour;
		var ampm = 'AM';
		var minute;
		var newTime;
		var newDate;

		if (dateObject != null ){

			hour = dateObject.getHours();
			if (hour > 11 ){
				ampm = 'PM';
			}
			if (hour > 12){
				hour = hour - 12;
			}

			minute=dateObject.getMinutes();
			if(minute<10)
			{
				minute='0'+ minute;
			}

			newTime = hour + ':' + minute + ' ' + ampm;

			//Format Date portion of string using user date formatting
			var dateFormat = info.shortDateFormat;
			dateFormat = dateFormat.replace(/\%Y/gi, "yy");
			dateFormat = dateFormat.replace(/\%m/gi, "mm");
			dateFormat = dateFormat.replace(/\%d/gi, "dd");

			newDate = $.datepicker.formatDate(dateFormat, dateObject);

			if ( today.getMonth()=== dateObject.getMonth() &&
				 today.getDate() === dateObject.getDate() &&
				 today.getFullYear() === dateObject.getFullYear())
			{
				return newTime;
			}
			else
			{
				if( typeof(dateOnly) !== 'undefined' && dateOnly){
					return newDate;
				}
				else{
					return newDate + " " + newTime;
				}
			}
		}
		return returnDateString;
	};


	/**
	This method will return the actual value or the default value if the actual value is null.

	@param {Dynamic} actualValue			actual value
	@param {Dynamic} defaultValue			default value

	@return {Dynamic}

	@public
	*/
	this.DefaultValue = function(actualValue, defaultValue) {

		if ( actualValue === null || actualValue === undefined ){
			returnValue = defaultValue;
		}else{
			returnValue = actualValue;
		}

		return returnValue;
	};


	/**
	This function manipulates the Mime type and creates a string to be used image url.

	@param {String}	mimeType
	@param {String}	size	// small or large

	@return {String} url of the image

	@public
	*/
	this.FileIcon = function(mimeType, size){

		var imageName = "";
		var url = "";

		switch (mimeType)
		{
			case 'application/pdf':
				imageName = 'mime_pdf';
				break;
			case 'application/msword':
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				imageName = 'mime_word';
				break;
			case 'application/vnd.ms-excel':
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				imageName = 'mime_excel';
				break;
			case 'application/vnd.ms-powerpoint':
			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
				imageName = 'mime_powerpoint';
				break;
			case 'video/quicktime':
			case 'video/mp4':
			case 'video/mpeg':
			case 'video/x-msvideo':
			case 'video/x-ms-wmv':
				imageName = 'mime_video';
				break;
			case 'audio/mpeg':
			case 'audio/wav':
			case 'audio/mp3':
				imageName = 'mime_audio';
				break;
			case 'application/zip':
			case 'application/x-zip-compressed':
			case 'application/x-gzip':
			case 'application/x-tar':
				imageName = 'mime_zip';
				break;
			default:
				imageName= 'mime_document';
				break;
		}

		imageName += '.svg';
		url = info.repo + "/img/mimetypes/" + imageName;

		return url;
	};


	/**
	This function will return a String to be used for a CSS class name (folder only).

	@param {Integer} sharedStatus			shared status

	@return {String}

	@public
	*/
	this.FolderIcon = function(sharedStatus, isReadOnly, isSubscribed, shareClass){

		var className = "";

		if( isSubscribed ){

			if( isReadOnly ){

				className = 'systemTempoFolderReadOnly';
			}
			else{

				className = 'systemTempoFolder';
			}
		} else if (shareClass == CONST_SHARECLASS.ENTERPRISE) {
			if(isReadOnly) {
				className = 'csShareFolderReadOnly';
			}
			else{
				className = 'csShareFolder';
			}
		} else if (sharedStatus === CONST_SHAREDFOLDER.SHAREDOWNER || sharedStatus === CONST_SHAREDFOLDER.SHAREDNOTOWNER || sharedStatus === true ){
			//search returns sharedFolder/sharedStatus as a boolean, so rather than change that and break legacy clients, we will just handle it here
			if(isReadOnly) {
				className = 'sharedFolderReadOnly';
			}
			else{
				className = 'sharedFolder';
			}
		} else {
			className = 'folder';
		}

		className = className + 'Icon';

		return className;
	};


	/**
	This function will take a file size in bytes and format it so something more readable.

	@param {Integer}						fileSize

	@return {String}

	@public
	*/
	this.FormatFileSize = function(fileSize){

		var unit = "";
		var units = ['bytes','KB','MB','GB','TB'];

		$.each(units, function(index, value){

			if (fileSize < 1024){
				unit = value;
				return false;
			}else{
				fileSize = fileSize / 1024;
			}
		});

		if (unit==='bytes'){
			if (fileSize<=1){
				unit = "byte";
			}
		}else{
			fileSize = (Math.round(fileSize * 10)/10).toFixed(2);
		}

		return fileSize + " " + unit;
	};


	/**
	This function will take a number of children a folder has, and returns the appropriate string.

	@param {Integer}			folderSize

	@return {String}			display string for the folderSize

	@public
	*/
	this.FormatFolderSize = function(foldersize){
		return T('LABEL.FilesInFolder',{'count':parseInt(foldersize, 10)});
	};


	/**
	This method will generate a pseudo-random UUID (version 4) based on RFC4122.

	The format is xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx, where:
		4 is a hard-coded value to indicated the version number
		y is a hexadecimal digit with a value of 8, 9, A or B
		x is any hexadecimal digit

	NOTE: these generated values are not guarenteed to be unique but the chance of collision is infinetly small.

	@public
	*/
	this.GenerateUUID = function(){

		var uuid = [];

		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		for (var i = 0; i < 36; i++){

			if (!uuid[i]){

				if (i===19){
					uuid[i] = (((Math.random()*16|0) & 0x3) | 0x8).toString(16);
				}else{
					uuid[i] = (Math.random()*16|0).toString(16);
				}

			}
		}

		return uuid.join("");
	};


	/**
	This function will get a cookie from the browser with the specified key.

	@param {String} cookieName				name of the cookie

	@public
	*/
	this.GetCookie = function(cookieName){

		var key;
		var cookie;
		var cookieValue = null;
		var cookies = document.cookie.split(";");

		$.each(cookies, function(index, value){

			// Note: the cookie could contain "=", so get the first instance rather than splitting the string.
			pos = value.indexOf("=");
			if (pos!==-1){

				key = value.substring(0,pos).replace(/^\s+|\s+$/g,"");

				if (cookieName===key){
					cookieValue = value.substring(pos+1);
				}
			}

		});
		return cookieValue;
	};

	/**
	 * This function will delete a cookie from the browser with the specified key
	 *
	 * @param {String} name				name of the cookie
	 *
	 * @public
	 */

	this.DeleteCookie = function(name) {
		var date = new Date();
		date.setTime(date.getTime()-1);
		document.cookie=name+"=;expires="+date.toGMTString();
	}


	/**
	 * This function encodes the html elements in the string
	 *
	 * @param {String} str		the string to be encoded
	 * @returns {String}		the htmlencoded string
	 *
	 * @public
	 *
	 */
	this.HTMLEncode = function(str){
		return $('<div>').text(str).html();
	}

	/**
	This function takes a list of items and adds or sets the last flag to false for all but the last item, which
	it is set to true. Useful for drawing separators in between items.

	@param {Array} items

	@public
	*/
	this.MarkLast = function( items ){
		var numItems = items.length;

		$.each(items, function(index,value){
			if (index != numItems-1){
				value.last=false;
			}else{
				value.last=true;
			}
		});

		return items;
	};

	/**
	This function returns true or false if a mime type is a supported
	image type for thumbnails and shadowbox.

	@param {String} mimetype

	@public
	*/
	this.IsSupportedImageMimetype = function( mimetype ){
		var supported = false;

		if (mimetype != undefined) {
			if (mimetype == 'image/jpeg'
					|| mimetype == 'image/pjpeg'
					|| mimetype == 'image/jpg'
					|| mimetype == 'image/png'
					|| mimetype == 'image/gif'
					|| mimetype == 'image/bmp')
			{
				supported = true;
			}
		}

		return supported;
	};


	/**
	This method populates the publish Dialog with Data coming from Content Server

	@param {Integer} id						object ID
	@param {String} name					object name

	@public
	*/
	this.PopulatePublishForm = function(id,name){
		$('#publishDestinationPath').val( decodeURIComponent(name));
		$('#publishDestinationNode').val(id);
	};


	/**
	This function will modify the array passed in by removing all instances of the value

	@param {Array} theArray
	@param {any} value to remove

	@public
	*/
	this.RemoveAll = function(theArray, value){
		var index;
		do{
			index = theArray.indexOf(value);
			if (index != -1){
				theArray.splice(index,1);
			};
		}while(index != -1);
		return theArray;
	};


	/**
	This function checks if the Object list contains a key with the value in string then removes it

	@param {String} string
	@param {Object} list
	@param {String} key

	@public
	*/
	this.RemoveIfExists = function(string, list, key) {
		for (var i in list) {
			if (list[i][key] === string) {
				list.splice(i, 1);
			return true;
			}
		}
		return false;
	};


	/**
	This function will convert a String representation of a date into a Date object.
	The supported formats are based on ISO 8601: YYYY-MM-DD hh:mm:ss(Z) or YYYY-MM-DDThh:mm:ss(Z).

	@param {String} dateStr					a date in string format

	@return {Date}							returns undefined if the format of the date string is invalid

	@public
	*/
	this.StringToDate = function(dateStr) {

		var d;

		// Only process the string if we are dealing with an expected format.
		if (dateStr.match(/^\d{4}-\d{2}-\d{2}(\s|T)\d{2}:\d{2}:\d{2}Z?$/) !== null) {

			lastChar = dateStr.charAt(dateStr.length - 1);

			// Remove the trailing "Z", which indicates UTC (if it exists).
			dateStr = dateStr.replace(/Z$/, "");

			// Convert the date String into a List of Integers as the various browsers seem to handle this better
			// than passing a String into the Date function.
			var splitDate = dateStr.split(/[\s-T:]/g);

			if ( lastChar === "Z" ) {
				// Do some additional processing if we are dealing with a UTC date.
				d = new Date(Date.UTC(splitDate[0], splitDate[1]-1, splitDate[2], splitDate[3], splitDate[4], splitDate[5]));
			}else{
				d = new Date(splitDate[0], splitDate[1]-1, splitDate[2], splitDate[3], splitDate[4], splitDate[5]);
			}

		}

		return d;
	};

	/**
	This function will find if the Date provided is a past Date. Time is ignored.

	@param {String} dateStr				a date string

	@return {Boolean}					returns true if provided Date is a past Date

	@public
	*/
	this.IsPastDate = function (dateStr){

		var givenDate = utils.StringToDate(dateStr);
		var today = new Date();

		givenDate.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);

		if( givenDate < today )
			return true;
		else
			return false;
	};

	/**
	This function will find the differnce between two Date strings in minutes/hours/yesterday. If the difference is more than 48 hours it will output short date string.
	If second date is undefined	todays date will be used.

	@param {String} date1				a date string

	@param {String} date2				(optional) a date string

	@return {Date}						returns minutes/hours/yesterday/short form of dateStr1

	@public
	*/
	this.DateDifferenceUptoYesterday = function(dateStr1, dateStr2)
	{
		var numOfMinutes;
		var numOfHours;
		var date1;
		var date2;
		var differenceIs;
		var millisecondsInMinute = 1000*60;
		var millisecondsInHour = 1000*60*60;
		var timeNow = new Date();


		// convert to object
		date1 = utils.StringToDate(dateStr1);

		if(typeof(date2) === "undefined")
		{
			date2 = timeNow;
		}
		else
		{
			date2 = utils.StringToDate(dateStr2);
		}

		numOfMinutes = ( date2.getTime() - date1.getTime() ) / millisecondsInMinute ;
		numOfMinutes = (numOfMinutes< 1 ? Math.ceil( numOfMinutes ): Math.round( numOfMinutes ) );

		if( numOfMinutes < 60 )
		{
			differenceIs = T('LABEL.LastModifiedMinutes', { count: numOfMinutes } );
		}
		else
		{
			numOfHours = ( date2.getTime() - date1.getTime() ) / millisecondsInHour;
			numOfHours = (numOfHours< 1 ? Math.ceil( numOfHours ): Math.round( numOfHours ) );

			// any thing after last midnight will be shown as hours
			if( numOfHours < timeNow.getHours() )
			{
				differenceIs = T('LABEL.LastModifiedHours', { count: numOfHours } );
			}
			else if( numOfHours < 48 ) // difference up to 47 hours will be shown as yesterday
			{
				differenceIs = T('LABEL.LastModifiedYesterday');
			}
			else // any thing more than 47 hours will show short form of dateStr1
			{
				differenceIs = T('LABEL.LastModifiedOn', {date:utils.DateStringToShortDate(dateStr1)} );
			}
		}
		return differenceIs;
	}

	/**
	This function checks the lenght of the string against the maximum length.
	If lenght is more than the mximum , chops off extra charcaters and replaces last 3 characters with dots

	@param {String} itemName

	@param {Integer} maximumCharacter

	@return {String}
	*/
	this.TrimLongString = function(itemName,maximumCharacter) {

		itemName = itemName.length > maximumCharacter ? itemName.substring(0,maximumCharacter-3) + '...' : itemName;

		return itemName;
	};

	/**
	This function takes an array of userinfo and creates a displayName for each item

    @param {Array} data

	@public
	*/
	this.AddDisplayName = function(data) {

		$.each(data, function(index,value) {

			if(typeof value.UserName !== 'undefined') {
				data[index].DisplayName = value.UserName;
			}
			else if(typeof value.USERNAME !== 'undefined') {
				data[index].DisplayName = value.USERNAME;
			}
			else if(typeof value.Name !== 'undefined') {
				data[index].DisplayName = value.Name
			}

			if(typeof value.FirstName !== 'undefined' && typeof value.LastName !== 'undefined') {
				if(value.FirstName !== null && value.LastName !== null) {
					data[index].DisplayName = value.FirstName + ' ' + value.LastName;
				}
			}
			else if(typeof value.FIRSTNAME !== 'undefined' && typeof value.LASTNAME !== 'undefined') {
				if(value.FIRSTNAME !== null && value.LASTNAME !== null) {
					data[index].DisplayName = value.FIRSTNAME + ' ' + value.LASTNAME;
				}
			}

		});

	};

	/**
	This function will log the user out of the web UI
	@public
	*/
	this.SessionLogout = function() {

		if( info.isExternal != true )
		{
			_ContentServerLogout();
		}

		// A session cookie cannot be deleted, so just empty the value.
		utils.DeleteCookie('OTSyncClientID');

		//clear the queued request
		queue.ClearCacheAll();
		document.location = this.GetBaseUrl();
	};

	/**
	This function creates a hidden iframe to logout of Content Server
	It calls the DoLogout request handler to clear the CS cookie
	Note: this is to workaround the same origin policy
	@private
	*/
	var _ContentServerLogout = function(){
		var csLogoutRequestHandler = 'll.DoLogout';
		var csLogoutURL = info.contentServerURL + '?func=' + csLogoutRequestHandler;
		var ifrm = document.createElement('iframe');
		ifrm.setAttribute('src',csLogoutURL);
		ifrm.setAttribute('id', 'CSLogout');
		ifrm.setAttribute('style', 'visibility:hidden;display:none');
		document.body.appendChild(ifrm);
		$('iframe#CSLogout').load(function(){
			var self = $('#CSLogout');
			self.parent().find('#CSLogout').remove();
		});

	};

	this.GetBaseUrl = function() {
		var currentUrl = document.location.toString();
		var baseUrl = currentUrl;
		var urlSplit;

		if (currentUrl.indexOf('#') != -1) {
			urlSplit = currentUrl.split('#');
			baseUrl = urlSplit[0];
		}

		return baseUrl;
	}

	this.GetBaseAPIVersion = function() {
		return "v5";
	}

	/**
	This function will make a duplicate copy of an object in memory
	so editing the copied value does not affect the original
	*/
	this.clone = function(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}

	/**
	This method will recursively search and replace the values in a json object
	*/
	this.recursiveReplace = function(find, replace, json) {
		var escapedFind = find.replace(/\$/g, '\\$');
		for (property in json) {
			if (typeof(json[property]) == 'object') {
				json[property] = utils.recursiveReplace(find, replace, json[property]);
			}
			else if (typeof(json[property]) == 'string') {
				json[property] = json[property].replace(new RegExp(escapedFind, 'g'), replace);
			}
		}

		return json;
	};
};

/**
This function validates the item (folder, file) name
@public
*/
function validateItemName(itemNameinput) {

    var input = itemNameinput.val();
    if(!(input===null)&&!($.trim(input)==="") && ($.trim(input).length<=248)) {
        return true;
    }
    return false;

}


/**
This function will return an HTML encoded string

@param	{String} value
@return {String} The HTML encoded string
*/
function htmlEncode(value){
	return $('<div/>').text(value).html();
}

/**
This function will return an HTML decoded string

@param	{String} value
@return {String} The HTML decoded string
*/
function htmlDecode(value){

	// if < or > is present in the value, encode them first before passing to $.html()
	var patt = /[<>]/i;
	if(patt.test(value))
	{
		value = value.replace("<","&lt;").replace(">","&gt;");
	}
	var r = $('<div/>').html(value).text();
	return r;
}


/**
This function will provide the translated string from the loaded dictionary that matches the passed key.

@param {String} key
@param {Object} data Object that contains properties named to match the variable substitution used in the
					dictionary object

@return {String} The translated string
*/
function T( key, data ){
	return  $.t( key, data );
}


/**
	This function opens a popup window to browse Content Server
	TODO: window style
*/
function BrowseContentServerWindow(selectSubtype){

	window.open(info.contentServerURL+"?func=ll&objType=150&objAction=targetBrowse&headerLabel="+T('LABEL.BrowseContentServer')+"&selectLabel=Copy%20here&selectScreen%3D"+selectSubtype+"&selectPerm=4&formname=CopyToForm&fieldprefix=DEST&trustedDomain=tempo","Browse", "location=1,status=1,scrollbars=1,width=500,height=400");
};

jQuery.fn.isChildOf = function(b){
	return (this.parents(b).length > 0);
};
