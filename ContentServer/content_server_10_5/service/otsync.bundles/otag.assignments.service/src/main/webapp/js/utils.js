var utils = new function(){
	this.timestampToShortDate = function(timestamp, dateOnly ){
		
		var dateObject = new Date(timestamp);
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
			
			//Format Date portion of string using localized date formatting
			var dateFormat = T('LOCALE.ShortDateFormat');
			
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
};

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
	return  htmlDecode($.t( key, data ));
}

/**
This function will get a cookie from the browser with the specified key.

@param {String} cookieName				name of the cookie

@public
*/
function GetCookie(cookieName){
	
	var key;
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
This function will set a cookie from the browser with the specified key.

@param {String} cookieName				name of the cookie
@param {String} cookieValue				value to be stored in cookie
@param {String} expires					number of seconds the cookie should expire, session cookie by default

@public
*/
function SetCookie(cookieName, cookieValue, expires){
	if (expires != undefined) {
		var date = new Date();
		date.setTime(date.getTime() + (expires * 1000));
		document.cookie=cookieName + "=" + cookieValue + ";expires=" + date.toGMTString();
	}
	else {
		document.cookie=cookieName + "=" + cookieValue;
	}	
};

/**
This function will delete a cookie from the browser with the specified key.

@param {String} name				name of the cookie

@public
*/
function DeleteCookie(name) {
	var date = new Date();
	date.setTime(date.getTime()-1);
	document.cookie=name+"=;expires="+date.toGMTString();
}

/**
This function will handle all error messages in the UI

@public
*/
function ErrorMessage(statusCode) {
	
	var alertMessage;

	if ( statusCode.status === 401 || statusCode.status === 403 ) {		
		startup.RefreshToLoginPage();
		return;
	}
	else if (statusCode.status == 0) {		
		alertMessage = T('ERROR.Error') + ': ' + T('ERROR.CouldNotConnectToServer');
	}
	else {
	
		if ("responseText" in statusCode) {
			alertMessage = T('ERROR.Error') + ': ' + String(statusCode.responseText);			
		}
		else {
			alertMessage = T('ERROR.Error') + ' ' + statusCode.status;
		}
	}
	
	if( alertMessage != '' ) {
		$('#message').prepend($('<div class="alert alert-error" id="errorMessage"></div>').html(alertMessage));
		$('#errorMessage').prepend('<a class="close" data-dismiss="alert">&times;</a>');
		ScrollToMessage('#errorMessage');
	}	
}

/**
This function will handle login related error messages only

@public
*/
function LoginErrorMessage(statusCode){	

	var alertMessage;

	if( statusCode.status === 401 ){
		
		alertMessage = T('ERROR.AuthenticationFailed');
	}
	else if( statusCode.statusText != undefined ){
		
		alertMessage = statusCode.statusText;
		
	}
	else {
	
		alertMessage = T('ERROR.Error') + ' ' + statusCode.status;		
	}
	// more error code to handle
	
	$('#loginMessage').append('<div class="alert alert-error" id="loginErrorMessage"><a class="close" data-dismiss="alert">&times;</a>'+ alertMessage +'</div>');
}

/**
This function will handle login related error messages only

@public
*/
function AlertMessage(msg){	
	
	$('#message').append('<div class="alert alert-info"><a class="close" data-dismiss="alert">&times;</a>'+ msg +'</div>');
	AutoClosing('.alert-info');
	ScrollToMessage('#message');
}

function WarningMessage(msg){	
	
	$('#message').append('<div class="alert"><a class="close" data-dismiss="alert">&times;</a>'+ msg +'</div>');
	AutoClosing('.alert');
	ScrollToMessage('#message');
}

/**
This function will handle success messages

@public
*/
function Message(msg){
		
	$('#message').append('<div class="alert alert-success"><a class="close" data-dismiss="alert">&times;</a>'+msg+'</div>'); 
	AutoClosing('.alert-success');
	ScrollToMessage('#message');
}

/**
This function will handle success messages on login page only

@public
*/
function LoginMessage(msg){
	
	$('#loginMessage').append('<div class="alert alert-success"><a class="close" data-dismiss="alert">&times;</a>'+msg+'</div>'); 
}


function AutoClosing(selector) {
	var alert = $(selector).alert();
	window.setTimeout(function() {
    alert.fadeTo(500, 0).slideUp(500, function(){
		$(this).remove(); 
    });
	}, 5000);
}

function RemoveMessages(){
	
	$(".alert-error").remove();
	$(".alert-info").remove();
	
}

function ScrollToMessage(messageSelector) {
	$('html, body').animate({
		scrollTop: $(messageSelector)
	}, 2000);
}

function GenerateGUID() {

	var key = [];
		
		for (var i = 0; i < 48; i++){
			key[i] = (Math.random()*16|0).toString(16);	
		}
		
		return key.join("");
	
}


/**
This function takes a username, firstname and lastname and format it into a displayable username

@public
*/
function FormatDisplayName(username, firstname, lastname){
	var dispName;
	
	if (firstname != undefined && firstname != '') {
		dispName = firstname;
		if (lastname != undefined && lastname != '') {
			dispName += ' ' + lastname;
		}
	}
	else if (lastname != undefined && lastname != '') {
		dispName = lastname;
	}
	else {
		dispName = username;
	}
	
	return dispName;
}


/**
This function takes a type string (ie app, service) and returns a displayable string

@public
*/
function FormatPackageType(type) {
	var types = {
		app: T('LABEL.Application'),
		service: T('LABEL.Service'),
		feature: T('LABEL.Feature'),
		component: T('LABEL.Component'),
		login: T('LABEL.LoginPage'),
		launcher: T('LABEL.AppLauncher'),
		shortcut: T('LABEL.Shortcut')
	}

	return types[type];
}