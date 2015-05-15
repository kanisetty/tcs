var AppWorks = {
	/**
	 * Array used to hold the client callback functions that respond to the
	 * native layer responses we receive.
	 */
	callbacks : []

	/**
	 * Communication with the BB Cascades framework (QML documents).
	 * 
	 * A Cascades WebView component onMessageReceived: handle intercepts the calls.
	 * We register a callback to receive the asyn communication that comes back
	 * from that layer.
	 *
	 * @param message the message object to pass to the BB native code
	 * @param callback callback
	 */
	, blackberryCommunication : function(message, callback)
	{
		if (callback)
			AppWorks.callbacks.push(callback);
		
		navigator.cascades.postMessage(encodeURIComponent(message));
	}
	
	/**
	 * Callbacks are handled via their sequential id which forms the index back into 
	 * our callbacks array.
	 */
	, getNewCallbackId : function() {
		return AppWorks.callbacks.length;
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
	
};

var cordova = {
	defaultLanguage : ""
	, SessionInfo : {}
	, getDefaultLanguage : function () {
		return this.defaultLanguage;
	}
	, getOS : function () {
		var json = this.getSessionInfo();
		return json.clientOS;
	}	
	, getSessionInfo : function () {
		return this.SessionInfo;
	}

	/*** Grouped ***/
		, closeMe : function () {
			var json = 
			'{'+
				'"action" : "closeMe"'+
			'}';
			AppWorks.blackberryCommunication(json);
		}
		, closeApp : function () {
			var json = 
			'{'+
				'"action" : "closeMe"'+
			'}';
			AppWorks.blackberryCommunication(json);
		}
		, closeme : function () {
			var json = 
			'{'+
				'"action" : "closeMe"'+
			'}';
			AppWorks.blackberryCommunication(json);
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

	, openCamera : function (arr) {
		var args = arr[0];
	
		AppWorks.blackberryCommunication(JSON.stringify({
				action: "camera",
				options : args,
				callbackID : AppWorks.getNewCallbackId()
			}), 
			// callback
			function(params) {
				if (params.success && args.success)	{
					args.success(params.data);
				} else if (params.error) {
					args.error(params.data);
				}	
		});
	}
	
	, getFromGallery : function (arr) {
		var args = arr[0];
	
		AppWorks.blackberryCommunication(JSON.stringify({
				action: "gallery",
				options : args,
				callbackID : AppWorks.getNewCallbackId()
			}),
			// callback
			function(params) {
				if (params.success && args.success) {
					args.success(params.data);
				} else if (params.error){
					args.error(params.data);
				}
		});			
	}
	
	, openFilePicker : function (arr) {
		var args = arr[0];
	
		AppWorks.blackberryCommunication(JSON.stringify({
				action: "filepicker",
				options : args,
				callbackID : AppWorks.getNewCallbackId()
			}),
			// callback
			function(params){
				if (params.success && args.success) {
					args.success(params.data);
				} else if (params.error){
					args.error(params.data);
				}
		});

	}	
	
	, http : function(arr) {
		var args = arr[0];
		
		AppWorks.blackberryCommunication(JSON.stringify({
				action: "ajax",
				options : args,
				callbackID : AppWorks.getNewCallbackId()
			}),
			function(params){
				if (params.success && args.success) {
					args.success(params.data);
		        } else if (params.error){
		        	args.error({ status:params.status, statusText:params.statusText });
				}
			}
		);
	}
	
	, authenticate : function () {	
		var json = 
			'{'+
				'"action" : "authenticate"'+
			'}';
			
		AppWorks.blackberryCommunication(json);
	}
	
	, setDefaultLanguage : function(data) {
		this.defaultLanguage = data;
	}
	
	, setSessionInfo : function(json) {
		delete json.cmd;
		this.SessionInfo = json;
	}
	
	, initialize : function(callback) {
		// set the language and session info in nested sequence before allowing the 
		// app to use cordova
		var json = 
			'{'+
				'"action" : "getDefaultLanguage",'+
				'"callbackID" : "'+AppWorks.getNewCallbackId()+'"'+
			'}';
		
		AppWorks.blackberryCommunication(json, function(message) {
			if(message.cmd === "getDefaultLanguage")
				cordova.setDefaultLanguage(message.data);
			
			json = 
				'{'+
					'"action" : "getSessionInfo",'+
					'"callbackID" : "'+AppWorks.getNewCallbackId()+'"'+
				'}';
			AppWorks.blackberryCommunication(json, function(message) {
				if(message.cmd === "getSessionInfo") 
					cordova.setSessionInfo(message);
				callback();
			});	
		});
		
	}
	
	, launchAssignmentViewer : function(url) {
		var args = arr[0];
		
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
				args = this[func](params);
			}
			else
			{
				// maps the function name to the actual member of this js
				args = this[func]();
			}
		}
		catch(e)
		{
			return errorFn(e);
		}
		return successFn(args);
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
	// setup handling if cascades was injected by BB
	try {
		var json;
		// subscribe to the QML messages
		navigator.cascades.onmessage = function onmessage(message) {
	
			try	{
				message = JSON.parse(message);
			} catch(e) {}	
			
			// !!! make sure Js knows this is number, else it may fail to find the first callback?!?
			var cbackIdx = parseInt(message.callbackID, 10);
			var cback = AppWorks.callbacks[cbackIdx];
			
			if (cback) {
				cback(message);
			} else {
				if (message.cmd == 'bbPageReady') 
					cordova.onDeviceReady();
				
				if(message.cmd === "getDefaultLanguage")
					cordova.setDefaultLanguage(message.data);
					
				if(message.cmd === "getSessionInfo") 
					cordova.setSessionInfo(message);
			}	
		};	
		
	} catch (e) {}	
}