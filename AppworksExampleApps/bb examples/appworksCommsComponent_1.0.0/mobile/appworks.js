var AppWorks = {
	/**
	 * Array used to hold the client callback functions that respond to the
	 * native layer responses we receive.
	 */
	callbacks : []
	
	/**
	 * Array used to hold the error callback functions
	 */
	, errorCallbacks : []

	/**
	 * Communication with the BB Cascades framework (QML documents).
	 * 
	 * A Cascades WebView component onMessageReceived: handle intercepts the calls.
	 * We register a callback to receive the asyn communication that comes back
	 * from that layer.
	 *
	 * @param message 		the message object to pass to the BB native code
	 * @param callback 		callback
	 * @param errorCallback errorCallback
	 */
	, blackberryCommunication : function(message, callback, errorCallback)
	{
		if (callback)
			AppWorks.callbacks.push(callback);

		// Add our error callback if supplied
		if (errorCallback)
			AppWorks.errorCallbacks.push(errorCallback);
				
		navigator.cascades.postMessage(encodeURIComponent(message));
	}

	/**
	 * Callbacks are handled via their sequential id which forms the index back into 
	 * our callbacks array.
	 */
	, getNewCallbackId : function() {
		// use the unique page id assigned by our native layer if its available
		// within the otag object 
		if (window.otag && window.otag.pageUUID)
			return window.otag.pageUUID + "_" + AppWorks.callbacks.length;
		
		return AppWorks.callbacks.length;
	}
	
	/**
	 * Get the next sequential id from the error callbacks array.
	 */
	, getNewErrorCallbackId : function() {
		return AppWorks.errorCallbacks.length;
	}
	
	/**
	 * Is the device hosting this app currently connected to the network?
	 */
	, isOnline : function(callback) {
		var json = 
		'{'+
			'"action" : "isOnline"'+
			', "callbackID" : "'+this.getNewCallbackId()+'"'+
		'}';
		
		this.blackberryCommunication(json, callback); 
	}
	
	/**
	 * Get the available (installed) components, and return them along with the
	 * values stored in their component.properties file.
	 * 
	 * @param callback callback
	 * 
	 * @return 	response { 
	 *				"components" : {
	 *					"comp1Name" : {
	 *						properties : {
	 *							"prop1" : "prop1Value",
	 *							"prop2" : "prop2Value",
	 *							...
	 *						}	
	 *					},
	 *					"component2Name" : {
	 *						...
	 *					}, 
	 *					...
	 *				}
	 * 			}
	 */
	, getComponents : function(callback) {
		var json = 
		'{'+
			'"action" : "getComponents"'+
			', "callbackID" : "'+this.getNewCallbackId()+'"'+
		'}';
		
		this.blackberryCommunication(json, callback);	
	}	
	
	, downloadFile : function(requestObj, successFn, errorFn) {
		this.blackberryCommunication(JSON.stringify(requestObj), 
			function(params) {
				successFn(params.data);
			},
			function(params) {
				errorFn(params.data);
			});	
	}
	
	/**
	 * Create a request object that can be used to download a file, and optinally cache it 
	 * in the local cache provided by the runtime, and also display it using the device's 
	 * installed apps if one is available that supports the downloaded files type.
	 * 
	 * The only optional argument is the cacheRequest, you may supply empty objects for the 
	 * headers and query parameters. If no cacheRequest argument is specified then we will
	 * not attempt to cache the item for you. See AppWorksCache#getBaseCacheRequest.
	 * 
	 * @param fileName 			the name of the file
	 * @param relativePath		url path relative from the base Gateway URL
	 * @param headers			headers to use in the request (can be empty)
	 * @param queryParams		query params to add to the request url (can be empty)
	 * @param openOnReturn		should we attempt to open the file
	 * @param cacheRequest		data on how we should cache the downloaded item (optional)
	 * @param destinationPath	the on-device path that the file should be downloaded to (optional)
	 */
	, createDownloadRequest : function(fileName, relativePath, headers, queryParams, openOnReturn, cacheRequest, destinationPath) {
		// cacheRequest is not mandatory but we want to make sure we have values (empty or not) for the rest
		if (arguments.length < 5)
		{
			throw new Error('insufficient arguments supplied');
		}
		
		var downloadRequest = {
				action : "downloadFile",
				callbackID : this.getNewCallbackId(),
				errorCallbackID : this.getNewErrorCallbackId(),
				fileName : fileName,
				relativePath : relativePath,
				headers : headers,
				queryParams : queryParams,
				openOnReturn : openOnReturn
			};
		
		if (typeof cacheRequest != 'undefined')
		{
			downloadRequest.cacheRequest = cacheRequest;
		}
		
		if (typeof destinationPath != 'undefined')
		{
			downloadRequest.destinationPath = destinationPath;
		}
		
		return downloadRequest;
	}
	
	, uploadFile : function(requestObj, successFn, errorFn) {
		this.blackberryCommunication(JSON.stringify(requestObj), 
			function(params) {
				successFn(params.data);
			},
			function(params) {
				errorFn(params.data);
			});	
	}
	
	/**
	 * Create the request object that can be used to perform a form based upload. A JSON
	 * representation of the form, plus the URL and any headers/params should be included.
	 * 
	 * We currently support a single file input per form and expect the files content to
	 * be provided as the value of the form field in Base64 encoded form.
	 * 
	 * @param relativePath	url path relative from the base Gateway URL
	 * @param headers		headers to use in the request (can be empty)
	 * @param queryParams	query params to add to the request url (can be empty)
	 * @param formFields	an array of form field objects
	 */
	, createUploadRequest : function(relativePath, headers, queryParams, formFields) {
		
		var uploadRequest = {
			action : "uploadFile",
			relativePath : relativePath,
			headers : headers,
			queryParams : queryParams,
			formData : formFields,
			callbackID : this.getNewCallbackId(),
			errorCallbackID : this.getNewErrorCallbackId()		
		};	
		
		return uploadRequest;
	}
	
	/**
	 * Create a form field that we can pass with an upload request.
	 * 
	 * @param name 			the name of the form field
	 * @param type			the type, text, file, etc... of the form field
	 * @param value 		the value of the field, use a base64 encoded String for file content
	 * @param fileName 		the name of the file (optional, for file type form fields)
	 * @param contentType	the MIME type of file content (optional, for file type form fields)
	 */
	,  createFormField : function(name, type, value, fileName, contentType) {
		// base form field
		var formField = {
				name : name,
				inputType : type,
				value : value
		};
		
		// file input extras, these are the values used in the Content Disposition
		// section for the file input
		
		if (typeof fileName != 'undefined')
			formField.fileName = fileName;
		
		if (typeof contentType !== 'undefined')
			formField.contentType = contentType;
		
		return formField;
	}
	
	/**
	 * Open a folder picker to allow users to reference an area of the device
	 * that they may be interested in. If the user cancels this operation then
	 * the reponse will contain an empty filePath property, and success will be 
	 * set to 'false'. Cancelling is not considered an error so will be handled 
	 * by the sole callback provided.
	 * 
	 * @param callback callback 
	 *
	 * @return 	response { 
	 * 				cmd : "selectFilePath",
	 * 				success : true,
	 * 				callbackID : callbackID,
	 *				filePath : {file_path_value}				
	 * 			}
	 */
	, selectFilePath : function(callback) {
		var json = 
			'{'+
				'"action" : "selectFilePath"'+
				', "callbackID" : "'+this.getNewCallbackId()+'"'+
			'}';
			
		this.blackberryCommunication(json, callback); 	
	}
	
};

