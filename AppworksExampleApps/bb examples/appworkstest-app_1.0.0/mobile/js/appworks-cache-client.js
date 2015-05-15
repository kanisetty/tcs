// the main AppWorks object defines the callback handling, without it we cannot do much
if (!window.AppWorks)
	throw new Error('Cannot use the AppWorksCache without the base AppWorks object in scope,' + 
			' please include appworks.js above this file in your page');

/**
 * Blackberry Cascades AppWorks Cache:
 *
 * Allows apps deployed within the AppWorks BB mobile client to store and retrieve files
 * from a managed area of the device. It is up to the client to define their partition scheme.
 *
 * The cache should be used with namespacing to guarantee file clashes do not occur with other
 * AppWorks apps deployed within the mobile client. Please use the 'app' argument of the 
 * getBaseCacheRequest function we have supplied to do this using a sensible unique namespace value.
 * Multiple apps may share a namespace if you wish, and thus share access to the same cache space. 
 *
 * Communication with the native QML layer via navigator.cascades is asynchronous, clients
 * should use the callbacks to receive the response data. The structure of the responses is
 * documented per function below. 
 *
 * We record cache item information on device within a particular client defined parition using 
 * a unique file name, and optional modified date, version id and an expiry date. Date values are 
 * represented using millisecond Strings. If something doesn't appear to work check the response 
 * for a message in the "err" property.
 *
 */
