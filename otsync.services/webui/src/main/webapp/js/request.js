/**
This object is responsible for sending requests to OTSync.

The way this object is constructed allows JavaScript to have private and public functions but only works as a singleton.

Public functions notation:
	this.MyPublicFunction

Private function notation:
	var MyPrivateFunction

ObjectFrontChannel
_ObjectRequestAuthenticate
ObjectRequestGet
ObjectRequestSet
_Authenticate
_AuthenticateWithToken
_GetAuditHistory
_GetFolderContents
_GetVersionHistory
_InviteUser
_InviteUsers
_PopulateInfo
_SearchUser
ValidateResponse
Authenticate
AuthenticateWithToken
GetAuditHistory
GetContentsForSelection
GetVersionHistory
SearchUser
*/
"use strict";

var request = new function() {

	/**
	This constructor will create an object that can be used to make an AJAX call to OTSync via the front channel.

	@param {Object} requestData
	@paramFeature {String} type
	@paramFeature {String} subtype

	@private
	*/
	this.ObjectFrontChannel = function(requestData){

		this.type = 'POST';
		this.url = 'FrontChannel';
		this.data = JSON.stringify(requestData);
		this.contentType = 'application/json; charset=utf-8';
		this.dataType = 'json';

		this.beforeSend = function(xhr){
			// note: the space after Connection is required
			xhr.setRequestHeader("Connection ", "close");
		};
	};

	/**
	This constructor will create an object that can be used to make an AJAX call to OTSync Rest API.

	@param {String} url
	@paramFeature {String} type

	@private
	*/
	this.RestAPIRequest = function(url, type){
		this.type = type;
		this.url = url;
		if(type==="PUT")
		{
			this.url = url + "&clientID=" + info.clientID;
		}
		this.data = "&clientID=" + info.clientID;
		this.contentType = 'application/json; charset=utf-8';
		this.dataType = 'json';

    this.beforeSend = function(xhr){
        // note: the space after Connection is required
        xhr.setRequestHeader("Connection ", "close");
    };
	};

	/**
	This constructor will create an object that will be passed to OTSync (authentication requests).

	@param {String} type
	@param {String} subtype

	@private
	*/
	var _ObjectRequestAuthenticate = function(type, subtype) {
		this.type = type;
		this.subtype = subtype;
		this.username = "Admin";
		this.password="livelink";
		this.clientType="Web";
		// This is the number of concurrent requests that are stored by OTSync for the "are you done yet" functionality.
		// When the threshold is reached, the oldest request is overwritten, so this number should be higher than the number of set threads.
		// The default value is 2, the maximum is 32.
		this.storeResponses = 32;

		var cookieValue = utils.GetCookie("OTSyncClientID");
		if ( cookieValue!==null ){
			this.clientID = cookieValue;
		}
	};


	/**
	This constructor will create an object that will be passed to OTSync (get requests).

	@param {String} type
	@param {String} subtype

	@private
	*/
	this.ObjectRequestGet = function(type, subtype) {
		this.type = type;
		this.subtype = subtype;
	};


	/**
	This constructor will create an object that will be passed to OTSync (set requests).

	@param {String} type
	@param {String} subtype

	@private
	*/
	this.ObjectRequestSet = function(type, subtype){
		this.type = type;
		this.subtype = subtype;

		this.clientID = info.clientID;
		this.id = utils.GenerateUUID();
	};

	/**
	This function will authenticate the client with otsync using a username/password.

	 @param {String} username				username
	 @param {String} password				password

	 @private
	*/
	var _Authenticate = function(username, password){

		var type = 'auth';
		var subtype = 'auth';
		var requestID = type + subtype + "()";

		var requestData = new _ObjectRequestAuthenticate(type, subtype);

		requestData.username = username;
		requestData.password = password;
		requestData.auto = false;

		var ajaxData = new request.ObjectFrontChannel(requestData);

		return queue.AddSet(requestID, ajaxData);
	};

	/**
	 * This function will authenticate the client with otsync using a token.
	 *
	 * @private
	 */
	var _AuthenticateWithToken = function(){

		var type = 'auth';
		var subtype = 'auth';
		var requestID = type + subtype + "token()";

		var requestData = new _ObjectRequestAuthenticate(type, subtype);

		requestData.auto = false;

		var ajaxData = new request.ObjectFrontChannel(requestData);
		return queue.AddSet(requestID, ajaxData);
	};


	/**
	This function will get the audit history for the specified ID.

	@param {Integer} nodeID					object ID

	@private
	*/
	var _GetAuditHistory = function(nodeID){

		var type = 'request';
		var subtype = 'gethistory';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";

		queue.RemoveGet(requestName);

		var requestData = new request.ObjectRequestGet(type, subtype);

		requestData.info = {
			nodeID: nodeID,
			numRows: 1000,
			pageSize: 1,
			maxHistorySize: 1000
		};

		var ajaxData = new request.ObjectFrontChannel(requestData);

		return queue.AddGet(requestID, ajaxData);
	};


	/**
	This function will get the contents of a given folder

	@param {Integer} folderID
	@param {List} metadataToRequest			(list of strings naming the keys of metadata to request)

	@private
	*/
	var _GetFolderContents = function(nodeID, metadataToRequest){

		var type = 'request';
		var subtype = 'getfoldercontents';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";

		queue.RemoveGet(requestName);

		metadataToRequest = utils.DefaultValue(metadataToRequest, '');

		var requestData = new request.ObjectRequestGet(type, subtype);

		requestData.info = {
				containerID: nodeID,
				sort: '',
				page: 1,
				pageSize: 1000,
				desc: false,
				fields: metadataToRequest
		};

		var ajaxData = new request.ObjectFrontChannel(requestData);

		return queue.AddGet(requestID, ajaxData);
	};

	/**
	This function will get the version history for the given object.

	@param {Integer} nodeID					object ID

	@private
	*/
	var _GetVersionHistory = function(nodeID){

		var type = 'request';
		var subtype = 'getversionhistory';
		var requestName = type + subtype;
		var requestID = requestName + "(" + nodeID + ")";

		queue.RemoveGet(requestName);

		var requestData = new request.ObjectRequestGet(type, subtype);

		requestData.info = {
			nodeID: nodeID
		};

		var ajaxData = new request.ObjectFrontChannel(requestData);

		return queue.AddGet(requestID, ajaxData);
	};


	/**
	This function will populate the "info" global with data returned from an authentication call.

	@param {Object} data

	@private
	*/
	var _PopulateInfo = function(data){

		info.version.api = data.APIVersion;
		info.clientID = data.clientID;

		info.userID = data.info.userID;
		info.userName = data.info.username;
		if (data.info.firstName != null) {
			info.fullName = data.info.firstName;
			if (data.info.lastName != null) {
				info.fullName += " " + data.info.lastName;
			}

			info.displayName = info.fullName;
		}
		else {
			info.displayName = info.userName;
		}

		// In admin mode, we ignore the server-provided root folder and rely on whatever was set initially by index.jsp
		if(!info.isAdminModeRequested){
			info.userRootFolderID = data.info.rootFolder;
		}
		info.userRootFolderName = data.info.rootFolderName;

		info.userPrefUILang = data.info.lang;

		info.shortTimeFormat = data.info.shortTimeFmt;
		info.shortDateFormat = data.info.shortDateFmt;
		info.longTimeFormat = data.info.longTimeFmt;
		info.longDateFormat = data.info.longDateFmt;
		info.displayNameFormat = data.info.displayNameFmt;

		info.supportedCSShareTypes = {};
		for ( var i = 0; i < data.info.supportedCSShareTypes.length; i++ ) {
			info.supportedCSShareTypes[ data.info.supportedCSShareTypes[i] ] = 'null';
		};

		// need to convert these to serialized Content Server lists
		info.documentCreateInSubtype = "{" + data.info.canContainDocuments.join() + "}";
		info.folderCreateInSubtype = "{" + data.info.canContainFolders.join() + "}";
		info.versionCreateInSubtype = "{" + data.info.canContainVersion.join() + "}";

		info.canShare = data.info.canShare;
		info.canPublish = data.info.canPublish;
		info.canInvite = data.info.canInvite;
		info.canChangePassword = data.info.canChangePassword;
		info.isExternal = data.info.isExternal;
		info.expressEnabled = data.info.expressEnabled;
		info.navigationItems = data.info.navigationItems;
		info.storageLimit = data.info.storageLimit;
		info.diskUsage = data.info.diskUsage;
		info.emailEnabled = data.info.isEmailEnabled;

		// Store the clientID in the cookie so the value is not lost when refreshing the browser.
		document.cookie = 'OTSyncClientID=' + info.clientID;
	};


	/**
	This function will search for users who match the partial name.

	@param {String} searchName				partial user name to search for

	@private
	*/
	var _SearchUser = function(searchName,sharingNodeId){

		var type = 'request';
		var subtype = 'usersearch';
		var requestName = type + subtype;
		var requestID = requestName + "(" + searchName + ")";

		queue.RemoveGet(requestName);

		var requestData = new request.ObjectRequestGet(type, subtype);

		requestData.info = {
			searchStr: searchName,
			sharingNodeId: sharingNodeId,
			limit: 10
		};

		var ajaxData = new request.ObjectFrontChannel(requestData);

		// Cache successful results for 60 seconds.
		ajaxData.cacheDuration = 60000;

		return queue.AddGet(requestID, ajaxData);
	};

	/**
	This function will validate the response from a Rest API request to OTSync.

	@param {Object} responseData

	@private
	*/
	this.ValidateRestResponse = function(responseData){

		if (typeof responseData!=="undefined" && responseData!==null){

			if (responseData.auth===true){

				if (responseData.ok===true){
					return responseData;
				}else{

					response.Error(unescape(responseData.info.errMsg));
				}
			}else{
				request.DeleteSessionInfo();
				ui.Authenticate();
			}
		}
		// Reject the promise, so that the remainder of the deferred chain executes properly.
		return $.Deferred().reject(responseData);
	}
	/**
	This function will validate the response from a JSON request to OTSync.

	@param {Object} responseData

	@private
	*/
	this.ValidateResponse = function(responseData){

		// Sometimes OTSync doesn't return any response data.
		if (typeof responseData!=="undefined" && responseData!==null){

			if (responseData.hasOwnProperty("info")){

				if (responseData.info.auth===true){

					if (responseData.subtype==='multi'){

						var data = [];

						$.each(responseData.info.results, function(index, value){

							data.push(value);

							if (value.ok!==true){
								response.Error(value.errMsg);
							}
						});

						if (data.length > 0){
							return data;
						}

					}else{

						if (responseData.info.ok===true){

							if (responseData.info.hasOwnProperty("results")){
								return responseData.info.results;
							}else{
								return responseData;
							}

						}else{
							if(responseData.subtype != "getfoldercontents"){
								response.Error(unescape(responseData.info.errMsg));
							}
						}
					}
				}else{
					request.DeleteSessionInfo();
					ui.Authenticate();
				}
			}
		}
		// Reject the promise, so that the remainder of the deferred chain executes properly.
		return $.Deferred().reject(responseData);
	};

	/**
	 This function will authenticate the client with otsync using a username/password.

	 @param {String} username				username
	 @param {String} password				password

	 @public
	 */
	this.Authenticate = function(username, password){

		return $.when(_Authenticate(username, password)).pipe(request.ValidateResponse)
			.done(function(resultData){
				_PopulateInfo(resultData);
				response.Authenticate(true, resultData.info);
			})
			.fail(function(resultData){
				response.Authenticate(false, resultData.info);
			});
	};

	/**
	This function will authenticate the client with otsync using a token in cookie.
	@public
	*/
	this.AuthenticateWithToken = function(){

		return $.when(_AuthenticateWithToken()).pipe(request.ValidateResponse)
		.done(function(resultData){
			_PopulateInfo(resultData);
			response.AuthenticateWithToken(true);
		})
		.fail(function(){
			response.AuthenticateWithToken(false);
		});
	};


	/**
	This function will remove the session information from memory, including any cached requests.

	@public
	*/
	this.DeleteSessionInfo = function(){
		queue.ClearCacheAll();
	};


	/**
	This function will get the audit history for the specified ID.

	@param {Integer} nodeID					object ID

	@public
	*/
	this.GetAuditHistory = function(nodeID){

		return $.when(_GetAuditHistory(nodeID)).pipe(request.ValidateResponse).done(function(resultData){
			response.GetAuditHistory(resultData);
		});
	};


	/**
	This function will get the contents of the given folder ID, with the goal to select an existing folder

	@param {Integer} folderID
	@param {Object} targetItem				jQuery wrapped <li> object representing the folder
											(passed to response.GetContentsForSelection

	@public
	*/
	this.GetContentsForSelection = function(nodeID, targetItem){

		return $.when(_GetFolderContents(nodeID,['DATAID','NAME','ISSHAREABLE','SUBTYPE','ISROOTSHARE','SHAREDFOLDER','PARENTID','ISREADONLY'])).pipe(request.ValidateResponse)
		.done(function(resultData){
			response.GetContentsForSelection(resultData, targetItem);
		})
		.fail(function(){
			response.GetContentsForSelection([], targetItem);
		});
	};

	/**
	This function will get the version history for the given object.

	@param {Integer} nodeID					object ID

	@public
	*/
	this.GetVersionHistory = function(nodeID){

		return $.when(_GetVersionHistory(nodeID)).pipe(request.ValidateResponse).done(function(resultData){
			response.GetVersionHistory(resultData.versionHistory);
		});
	};


	/**
	This function will search for users who match the partial name.

	@param {String} searchName				partial user name to search for
	@param {Object} callback				function that can consume the search results
	@public
	*/
	this.SearchUser = function(searchName,sharingNodeId,callback){

		return $.when(_SearchUser(searchName,sharingNodeId)).pipe(request.ValidateResponse).done(function(resultData){
			response.SearchUser(resultData, callback);
		});
	};

};