var cordova = {
	defaultLanguage : ""
	, SessionInfo : {}
	, getDefaultLanguage : function (successFn, errorFn) {
		
		if(this.defaultLanguage == "undefined" || this.defaultLanguage == "")
			return errorFn();
		
		return successFn(this.defaultLanguage);
		
	}
	, getOS : function (successFn, errorFn) {
		var json = this.getSessionInfo();
		
		if(this.json.clientOS == "undefined" || this.json.clientOS == "")
			return errorFn();
		
		return successFn(json.clientOS);
	}	
	, getSessionInfo : function (successFn, errorFn) {
		
		if(this.SessionInfo == "undefined" || this.SessionInfo == "")
			return errorFn();
		
		return successFn(this.SessionInfo);
	}

	/*** Grouped ***/
		, closeMe : function (successFn, errorFn) {
		
			AppWorks.blackberryCommunication(JSON.stringify({
					action: "closeMe",
					options : "",
					callbackID : AppWorks.getNewCallbackId(),
					errorCallbackID : AppWorks.getNewErrorCallbackId()
				}), 
				// callback
				function(params) {
					successFn(params.data);
				},
				// Error Callback
				function(params) {
					errorFn(params.data);
				});			
			
			AppWorks.blackberryCommunication(json);
		}
		, closeApp : function (successFn, errorFn) {
			closeMe(successFn, errorFn);
		}
		, closeme : function (successFn, errorFn) {
			closeMe(successFn, errorFn);
		}
	/*** /Grouped ***/

	, log : function (log) {
		var json = 
		'{'+
			'"action" : "log"'+
			', "log" : "'+log+'"'+
		'}';
		AppWorks.blackberryCommunication(json);
	}

	/**
	 * We act as a pass-through for the native Cordova calls due to limitations
	 * with the BB platform, the function will safely resolve the incoming
	 * parameter array. We expect it to contain a request object at index 0, or 
	 * nothing at all.
	 * 
	 * @param arr parameter array
	 */
	, processExecArrArg : function(arr) {
		return (typeof arr == "undefined" || typeof arr[0] == "undefined") ? {} : arr[0];
	}
	
	, openCamera : function (successFn, errorFn, arr) {
		var args = this.processExecArrArg(arr);
	
		AppWorks.blackberryCommunication(JSON.stringify({
				action: "camera",
				options : args,
				callbackID : AppWorks.getNewCallbackId(),
				errorCallbackID : AppWorks.getNewErrorCallbackId()
			}), 
			// callback
			function(params) {
				if(args.success)
				{
					args.success(params.data);
				}
				successFn(params.data);
			},
			// Error Callback
			function(params) {
				if(args.error)
				{
					args.error(params.data);
				}
				errorFn(params.data);
			});
	}
	
	, getFromGallery : function (successFn, errorFn, arr) {
		var args = this.processExecArrArg(arr);
	
		AppWorks.blackberryCommunication(JSON.stringify({
				action: "gallery",
				options : args,
				callbackID : AppWorks.getNewCallbackId(),
				errorCallbackID : AppWorks.getNewErrorCallbackId()
			}),  
			// callback
			function(params) {
				if(args.success)
				{
					args.success(params.data);
				}
				successFn(params.data);
			},
			// Error Callback
			function(params) {
				if(args.error)
				{
					args.error(params.data);
				}
				errorFn(params.data);
			});
	}
	
	, openFilePicker : function (successFn, errorFn, arr) {
		var args = this.processExecArrArg(arr);
	
		AppWorks.blackberryCommunication(JSON.stringify({
				action: "filepicker",
				options : args,
				callbackID : AppWorks.getNewCallbackId(),
				errorCallbackID : AppWorks.getNewErrorCallbackId()
			}),  
			// callback
			function(params) {
				if(args.success)
				{
					args.success(params.data);
				}
				successFn(params.data);
			},
			// Error Callback
			function(params) {
				if(args.error)
				{
					args.error(params.data);
				}
				errorFn(params.data);
			});

	}	
	
	, http : function(successFn, errorFn, arr) {
		var args = this.processExecArrArg(arr);
		
		AppWorks.blackberryCommunication(JSON.stringify({
				action: "ajax",
				options : args,
				callbackID : AppWorks.getNewCallbackId(),
				errorCallbackID : AppWorks.getNewErrorCallbackId()
			}),
			// callback
			function(params) {
				if(args.success)
				{
					args.success(params.data);
				}
				successFn(params.data);
			},
			// Error Callback
			function(params) {
				if(args.error)
				{
		        	args.error({ status:params.data.status, statusText:params.data.statusText });
				}
				errorFn({ status:params.data.status, statusText:params.data.statusText });
			});		
		//);
	}
	
	, authenticate : function (successFn, errorFn) {	

		AppWorks.blackberryCommunication(JSON.stringify({
				action: "authenticate",
				options : "",
				callbackID : AppWorks.getNewCallbackId(),
				errorCallbackID : AppWorks.getNewErrorCallbackId()
			}), 
			// callback
			function(params) {
				successFn(params.data);
			},
			// Error Callback
			function(params) {
				errorFn(params.data);
			});
	}
	
	, setDefaultLanguage : function(successFn, errorFn, data) {
		
		if(typeof(data) == "object" && data.error) {
			return errorFn(data);
		}

		this.defaultLanguage = data;
		return successFn(data);
	}
	
	, setSessionInfo : function(successFn, errorFn, data) {

		if(typeof(data) == "object" && data.error) {
			return errorFn(data);
		}
		
		delete data.cmd;
		this.SessionInfo = data;
		return successFn(data);
	}
	
	, initialize : function(callback) {
		
		// Setup mock success and error functions. All functions should have success and error functions
		var successFn = function(){};
		var errorFn = function(){};
		
		// set the language and session info in nested sequence before allowing the 
		// app to use cordova
		var json = 
			'{'+
				'"action" : "getDefaultLanguage",'+
				'"callbackID" : "'+AppWorks.getNewCallbackId()+'"'+
			'}';
		
		AppWorks.blackberryCommunication(json, function(message) {
			if(message.cmd === "getDefaultLanguage")
				cordova.setDefaultLanguage(successFn, errorFn, message.data);
			
			if (AppWorks.isOnline(function(data) {
				// if we are online then attempt to get the session info	
				if (data.isOnline == true) {
					json = 
						'{'+
							'"action" : "getSessionInfo",'+
							'"callbackID" : "'+AppWorks.getNewCallbackId()+'"'+
						'}';
					AppWorks.blackberryCommunication(json, function(message) {
						if(message.cmd === "getSessionInfo") 
							cordova.setSessionInfo(successFn, errorFn, message);
						callback();
					});	
				} else {
					console.warn('device is offline, otag.auth will not be populated!');
					// just fire the callback
					callback();	
				}
			}));	
		});
		
	}
	
	, launchAssignmentViewer : function(url) {
		var args = this.processExecArrArg(arr);
		
		AppWorks.blackberryCommunication(JSON.stringify({
				action: "launchAssignmentViewer",
				options : args
			})
		);
	}
	
	, isBB : function() {
		var ua = navigator.userAgent;
		if (ua.indexOf('BB10') >= 0 || ua.indexOf('BlackBerry'))
			return true;
		
		return false;
	}
	
	, exec : function(successFn, errorFn, namespace, func, params)
	{	
		var args;
		try
		{
			if(params.length > 0)
			{
				// maps the function name to the actual member of this js
				args = this[func](successFn, errorFn, params);
			}
			else
			{
				// maps the function name to the actual member of this js, we need to pass an empty
				// array here as we seem to have added 
				args = this[func](successFn, errorFn, []);
			}
		}
		catch(e)
		{
			return errorFn(e);
		}
		
		return args;
		
	}
	
	, onDeviceReady: function() {
		// fire the deviceready event once we know cordova has been initialised
		cordova.initialize(function () {
			// any framework should provide a vanilla JavaScript catch for this event to back-up
			// their own eventing mechanism, we just fire the raw event  
			var event = document.createEvent('Events');
			event.initEvent('deviceready', false, false);
			document.dispatchEvent(event);		
		});
		
	}
	
};