var AppWorksCache = {
		// Callbacks have an Id and pass it to the QML native layer so they can intercept 
		// the return from cascade, we MUST use the AppWorks.callbacks member as we can 
		// only define navigator.cascades.onmessage
		requestPrefix : 'cache.',
		callbackIdPrefix : 'cacheReq.',

		/**
		 * Build the basic cache request, make sure you use nulls where 
		 * appropriate to ensure object is fully populated. Input is
		 * validated.
		 *
         * @param fileName 	file name 
         * @param app 		the app the cache request is on behalf of, a unique partition 
         *					within the cache, this is optional but if set to null or blank 
         * 					will result in general cache access where there is a risk of file 
         * 					name clashes occurring  
         * @param version 	the version of the file (optional)
		 */
		getBaseCacheRequest : function(fileName, app, version) {
			if (fileName == null) {
				throw new Error("fileName cannot be null");
			}

			if (typeof fileName == 'undefined' || typeof app == 'undefined' || typeof version == 'undefined') {
				throw new Error("All arguments must be defined, they can be null apart from fileName");
			}
		
			var namespace = (app != null) ? app : "general";
			var itemVersion = (version != null) ? version : "default";

			return {
				"fileName" : fileName,
				"app" : namespace,
				"version" : itemVersion
			};
		},

		/**
		 * Get the maximum size, current used and free in bytes.
		 *
		 * @param callback callback
		 *
		 * @return 	response { 
		 * 				"callbackID" : "val",
		 *				"cacheInfo" : {
		 *					"maxSize" : "0",
		 *					"currentSize" : "0",
		 *					"freeSpace" : "0"
		 *				}
		 * 			}
		 */
		getCacheInfo : function(callback) {
			var json = 
				'{'+
					'"action" : "'+this.requestPrefix+'getCacheInfo"'+
					', "callbackID" : "'+AppWorks.getNewCallbackId()+'"'+
				'}';
			AppWorks.blackberryCommunication(json, callback);
		},

		/**
		 * Get a cache items details, if the item, identified 
		 * by the request object details, exists.
		 * 
		 * @param cacheRequest	cache request (see getBaseCacheRequest())
		 * @param callback 		callback
		 *
		 * @return 	response { 
	 	 * 				"callbackID" : "val",
		 *				"cacheItem" : {
		 * 					"fileName" : "val",
		 * 					"app" : "val",
		 *					"modifiedDate" : "val",
		 *					"expires" : "val",
		 *					"version" : "val"
		 *				}
		 * 			}
		 */
		getCacheItemInfo : function(cacheRequest, callback) {
			var json = 
				'{'+
					'"action" : "'+this.requestPrefix+'getCacheItemInfo"'+
					', "cacheRequest" : '+ JSON.stringify(cacheRequest) +''+
					', "callbackID" : "'+AppWorks.getNewCallbackId()+'"}';
			AppWorks.blackberryCommunication(json, callback);	
		},

		/**
		 * Retrieve the cache item info plus the actual data as a Base64 encoded String. 
		 *
		 * @param cacheRequest	cache request (see getBaseCacheRequest())
		 * @param callback 		callback
		 *
		 * @return 	response { 
	 	 * 				"callbackID" : "val",
		 *				"cacheItem" : {
		 * 					"fileName" : "val",
		 * 					"app" : "val",
		 *					"fileDataString" : "base64EncodedString",
		 *					"modifiedDate" : "val",
		 *					"expires" : "val",
		 *					"version" : "val"
		 *				}
		 * 			}
		 */
		getCacheItem : function(cacheRequest, callback) {
			var json = 
				'{'+
					'"action" : "'+this.requestPrefix+'getCacheItem"'+
					', "cacheRequest" : '+ JSON.stringify(cacheRequest) +''+
					', "callbackID" : "'+AppWorks.getNewCallbackId()+'"}';
			AppWorks.blackberryCommunication(json, callback);
		},

		/**
		 * Determine if a given item exists in the cache.
		 * 
		 * @param cacheRequest	cache request (see getBaseCacheRequest())
		 * @param callback 		callback
		 *
		 * @return 	response { 
		 * 				"callbackID" : "val",
		 *				"itemIsInCache" : "true"
		 * 			}
		 */
		isItemInCache : function(cacheRequest, callback) {
			var json = 
				'{'+
					'"action" : "'+this.requestPrefix+'isItemInCache"'+
					', "cacheRequest" : '+ JSON.stringify(cacheRequest) +''+
					', "callbackID" : "'+AppWorks.getNewCallbackId()+'"'+
				'}';
			AppWorks.blackberryCommunication(json, callback);
		},

		/**
		 * Add an item to the cache. Pass the function a cache request object with the following members.
		 *
		 * - fileName 		full name of file (required)
		 * - app 			the app the cache request is on behalf of, a unique partition within the cache
		 * - expires		Js Date, specify when the item should expire (optional - default 12 hours)
		 * - modifiedDate	Js Date, file modified date (optional - default is the date of storage)
		 * - version		unique version id (optional)
		 *
		 * We return an "err" message in the response if the action was unsuccesful.
		 * 
		 * Example: add a file that uses versioning not modified date 
		 *
		 * 	{
		 *		"fileName" : "test.pdf",
		 *		"app" : "com.opentext.myapp",
		 *		"version" : "1",
		 *		"expires" : dateObj
		 * 	}
		 *
		 * @param cacheRequest	cache request details, the base request (see getBaseCacheRequest()) plus
		 						modified date, and expiry for the new item
		 * @param arraybuffer 	an ArrayBuffer, the files byte contents
		 * @param callback 		callback
		 *
		 * @return 	response { 
		 * 				"callbackID" : "val",
		 *				"itemWasCached" : "true",
		 *				"expires" : "{time value of expiration}",
		 *				"version" : "{version id}",
		 				"err" : "an error message if we fail"
		 * 			}
		 */
		addItemToCache : function(cacheRequest, arraybuffer, callback) {
			var bytes = arraybuffer.byteLength; 

			var json = 
				'{'+
					'"action" : "'+this.requestPrefix+'addItemToCache"'+
					', "cacheRequest" : '+ JSON.stringify(cacheRequest) +''+
					', "bytes" : "'+ bytes +'"'+					
					', "fileDataString" : "'+ this.arrayBufferToBase64(arraybuffer) +'"'+
					', "callbackID" : "'+AppWorks.getNewCallbackId()+'"'+ 
				'}';
			AppWorks.blackberryCommunication(json, callback);	
		},

		/**
		 * Remove a specific item from the cache if it exists. 
		 * 
		 * @param cacheRequest	cache request (see getBaseCacheRequest())
		 * @param callback callback
		 *
		 * @return 	response { 
		 * 				"callbackID" : "val",
		 *				"itemWasEvicted" : "false"
		 * 			}
		 */
		evictItemFromCache : function(cacheRequest, callback) {
			var json = 
				'{'+
					'"action" : "'+this.requestPrefix+'evictItemFromCache"'+
					', "cacheRequest" : '+ JSON.stringify(cacheRequest) +''+
					', "callbackID" : "'+AppWorks.getNewCallbackId()+'"' +
				'}';
			AppWorks.blackberryCommunication(json, callback);	
		},

		/**
		 * Constructs a JavaScript Date from a millisecond String. This is the format
		 * used by this cache to represent time values (modified, expires). 
		 */			
		millisToDate : function (millisString) {
			return new Date(parseInt(millisString, 10));
		},

		/**
		 * Create a Base64 String from the content of an arraybuffer. 
		 */
		arrayBufferToBase64 : function(buffer) {
		    var binary = '';
		    var bytes = new Uint8Array(buffer);
		    var len = bytes.byteLength;

		    for (var i = 0; i < len; i++) {
		        binary += String.fromCharCode(bytes[ i ]);
		    }

		    return window.btoa(binary);
		}	

};