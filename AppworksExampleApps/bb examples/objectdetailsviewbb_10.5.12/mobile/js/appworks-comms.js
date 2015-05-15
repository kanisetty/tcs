// the main AppWorks object defines the callback handling, without it we cannot do much
if (!window.AppWorks) {
	alert('AppWorksComms: didnt find AppWorks framework exiting');
	throw new Error('Cannot use the AppWorksComms without the base AppWorks object in scope,' + 
			' please include appworks.js above the appworks-comms.js file in your page');
}

/**
 * Small inter app communications processing lib. This allows AppWorks apps to call 
 * AppWorks components that may be deployed to a device. Components are not displayed
 * to the user as entry points so this is the only way in which we can expose them. 
 */ 
var AppWorksComms = {
		
	/**
	 * Open another app deployed within the AppWorks client container and pass it 
	 * data. We set info inthe URL of the web view using this data so it can be parsed 
	 * by the destination app/component (see appworks-component.js). Apps and components 
	 * are uniquely identified by name so a caller must know the specific name/s of 
	 * its collaborating apps/components.
	 * 
	 * There is a concept of send and onReturn, as we want to let our destination 
	 * app/component know how to get back to the caller once its work is done. 
	 * 
	 * We also allow clients to specify a function name ('method') that should be called 
	 * on arrival at the destination or back in the calling app/component. If this 
	 * property of the request is defined for the send or recieve, then we pass the 
	 * 'data' object from the request to this function. If not defined then we expect you 
	 * to handle the 'data' yourselves. 
	 * 
	 * We expect the request object to be in a particular format, please use the supplied 
	 * convenience function, getOpenAppRequest, to form requests.
	 * 
	 * @param requestObj the request
	 */
	openApp : function(requestObj) {
		if (!requestObj)
			throw new Error('Unable to open another app without a request object');
		
		if (!requestObj.send || !requestObj.send.name)
			throw new Error('Unable to open another app without the name of the app/component to open');	
		
		var json = 
			'{'+
				'"action" : "openApp"'+
				', "commsRequest" : '+JSON.stringify(requestObj)+
			'}';
		
		// this is a one-way communication as we alter the URL of the web view
		// if there is an error though it will get returned to the cascades.onmessage 
		// handler
		AppWorks.blackberryCommunication(json);
	}	

	/**
	 * Check the window.location for the appWorksComms object, parse it contents and respond to the
	 * the request if we are a reciever or the response if we are recieving a callback from a 
	 * component we have called. 
	 * 
	 * @param callback a callback we pass the resolved received or returned data to
	 */
	, processComms : function(callback) {
		// read the window.location
		var commsData = this.getCommsData();
	
		// check for the appworks item in the URL's params
		if (commsData && typeof(commsData.isReturnCall) != 'undefined') {
			if (commsData.isReturnCall) {
				var returnInfo = this.getOnReturnData();
				if (returnInfo.method)
					this.callMethodFromComms(returnInfo.method, returnInfo.data);
				
				if (typeof(callback) === 'function')
					callback(returnInfo);
			} else {
				// check for data passed to this app
				var infoReceived = this.getReceivedData();
				if (infoReceived.method)
					this.callMethodFromComms(infoReceived.method, infoReceived.data);
				
				if (typeof(callback) === 'function')
					callback(infoReceived);
			}
		}
		
	}
	
	, callMethodFromComms : function(methodName, data) {
		// form a String for eval using the supplied function name and 
		// optional data
		var toEval = 'window.';
		if (methodName) {
			toEval += methodName + '(';
			
			if (data) 
				toEval += JSON.stringify(data);
			
			// close off call
			toEval += ')';
			
			eval(toEval);
		} else {
			console.log('Unable lo callMethodFromComms as no methodName was supplied');
		}
			
	}

	// functions to access inbound data from a "calling" app 

	, getReceivedData : function() {
		var sendData = null;
		var commsData = this.getCommsData();
		
		if (commsData.send)
			sendData = commsData.send;
		
		return sendData;
	} 
	
	, getMethodToCall : function() {
		var sendData = this.getReceivedData();
		return sendData.method;
	}
	
	// functions to access any onReturn data that a "calling" app wants us to pass 
	// back to it
	
	, getOnReturnData : function() {
		var onReturnObj = null;
		var commsData = this.getCommsData();
		
		if (commsData.onReturn) 
			onReturnObj = commsData.onReturn;
		
		return (onReturnObj == null) ? {} : onReturnObj;
	}
	
	/**
	 * Create the call to return control back to a calling AppWorks app.
	 * We form an openApp request using the onReturn data that was passed to us 
	 * originally.
	 * 
	 * @param returnData any data we wish to pass back to the caller
	 */
	, formReturnCall : function(toReturn) {
		// if they are not trying to pass some specific data back to the caller
		// try and parse the content the caller gave us
		var returnData = this.getOnReturnData();
			
		// this is a one-way ticket back to a calling app, nulls are used for to specify the
		// return related fields	
		var returnRequest = this.getOpenAppRequest(returnData.name, null, returnData.method, null, null, /* is return call */true);
		
		if (toReturn)
			returnRequest.onReturn.data = toReturn;
		
		return returnRequest;
	}
	
	/**
	 * Extract the data passed from another app via the web view's window.location.search.
	 */
	, getCommsData : function () {
		
		var commsObj = null, 
			decoded = null;
		
		try {
			// pull the contents after ?, it should only contain the 
			decoded = decodeURIComponent(window.location.search.toString().substring(1));
			commsObj = JSON.parse(decoded);
			
			if (!commsObj.appWorksComms) {
				console.log('parsed the window.location.search but did not find the appWorksComms data');
				return {};
			} 
		} catch(e) {
			console.log('failed to parse comms object from window.location - ' + decoded);
		}
		
		return (commsObj == null) ? {} : commsObj.appWorksComms;
	}
	
	/**
	 * Create a request to open another AppWorks app/component. Be sure to pass an empty
	 * object or null to the function if you want to define the onReturnMethod argument.
	 * 
	 * @param toName			the name of the app/component to open (mandatory)
	 * @param returnTo			the name of the app to return to i.e.this caller (mandatory)
	 * @param toMethod			the name of the method (function) to call on opening 
	 * 							the destination app/component
	 * @param onReturnMethod	the name of the method (function) to call when the user is 
	 * 							returned to the calling app
	 * @param isReturnCall		is this a call really a response? i.e. are we returning control
     *							to some app
	 * 
	 * @return open app request object
	 */
	, getOpenAppRequest : function(toName, returnTo, toMethod, toData, onReturnMethod, isReturnCall) {
		
		if (!toName)
			throw new Error('"toName" is mandatory');
		
		// form basic request with mandatory fields
		var openAppRequest = {
				send : {
					name : toName,
					data : {}
				},
				onReturn : {
					name : returnTo,
					data: {}
				}
		};
		
		// the function to call when we get to the other app
		if (toMethod)
			openAppRequest.send.method = toMethod;
		
		// set the data to pass to the other app/component, it can decide
		// if it wants to pass it to the above function if defined
		if (toData) 
			openAppRequest.send.data = toData;
		
		// set the name of the function to recall on return
		if (onReturnMethod)
			openAppRequest.onReturn.method = onReturnMethod;
		
		if (typeof(isReturnCall) === 'boolean') {
			openAppRequest.isReturnCall = isReturnCall;
		} else {
			openAppRequest.isReturnCall = false; //default val is false
		}

		return openAppRequest;
	}	
	
};