if (!cordova.isBB())  {
	// only call the cordova.initialize() if we are NOT BB, the BB 
	// WebView has an awkward load cycle that we have to listen to 
	// specifically to avoid double loading issues
	cordova.initialize();
}

/**
 * Central callback handling for messages coming from the QML layer, the AppWorks.callbacks 
 * array is used to store all of the request callbacks and should be available to the supporting
 * Js features, such as caching and our general JSON store.
 */
if (navigator.cascades)
{
	// Setup mock success and error functions. All functions should have success and error functions
	var successFn = function(){};
	var errorFn = function(){};
	
	// setup handling if cascades was injected by BB
	try {
		var json;
		// subscribe to the QML messages
		navigator.cascades.onmessage = function onmessage(message) {
	
			try	{
				message = JSON.parse(message);
			} catch(e) {}	
			
			
			if (!window.otag || !window.otag.pageUUID) {
				console.log("Unable to find BB pageUUID???");
			}
			
			var cbackIdx = -1;
				
			try {
				if (message.callbackID) {
					// the id is comprised of a {pageUUID}_{arrayBasedIdx}
					var cbackParts = message.callbackID.split("_");
					
					if (cbackParts[0] != window.otag.pageUUID) {
						console.log("Ignoring cascades message " + message + 
								" callback was not intended for this page");
					}
					
					// !!! make sure Js knows this is number, else it may fail to find the first callback?!?
					cbackIdx = parseInt(cbackParts[1], 10);
				} else {
					console.log("Ignoring cascades message " + message);
				}
			} 
			catch(e) 
			{
				console.log("Ignoring cascades message " + message + 
						" unable to process page UUID and callback index");	
			}
			
			
			var cback = AppWorks.callbacks[cbackIdx];

			// Default our error callback to -1: No error
			var errCbackIdx = -1;			
			
			try
			{
				// Try to get the callback index from our blackberry message
				errCbackIdx = parseInt(message.errorCallbackID, 10);
			}
			catch(e)
			{
				console.log("No error callback provided");
			}
			
			// If we have an error callback, call it and return to prevent fallthrough
			if(errCbackIdx > -1)	{
				var errCback = AppWorks.errorCallbacks[errCbackIdx];
				if (errCback) {
					errCback(message);
				} else {
					console.log("Error callback triggered but not supplied");
				}
				return;
			}
			
			if (cback) {
				cback(message);
			} else {
				if (message.cmd == 'bbPageReady') 
					cordova.onDeviceReady();
				
				if(message.cmd === "getDefaultLanguage")
					cordova.setDefaultLanguage(successFn, errorFn, message.data);
					
				if(message.cmd === "getSessionInfo") 
					cordova.setSessionInfo(successFn, errorFn, message);
				
				console.log("Failed to process message " + message + 
						" unable to resolve callback or command");
			}	
		};	
		
	} catch (e) {}	
}