/**
This object is responsible for handling pagination.

The way this object is constructed allows JavaScript to have private and public functions but only works as a singleton.

Public functions notation:
	this.MyPublicFunction

Private function notation:
	var MyPrivateFunction

_ResetPage
Filter
IsBusy
IsDone
GetPageNumber
GetPageSize
IncrementPageNumber
ResetPage
ResetRequest
*/

var pagination = new function(){

	var _nodeIDs = {};
	var _pageNumber = 1;
	var _pageSize = 100;
	var _done = false;
	var _busy = false;


	/**
	This function will reset the pagination variables.

	@private
	*/
	var _ResetPage = function(){

		_pageNumber = 1;
		_nodeIDs = {};
		_done = false;
	};


	/**
	This function will remove any duplicate data from a browse and return the filtered data.

	@param {Array} data						browse data
	@param {String} key						field that contains dataID

	@public
	*/
	this.Filter = function(data, key){

		var filteredData = [];

		if ( data.length < _pageSize ){
			_done = true;
		}

		$.each(data, function(index, value){

			if (value[key] in _nodeIDs){
				// duplicate ID
			}else{
				filteredData.push(value);
				_nodeIDs[value[key]] = null;
			}
		});

		return filteredData;
	};


	/**
	This function will return true if we are currently processing a pagination request, false otherwise.

	@public
	*/
	this.IsBusy = function(){
		return _busy;
	};


	/**
	This function will return true if we have servered up all of the pages, false otherwise.

	@public
	*/
	this.IsDone = function(){
		return _done;
	};


	/**
	This function will return the page number.

	@public
	*/
	this.GetPageNumber = function(){
		return _pageNumber;
	};


	/**
	This function will return the page size.

	@public
	*/
	this.GetPageSize = function(){
		return _pageSize;
	};


	/**
	This function will increment the page number.

	@param {String} tabID					tab ID (TAB.FILE, TAB.SEARCH, TAB.SHARE)
	@param {Integer} nodeID					object ID
	@param {Integer} sortBy					sort type (CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE)

	@public
	*/
	this.IncrementPageNumber = function(){

		_pageNumber += 1;
		_busy = true;

		return _pageNumber;
	};


	/**
	This function will reset the pagination state.

	@param {String} tabID					tab ID (TAB.FILE, TAB.SEARCH, TAB.SHARE)
	@param {Integer} nodeID					object ID
	@param {Integer} sortBy					sort type (CONST_SORT.NAME, CONST_SORT.SIZE, CONST_SORT.DATE)

	@public
	*/
	this.ResetPage = function(){

		_ResetPage();
		_busy = true;
	};


	/**
	This function will release the lock to allow other paginated requests to be processed, since only one should be active at any given time.

	@public
	*/
	this.ResetRequest = function(){
		_busy = false;
	};

};



