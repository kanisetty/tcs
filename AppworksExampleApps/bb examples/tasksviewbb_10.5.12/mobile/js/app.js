/**
 * # OTAG App Framework
 * A basic structure for OpenText Application Gateway
 * application creation.
 *
 * **Version** 1.0.0
 *
 * **Dependencies**
 * * jQuery >= 2.0.0
 */

/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
    strict:true, undef:true, unused:true, curly:true, browser:true,
    jquery:true */
/* global cordova, moment */

;(function () {
  // Keep JavaScript definitions strict
  "use strict";

  /**
   * ## App Constructor
   *
   * Application structure.
   *
   * @return    App object.
   */
  var App = function () {
    // Haven't initialized yet
    this.initialized = false;

    // Prepare for bridge session data
    this.session = null;
    this.componentList = [];

    // Return the app reference
    return this;
  };

  /**
   * ## Initialization
   * Creating, initializing, and starting the application.
   */

  /**
   * ### App.prototype.start
   *
   * Start the application.
   */
  App.prototype.start = function () {
    var _this = this,
      onDeviceReady = function () {
    	_this.execRequest("DeviceInfo", "getDefaultLanguage")
    	.done(function(lang){
			$.jsperanto.init(function(){
				// find all 'localize' classes and translate them: both text and title attr (if present)
				$('.localize').each(function() {
					var key = $(this).text().replace(/\./g, '');
					$(this).text( apputil.T('label.' + key) );
					
					var title = $(this).attr('title');
					if(title){
						var key = title.replace(/\./g, '');
						$(this).attr('title', apputil.T('label.' + key));
					}				
				});
				
				_this.auth();
			},
			{lang:lang});
    	})
    	.fail(function(data){
    		alert(data);
    	});
      };

    // Display the loading overlay
    this.showLoading();

    // Trigger authentication when Cordova is ready
    document.addEventListener("deviceready", onDeviceReady, false);
  };

  App.prototype.close = function(){
    
	  var successFn = function (session) {
	  };
	  var errorFn = function (data) {
		  //alert(data);
		window.history.back();
	  };

	  cordova.exec(successFn, errorFn, "Application", "closeme", []);	
  };

  /**
   * ## Authentication
   * Authenticating the application to the mobile device.
   */

  /**
   * ### App.prototype.auth
   *
   * Authenticate the user through the Cordova bridge.
   */
  App.prototype.auth = function () {
    var _this = this;

    // Get session info from Cordova
    this.execRequest("Session", "getSessionInfo")
      .done(function (data) {
        // Store the data in the App
        _this.session = data;

        // Hide the loading overlay
        _this.hideLoading();

        // Execute the init function, if it exists
        if (_this.init) {
          _this.init();
        }
      })
      .fail(function (error) {
        // Error out to the console for debugging
        if (console && console.error) {
          console.error(error);
        }
      });
  };

  /**
   * ## Cordova Requests
   * Provide a Deferred-based interface for handling Cordova requests
   */

  /**
   * ### App.prototype.execRequest
   *
   * Send a request over the Cordova bridge.
   * Requires cordova.js for the running platform.
   */
  App.prototype.execRequest = function (namespace, func, params) {
    var dfd = $.Deferred(),
      _this = this,
      successFn = function () {
        // Convert the arguments into an array and resolve
        var args = Array.prototype.slice.call(arguments);
        dfd.resolveWith(_this, args);
      },
      errorFn = function () {
        // Convert the arguments into an array and reject
        var args = Array.prototype.slice.call(arguments);
        dfd.rejectWith(_this, args);
      };

    cordova.exec(successFn, errorFn, namespace, func, params || []);

    return dfd.promise();
  };

  /**
   * ## Miscellaneous
   * A collection of useful methods to help reduce development
   * time and make the framework easier to user.
   */

  /**
   * ### App.prototype.getHash
   *
   * Get any hash parameters.
   *
   * @param href    A specific URL to parse (Default: window.location.hash).
   * @return        String representing the URL hash.
   */
  App.prototype.getHash = function(href) {
    var hash = (href || window.location.hash).split("#");
    return (hash.length > 1 ? hash[1] : "");
  };

  /**
   * ### App.prototype.getParameters
   *
   * Get any query string parameters.
   *
   * @return    Object of key:value pairs of parameters.
   */
  App.prototype.getParameters = function () {
    // Get the query, split it, and get the key/value pairs
    var query = window.location.search.toString().substring(1),
      pairs = query.split("&"),
      result = {},
      len = pairs.length,
      idx, pair, key;

    // Iterate through each pair and build the array
    for (idx = 0; idx < len; idx += 1) {
      pair = pairs[idx].split("=");
      key = pair[0];

      switch(typeof result[key]) {
        // Key has not been found, create entry
        case "undefined":
          result[key] = pair[1];
          break;
        // Key exists, create an array
        case "string":
          result[key] = [result[key], pair[1]];
          break;
        // Add to the array
        default:
          result[key].push(pair[1]);
      }
    }

    return result;
  };
  
  App.prototype.ajax = function (data) {
	var app = this;
	data.cache = false;	
	if(this.session.clientOS.toLowerCase() == "blackberry")
	{
		app.execRequest("Session", "authenticate");	
		
		app.showLoading();
	
		var successFn = function (data) {app.hideLoading();};
		var errorFn = function (data) {alert(JSON.stringify(data));};
		var namespace = "AppWorks";
		var func = "http";		
		var params = [data];
			
		cordova.exec(successFn, errorFn, namespace, func, params);
	} else {
		return $.ajax(data).then(
			null,
			function(jqXHR){ 
			// fail: if it's an auth problem, re-auth and try again
			if(jqXHR.status == 401){
				return app.execRequest("Session", "authenticate")
					.then(function(){
						return $.ajax(data);
					});
			}
		});
	}
  };

  /**
   * ### App.prototype.toggleLoad
   *
   * Toggle the loading overlay panel.
   * Will create it if it does not exist.
   *
   * @param isLoad    True to show the overlay, false to hide.
   */
  App.prototype.toggleLoad = function (isLoad) {
    // Get the overlay element
    var $el = $("#overlay");

    // Create the element, if it doesn't exist
    if ($el.length <= 0) {
      $el = $("<div class='overlay' id='overlay'></div>");
      $(document.body).append($el);
    }

    $el.toggle(isLoad);
  };

  /**
   * #### App.prototype.showLoading
   *
   * Show the loading overlay.
   */
  App.prototype.showLoading = function () {
    this.toggleLoad(true);
  };

  /**
   * #### App.prototype.hideLoading
   *
   * Hide the loading overlay.
   */
  App.prototype.hideLoading = function () {
    this.toggleLoad(false);
  };


  /**
   * ### App.prototype.getJSONDataFromURL
   *
   * Get the JSON data from the url
   * JSON is expected as the first parameter and the be url encoded.
   * A part of the appworks commsRequest functionality
   *
   * @return JSON 		JSON object from path: appWorksComms.appWorksComms.send.data, or an empty object of not supplied correctly
   */	  
	App.prototype.getJSONDataFromURL = function () {

		var urlParam;
		var urlJson;
		var json = {};
		
		// Get the paramters from the URL
		try {
			urlParam = window.location.search.toString().substring(1);
		} catch(e) {
			alert("No parameters supplied : " + e);
			return {};
		}
		
		// Decode the paramters
		try {
			urlJson = decodeURIComponent(urlParam);
		} catch (e) {
			alert("Could not decode parameters : " + e);
			return {};
		}
				
		//JSON parse the paramters
		try {
			json = JSON.parse(urlJson);
		} catch (e) {
			alert("Could not JSON parse parameters : " + e);
			return {};
		}
		
		// Check all our nodes are there, then return the json.appWorksComms.appWorksComms object
		if(this.checkAllNodes(json)) {
			//return json.appWorksComms.send.data;
			return json.appWorksComms;
		} else {
			return {};
		}
	};


  /**
   * ### App.prototype.checkAllNodes
   *
   * Check all our JSON nodes have been supplied and are intact
   * A part of the appworks commsRequest functionality
   * 
   * @param json	The JSON object from the URL
   * @return bool 	false if any nodes in @param json are undefined, otherwise true
   */	  
	App.prototype.checkAllNodes = function (json) {
		if (!this.checkNodeExists(json.appWorksComms)) {
			alert("Missing json.appWorksComms");
			return false;
		}
		if (!this.checkNodeExists(json.appWorksComms.send)) {
			return false;
			alert("Missing json.appWorksComms.send");
		}
		if (!this.checkNodeExists(json.appWorksComms.send.data)) {
			return false;
			alert("Missing json.appWorksComms.send.data");
		}
		if (!this.checkNodeExists(json.appWorksComms.send.data.data)) {
			return false;
			alert("Missing json.appWorksComms.send.data.data");
		}
		if (!this.checkNodeExists(json.appWorksComms.send.data.action)) {
			return false;
			alert("Missing json.appWorksComms.send.data.action");
		}
		
		if (!this.checkNodeExists(json.appWorksComms.onReturn)) {
			return false;
			alert("Missing json.appWorksComms.onReturn");
		}		
		if (!this.checkNodeExists(json.appWorksComms.onReturn.name)) {
			return false;
			alert("Missing json.appWorksComms.onReturn.name");
		}	
		if (!this.checkNodeExists(json.appWorksComms.onReturn.data)) {
			return false;
			alert("Missing json.appWorksComms.onReturn.data");
		}
		
		return true;
	};

  /**
   * ### App.prototype.checkNodeExists
   *
   * Check an individual node in there
   * A part of the appworks commsRequest functionality
   * 
   * @param json	The JSON object node which are check is not undefined
   * @return bool 	false if @param json is undefined, otherwise true
   */	
	App.prototype.checkNodeExists = function (json) {
		return typeof(json) != "undefined" ? true : false;
	};

	App.prototype.isBB = function() {
		var ua = navigator.userAgent;
		if (ua.indexOf('BB10') >= 0 || ua.indexOf('BlackBerry'))
			return true;
		
		return false;
	};	  

  
  /**
   * ## Formatting
   *
   * General string formatting.
   */
  App.prototype.format = {
    /**
     * ### App.prototype.format.date
     *
     * Format a date according to locale.
     * Will use moment.js if availble.
     *
     * @param theDate    The date to format.
     * @return           A string representing the formatted date.
     */
    date: function (theDate) {
      var result;

      // Use moment.js if it exists
      if (moment) {
        result = moment(theDate, "YYYY-MM-DDTHH:mm:ssZ").format("LLL");
      } else {
        result = theDate.toLocaleDateString();
      }
      return result;
    },
    /**
     * ### App.prototype.format.displayName
     *
     * Format a user's display name.
     *
     * @param username     The user's username.
     * @param firstName    The user's first name.
     * @param lastName     The user's last name.
     * @return             String that best represents the user.
     */
    displayName: function (username, firstName, lastName) {
        var displayName = "";

        // Include the first name, if available
        if (firstName !== null && firstName !== "") {
        displayName += firstName;
        }

        // Include the last name, if available
        if (lastName !== null && lastName !== "") {
        displayName += " " + lastName;
        }

        // Show a combination of first/last name, otherwise username
        return displayName.trim() || username;
    },
    /**
     * ### App.prototype.format.number
     *
     * Format a number with commas.
     *
     * @param num    The number to format.
     * @return       A string representing the formatted number.
     */
    number: function (num) {
      // Set commas every 3 digit, starting on the right (ie. 1,234,567)
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };


  /*
  * Function to find specific component in the AppWorks.getComponents function
  * Return true if its found
  * Return false if its not found
  *
  * Function to get components deferred in getComponents()
  * @param componentToFind : string, will be the component name to find in the components json
  */
  App.prototype.findComponent = function (componentToFind) {
    
	// Get a list of components from the AppWorks.getComponents function
	try
	{
		var _this = this;
		this.getComponents().done(function(data) {
		
			// Iterate through and find the component
			for(var i = 0; i < data.components.length; i++) {
				if (data.components[i].name == componentToFind) {
					// Found component!
					_this.componentList.push(componentToFind);
					return;
				}
			}
			
		});  
	}
	catch(e)
	{
		alert("Error in findComponent : " + e);
	}
  };
  
  /*
  * Returns all components in JSON string
  * Using a deferred call due to the async call
  */  
  App.prototype.getComponents = function () {
    var dfd = $.Deferred(),
    _this = this,
    successFn = function () {
        // Convert the arguments into an array and resolve
        var args = Array.prototype.slice.call(arguments);
        dfd.resolveWith(_this, args);
    };
	
	AppWorks.getComponents(successFn);

    return dfd.promise();
  };

  /**
	Finds a component in the local component list array set in findComponent()
	
	@param componentToFind	The name of the component to find
	@return {bool}			True if its in the array, false if not
  **/  
  App.prototype.findComponentInArray = function (componentToFind) {  
  
	var _this = this;
		
	for(var i = 0; i < _this.componentList.length; i++) {
		if(componentToFind == _this.componentList[i]) {
			return true;
		}
	}
    return false;
  };  
  

  /*
  *
  */
  App.prototype.openComponent = function (destComponentName, thisAppsName, destMethod, dataForDest, thisAppReturnHandler) {
		try {
			var openCompReq = AppWorksComms.getOpenAppRequest(destComponentName, thisAppsName, destMethod, dataForDest, thisAppReturnHandler);
			AppWorksComms.openApp(openCompReq);
		} catch(e) {
			alert("Error in openComponent : " + e);
		}
  };  
  
  // Expose the App globally
  window.App = App;

}).call(this);

var apputil = new function(){
	/**
  
	This function will return an HTML decoded string

	@param	{String} value
	@return {String} The HTML decoded string
	*/
	this.htmlDecode = function(value){

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
	this.T = function( key, data ){
		return  $.t( key, data );
	}
};