/**
This function will queue and execute get, set and upload requests.

The way this object is constructed allows JavaScript to have private and public functions but only works as a singleton.

Public functions notation:
	this.MyPublicFunction

Private function notation:
	var MyPrivateFunction

Older browsers (Firefox 2, IE 7) support only 2 concurrent XMLHttpRequests, so we will reserve one for "get" requests and the other for "set" requests.
This will allow the web experience to be responsive, while updates happen in the background.
These browsers will likely not have any back-channel support.

While IE 8/9 are not older browsers, they will scale down to 2 concurrent XMLHttpRequests over dial-up or VPN.  For consistency the
queue will only support 1 "get" and 1 "set" thread for IE, however, this could be tweaked if desired.

New browsers support 6 (possibly higher) concurrent XMLHttpRequests, so we can increase the number of threads in the queue.
With one thread reservered for the back-channel, 3 will be dedicated to "get" requests, while 2 will be dedicated to "set" requests.
The rationale is that in the classic UI, only 1 thread is used for any request, so having 2 dedicated for "set" doubles what we can
currently do in the classic UI.  Since "set" operations have the potential to tie up the server longer, a 3/2 split is safer, plus
a higher percentage of the operations are going to be "get" requests.

If Content Server is thrashing too much, the "set" threshold can be reduced to 1.  Some browsers may support more than 6 concurrent
XMLHttpRequests but there is no real need to increase the number of threads, as these values are sufficient enough without punishing
Content Server.  In fact, we may need to scale this back since we could be using up to 6 CS threads from this UI versus 1 CS thread
from the classic UI.

_AlterGetThreadCount
_AlterSetThreadCount
_DoneGet
_DoneSet
_ExecuteGet
_ExecuteSet
_Exists
_GetCache
_GetKeyPrefix
AddGet
AddSet
AddUpload
ClearCache
ClearCacheAll
RemoveGet
RemoveGets
RemoveSet
*/
var queue = new function(){

	var _requests = {};
	var _getRequests = [];
	var _setRequests = [];
	var _runningGetRequests = {};
	var _cache = {};
	var _currentGetThreads = 0;
	var _currentSetThreads = 0;
	var _maxGetThreads = 1;
	var _maxSetThreads = 1;
	var _TYPE_AJAX = 0;
	var _TYPE_FUNCTION = 1;


	// Chrome (webkit) support 6 (8?) concurrent XMLHttpRequests.
	// While technically these numbers could go slightly higher, there is no real need,
	// as these values are sufficient and we don't want to thrash Content Server.
	if ($.browser.webkit){
		_maxGetThreads = 3;
		_maxSetThreads = 1;		// reducing from 2 for thread management
	}


	// Firefox 2 (and lower) supports 2 concurrent XMLHttpRequests.
	// Firefox 3 (internally version 1.9) and higher supports 6 concurrent XMLHttpRequests.
	if ($.browser.mozilla){
		var version = Number($.browser.version.slice(0,3));

		if (version>1.9){
			_maxGetThreads = 3;
			_maxSetThreads = 1;		// reducing from 2 for thread management
		}else if (version===1.9){
			_maxGetThreads = 3;
			_maxSetThreads = 1;
		}
	}


	/**
	This function will alter the available threads for get requests.

	@param {Integer} numToAlter				positive number to increase the count, negative to decrease

	@private
	*/
	var _AlterGetThreadCount = function(numToAlter){
		_currentGetThreads = _currentGetThreads + numToAlter;
	};


	/**
	This function will alter the available threads for set requests.

	@param {Integer} numToAlter				positive number to increase the count, negative to decrease

	@private
	*/
	var _AlterSetThreadCount = function(numToAlter){
		_currentSetThreads = _currentSetThreads + numToAlter;
	};


	/**
	This function will alter the state of the queue when a get request is finished.

	@param {String} key						unique queue key

	@private
	*/
	var _DoneGet = function(key){
		delete _runningGetRequests[key];
		delete _requests[key];
		_AlterGetThreadCount(-1);
		_ExecuteGet();
	};


	/**
	This function will alter the state of the queue when a set request is finished.

	@param {String} key						unique queue key

	@private
	*/
	var _DoneSet = function(key){
		delete _requests[key];
		_AlterSetThreadCount(-1);
		_ExecuteSet();
	};


	/**
	This function will execute the next request in the get queue (if there are threads available).

	@private
	*/
	var _ExecuteGet = function(){

		while (_getRequests.length > 0 && _currentGetThreads < _maxGetThreads){

			_AlterGetThreadCount(1);

			var key = _getRequests.shift();

			if (_requests.hasOwnProperty(key)){
				var xhr = $.ajax(_requests[key].data);
				_runningGetRequests[key] = xhr;
			}
		}
	};


	/**
	This function will execute the next request in the set queue (if there are threads available).

	@private
	*/
	var _ExecuteSet = function(){

		while (_setRequests.length > 0 && _currentSetThreads < _maxSetThreads){

			_AlterSetThreadCount(1);

			var key = _setRequests.shift();

			if (_requests.hasOwnProperty(key)){

				if (_requests[key].type===_TYPE_AJAX){
					$.ajax(_requests[key].data);
				}else{
					_requests[key].func();
				}
			}
		}
	};


	/**
	This function will check if the specified key exists in the master queue.

	@param {String} newKey					unique key to identify a given request

	@private
	*/
	var _Exists = function(newKey){

		var exists = false;

		$.each(_requests, function(key, value){

			if (key===newKey){
				exists = true;
				return;
			}
		});
		return exists;
	};


	/**
	This function will get response data from the cache (if found), null otherwise.

	@param {String} key						unique key to identify a given request.

	@private
	*/
	var _GetCache = function(key){

		var data = null;

		if(_cache.hasOwnProperty(key)){

			var now = new Date();

			if (now < _cache[key].expires){
				data = _cache[key].value;
			}else{
				delete _cache[key];
			}
		}
		return data;
	};


	/**
	This function will get the prefix for a given key.

	@param {String} key						unique key

	@private
	*/
	var _GetKeyPrefix = function(key){

		var prefix = key.split("(", 1).join("");

		return prefix;
	};


	/**
	This function will add a request to the get queue.

	@param {String} key						unique key in the format: action(param1, param2, ...)
	@param {Object} ajaxData				data that will sent in an AJAX request

	@public
	*/
	this.AddGet = function(key, ajaxData){

		if (!_Exists(key)){

			var defer = $.Deferred();

			ajaxData.timeout = 19000;

			//	This callback will be called if the request is successful.
			//
			//	@param {} data					data returned from the server
			//	@param {String}	textStatus		status description ("success")
			//	@param {Object} jqXHR			XMLHttpRequest obejct
			//
			ajaxData.success = function(data, textStatus, jqXHR){

				// Cache the results (if the request is cacheable and if it was successful).
				if (ajaxData.hasOwnProperty("cacheDuration")){
					if (data!==null && data.hasOwnProperty("info") && data.info.ok===true){
						var cacheValue = {};
						cacheValue["value"] = data;
						cacheValue["expires"] = new Date().setTime(new Date().getTime() + ajaxData.cacheDuration);
						_cache[key] = cacheValue;
					}
				}

				defer.resolve(data);
				_DoneGet(key);
			};

			//	This callback will handle request errors.
			//
			//	@param {Object} jqXHR			XMLHttpRequest object
			//	@param {String} textStatus		type of error ("timeout", "error", "abort", "parsererror", null)
			//	@param {String} errorThrown		textual portion of the HTTP error
			//
			ajaxData.error = function(jqXHR, textStatus, errorThrown){

				if ( textStatus==='timeout' ){
					response.Error(T('ERROR.RequestFailed'));
				}
				// Only display if we have a legitimate error (400, 500, etc.)
				// A session timeout will have a status of 0 but we are handling that elsewhere.
				else if (jqXHR.status > 0){
					response.CriticalError(jqXHR);
				}

				defer.reject(jqXHR);
				_DoneGet(key);
			};

			// add the request to the master list
			var val = {};

			val["type"] = _TYPE_AJAX;
			val["data"] = ajaxData;

			_requests[key] = val;

			var cachedData = _GetCache(key);

			if (cachedData===null){

				// add the get request to the queue
				_getRequests.push(key);

			}else{
				defer.resolve(cachedData);
				_DoneGet(key);
			}

			// attempt to process a request
			_ExecuteGet();

			return defer;

		}else{
			return null;
		}
	};


	/**
	This function will add a request to the set queue.

	@param {String} key						unique key in the format: action(param1, param2, ...)
	@param {Object} ajaxData				data that will sent in an AJAX request

	@public
	*/
	this.AddSet = function(key, ajaxData){

		if (!_Exists(key)){

			var defer = $.Deferred();

		 	ajaxData.timeout = 19000;

			//	This callback will be called if the request is successful.
			//
			//	@param {} data					data returned from the server
			//	@param {String}	textStatus		status description ("success")
			//	@param {Object}	jqXHR			XMLHttpRequest obejct
			//
			ajaxData.success = function(data, textStatus, jqXHR){

				if (textStatus==='success'){

					defer.resolve(data);
					_DoneSet(key);
				}
			};

			//	This callback will handle request errors.
			//
			//	@param {Object} jqXHR			XMLHttpRequest object
			//	@param {String} textStatus		type of error ("timeout", "error", "abort", "parsererror", null)
			//	@param {String} errorThrown		textual portion of the HTTP error
			//
			ajaxData.error = function(jqXHR, textStatus, errorThrown){

				if ( textStatus==='timeout' ){

					defer.reject(jqXHR);
					_DoneSet(key);
				}else{
					response.CriticalError(jqXHR);
					defer.reject(jqXHR);
					_DoneSet(key);
				}
			};

			// add the request to the master list
			var val = {};

			val["type"] = _TYPE_AJAX;
			val["data"] = ajaxData;

			_requests[key] = val;

			// add the set request to the queue
			_setRequests.push(key);

			// attempt to process a request
			_ExecuteSet();

			return defer;

		}else{
			return null;
		}
	};


	/**
	This function will add a request to the set queue, this should only be used for upload requests.

	@param {String} key						unique key in the format: action(param1, param2, ...)
	@param {Object} func					function to be called

	@public
	*/
	this.AddUpload = function(key, func){

		if (!_Exists(key)){

			var defer = $.Deferred();

			defer.always(function(){
				_DoneSet(key);
			});

			// add the request to the master list
			var val = {};

			val["type"] = _TYPE_FUNCTION;
			val["func"] = func;

			_requests[key] = val;

			// add the set request to the queue
			_setRequests.push(key);

			// attempt to process a request
			_ExecuteSet();

			return defer;

		}else{
			return null;
		}
	};


	/**
	This function will clear the cache with the specified key.

	@parma {String} keyPrefix				key prefix, without parameters (eg. requestgetlocationpath)

	@public
	*/
	this.ClearCache = function(keyPrefix){

		$.each(_cache, function(key, value){

			if (keyPrefix===_GetKeyPrefix(key)){
				delete _cache[key];
			}
		});

	};


	/**
	This function will clear the entire cache.

	@public
	*/
	this.ClearCacheAll = function(){

		_cache = {};
	};


	/**
	This function will clear the queue of get requests of the same type.

	@param {String} keyPrefix				key prefix, without parameters (eg. requestgetlocationpath)

	@public
	*/
	this.RemoveGet = function(keyPrefix){

		var key;

		// Remove the queued up requests first, as there is not much we can do about the running ones.
		for (var index=0; index < _getRequests.length; index++){

			key = _getRequests[index];

			if (keyPrefix===_GetKeyPrefix(key)){

				_getRequests.splice(index,1);
				index--;

				if (_requests.hasOwnProperty(key)){
					delete _requests[key];
				}
			}
		}

		// The queue cleanup will happen via the error callback.
		// The _request and _runningGetRequests objects are not being actively polled, so there is no risk in slightly delaying the cleanup.
		$.each(_runningGetRequests, function(key, value){

			if (keyPrefix===_GetKeyPrefix(key)){
				value.abort();
			}
		});
	};


	/**
	This function will clear the queue of all get requests.

	@public
	*/
	this.RemoveGets = function(){

		var key;

		// Remove the queued up requests first, as there is not much we can do about the running ones.
		for (var index=0; index < _getRequests.length; index++){

			key = _getRequests[index];

			_getRequests.splice(index,1);
			index--;

			if (_requests.hasOwnProperty(key)){
				delete _requests[key];
			}
		}

		// The queue cleanup will happen via the error callback.
		// The _request and _runningGetRequests objects are not being actively polled, so there is no risk in slightly delaying the cleanup.
		$.each(_runningGetRequests, function(key, value){

			value.abort();
		});
	};


	/**
	This function will clear the queue of set requests of the same type.

	@param {String} keyPrefix				key prefix, without parameters (eg. requestgetlocationpath)

	@public
	*/
	this.RemoveSet = function(keyPrefix){

		var key;

		for (var index=0; index < _setRequests.length; index++){

			key = _setRequests[index];

			if (keyPrefix===_GetKeyPrefix(key)){

				_setRequests.splice(index,1);
				index--;

				if (_requests.hasOwnProperty(key)){
					delete _requests[key];
				}
			}
		}
	};
};
