/*
	Rocket WebUI : A summary.


	Libraries Used
	-------------------------------------------------------------------------------------------------------------
	jquery			General purpose javascript toolkit
	jquery.tmpl		Javascript based HTML Templating
	jsperanto		Javascript internationalization support
	json2			Convert javascript objects into proper JSON strings for transport
	inuit.css		CSS framework


	Global namespace
	-------------------------------------------------------------------------------------------------------------
	info			Object responsible for holding data required by the UI
					(initially defined in the served HTML page)
	startup			Object responsible for the initalization of the UI
	request			Object responsible for making the calls to the Rocket Engine
	response		Object responsible for processing the responses from the Rocket Engine
	ui				Object contains any helper methods required for updating the UI
	utils			Object contains any other helper methods

	T				Function used to get the Translated string matching the given key.

	The Story
	-------------------------------------------------------------------------------------------------------------
	The index.jsp page will be requested from the Rocket Engine, passing in some parameters.
	Some of these parameters, as well as some from the Rocket Engine configuration, will be
	written to the HTML page. One such parameter is the location of the "UI Repository" or "repo"
	for short. The .jsp page will render to the HTML links to the repo directory with fixed named
	javascript and css files. The user's browser will load these javascript and css files which
	will in turn draw the UI.

	The application makes heavy use of the following:
		deffered objects	chaining function calls, even if async			http://api.jquery.com/category/deferred-object/
		templates			separation of display from logic				http://api.jquery.com/category/plugins/templates/
		delegate			simplifying handling of large groups of events	http://api.jquery.com/delegate/


*/

/**
This section defines all the constants.
*/
"use strict";
var SHARETYPE = { READONLY:1, READWRITE:2,UNSHARE:3};
var TAB = { SHARE:'SHARE', FILE:'FILE', SEARCH:'SEARCH', LOGIN:'LOGIN', TASK:'TASK'};
var CONST_SUBTYPE = {FOLDER:0, DOCUMENT:144, SYSTEMSHARE:294, PROJECT:202};
var CONST_SORT = {NAME:1, SIZE:2, DATE:3, RELEVANCE:4};
var CONST_SORT_ORDER = {ASC: 1, DESC: 2};
var CONST_SHAREDFOLDER = {NOTSHARED:0,SHAREDOWNER:1,SHAREDNOTOWNER:2};
var CONST_SHARECLASS = {TEMPO:0,SYSTEMSHARE:1,ENTERPRISE:2};
var CONST_HISTORYTABS = {AUDIT:'Audit',VERSION:'Version'};
var CONST_BROWSE_VIEW = {LIST:1,THUMBNAIL:2};
var CONST_BROWSE_OBJECT = {ALL:1,SYSTEMSHARE:2,ENTERPRISE:3,MYFILES:4,INCOMINGSHARES:5};

/**
This function handles changing the state when there is a change in the hash value of the URL

*/
var hashEventHandler = function(event){
		var hash = $.address.hash();
		var path = $.address.path();
		var pathParams = path.split('/');
		var action =  $.address.parameter('action');
		var id = parseInt($.address.parameter('id'),10);

		if (isNaN(id) || id === 0){
			id = info.userRootFolderID;
		}

		if (typeof action === 'string'){
			action = action.toUpperCase();
		}

		// the path always includes an initial / so we want to shift off the first item
		pathParams.shift();

		var view = pathParams.shift().toUpperCase();
		var defer = $.when();

        queue.RemoveGets();

			switch(view)
			{
				/******************************************** SEARCH TAB ***************************************/
				case TAB.SEARCH:
				    // Always set the search sort order, as the URL could have changed.
					SortController.SetSearchSortBy(parseInt($.address.parameter('sortby'),10));
					SortController.SetSearchSortOrder(parseInt($.address.parameter('sortorder'), 10));

					defer = startup.LoadSearchTab(defer);
					Search.DoSearch();
				break;

				/******************************************** LOGIN TAB ***************************************/
				case TAB.LOGIN:

					defer = startup.LoadLoginTab(defer);
					break;

				/******************************************** SHARE TAB ***************************************/
				//For the desktop client
				//Share tab doesn�t exist so redirect to ADDSHARE FILE
				case TAB.SHARE:
					if(!id || id === info.userRootFolderID){
						$.address.value('/');
						return;
					}
					else{
						$.address.value('FILE?action=addshare&id=' + id );
						return;
					}

				break;
				/******************************************** FILE TAB ***************************************/
				default:
				case TAB.FILE:

					// Always set the browse sort order, as the URL could have changed.
					SortController.SetBrowseSortBy(parseInt($.address.parameter('sortby'),10));
					SortController.SetBrowseSortOrder(parseInt($.address.parameter('sortorder'), 10));

					defer = startup.LoadFileTab(defer);

					switch(action){
						/*........................................... BROWSE FILE ......................................*/
						default:
						case 'BROWSE':
							  defer.pipe(function(){Browse.OnBrowse(id);});
							break;
							/*..................................... ADDSHARE FILE ....................................*/
							case 'ADDSHARE':
								if(!id){
									// if we don't have an id, then we must redirect to the default
									$.address.value('/');
									return;
								}

								defer.pipe(function(){Browse.OnAddShare(id);});
							break;
						}; // end of FILE.TAB's action case
						//initialize the picture Upload controller in profile.dialog.js

				break; // end of TAB.FILE case
				/******************************************** TASK TAB ***************************************/
				//Redirect to a folder from an assignment notification
				case TAB.TASK:

					//get folderID from notification
					var notificationJson = JSON.parse(decodeURIComponent($.address.parameter('notificationJson')));
					var notifyInfo = notificationJson.info;
					if (notifyInfo) {
						id = parseInt(notifyInfo.folderID,10);
					}

					if(!id || id === info.userRootFolderID){
						ui.MessageController.ShowError(T('ERROR.TaskNotInTempoBox'));
						$.address.value('/');
						return;
					}
					else{
						$.address.value('FILE?action=browse&id=' + id );
						return;
					}

				break;
			}; // end of view (tab) switch
	};


/**
This object is responsible for creating the initial UI for the application, and making the initial requests to populate it with content.
The way this object is constructed allows JavaScript to have private and public functions but only works as a singleton.

Public functions notation:
	this.MyPublicFunction

Private function notation:
	var _MyPrivateFunction



*/
var startup = new function (){

	/************************************************   LoadFileTab   *******************************************/
	this.LoadFileTab = function(defer){
        $('#updatingImage').show();
        $('#updatingImage').data('PageRequested', true);
		ui.PrepareAreasForTab(TAB.FILE);
		if (info.currentTab !== TAB.FILE){
            $('#searchfield').val('');
			ui.LoadPageTabs(TAB.FILE);
			info.currentTab = TAB.FILE;
		}
		SelectionController.Reset();
		SelectionController.UpdateMultiActionMenu();

		return defer;
	};

	/************************************************   LoadSearchTab   *******************************************/
    this.LoadSearchTab = function(defer){
        $('#updatingImage').show();
		ui.PrepareAreasForTab(TAB.SEARCH);
        if(info.currentTab !== TAB.SEARCH) {
            ui.LoadSearchTopButtons();
			ui.LoadPageTabs(TAB.SEARCH);
            info.currentTab = TAB.SEARCH;
        }
		return defer;
    };

	/************************************************   LoadLoginTab   *******************************************/
	this.LoadLoginTab = function(defer){
		if(info.currentTab !== TAB.LOGIN) {
			var loginDialog={
				usernameInput:
				{
					id:'loginName',
					type:'text',
					name:'loginName',
					placeHolder: T('LABEL.UserName'),
					textTop:T('LABEL.UserName'),
					wrapperClasses: 'loginUserName'
				},
				passwordInput:
				{
					id:'loginPwd',
					type:'password',
					name:'loginPwd',
					placeHolder: T('LABEL.Password'),
					textTop:T('LABEL.Password'),
					wrapperClasses: 'loginPassword'
				},
				button:
				{
					id:'loginButton',
					name:'loginButton',
					textRight:T('LABEL.SignIn'),
					classes: 'loginButton'
				}};

			$('#topNavigator').empty();


			var tmplItem = $('#page').tmplItem();
			if( tmplItem.update ){

				tmplItem.tmpl = $.template('loginTemplate_tmpl');
				tmplItem.data = loginDialog;
				tmplItem.update();
			}else{
				ui.LoadTemplateInEmptyElement('#loginTemplate_tmpl',loginDialog,'#tempo-main')
			}
			$('#loginName').focus();
			info.currentTab = TAB.LOGIN;
		}
		return defer;

	};

	/************************************************   _LoadTemplates   *******************************************/
	/**
	This function initializes the HTML template strings into the templating system.

	@private
	*/
	var _LoadTemplates = function (defer){
		var deferred = $.Deferred()
		$.get("tempo.tmpl.htm",function(data){
			$("body").append(data);
			deferred.resolve();
		});

		return deferred.promise();
	};

  	this.loadFrame = function (){

		var tmplItem = $('#loginPage').tmplItem();

		tmplItem.tmpl = $.template("#page_tmpl");
		tmplItem.data = _GetPageVars();
		if(tmplItem.update){
		tmplItem.update();
		}


  };

	var _GetPageVars = function(){

    var pageVars = { topLinks: [] };

		utils.recursiveReplace('$contentServerURL$', info.contentServerURL, info.navigationItems);
    	$.each(info.navigationItems, function(index, value) {
			pageVars.topLinks.push({
					id: value.id,
					classes: value.classes,
					text: value.label,
					url: value.url
			});
	});

	return pageVars;
	};


	/**
	This function defines the initlal data for the page template and then requests for it to be added to the page

	@private
	*/
	var  _AddInitialTemplates = function (){

		// if pageVars changes, be sure to check the code that
		// follows as it may manipulate the list
       	var pageVars = _GetPageVars();
		var dialogsVars = Dialogs.vars;

		ui.LoadTemplate("#page_tmpl", pageVars, '#tempo-main' );
		if(info.isAdminModeRequested){
			$("#pageLogo a").click(function(e){
				e.preventDefault();
				Browse.SetCurrentFolderInfo(null);
				$.address.value(TAB.FILE+'?action=browse&id='+info.userRootFolderID+'&sortby='+SortController.GetBrowseSortBy()+'&sortorder='+SortController.GetBrowseSortOrder()+'&browseView='+Browse.GetBrowseViewMode()+'&browseObject='+Browse.GetBrowseObjectMode());
			});
		}
		ui.LoadTemplate("#dialogs_tmpl", dialogsVars, '#tempo-main' );
		ui.drawDiskUsageArea(info.diskUsage,info.storageLimit);
	};

		/**
	This function is responsible for initializing the page.

	This function will go through the following basic steps:
		1. Load all translation strings into memory.
		2. Load all templates into memory.
		3. Draw the page using the templates.
		4. Bind the events the UI needs to watch for.
		6. Prepare all other UI elements such as dialogs.
		7. Make the initial requests for data by calling functions in the request object.

	@public
	*/

	this.InitialAuthPre = function(){

		var defer = $.Deferred();

		if($.address.path()!== "/LOGIN") {
			if(typeof $.address.parameter('t') === "undefined"){
				info.nexturl = $.address.value();
			}else{
				// the t parameter is used during a redirect from content server
				// we do not want it to appear once in the URL so redirect to /
				info.nexturl = "/";
			}
		}else{
			info.nexturl = "/";
		}

		if (info.userPrefUILang === ""){
			info.userPrefUILang = "en-US";
		}

		$.jsperanto.init( function(){ defer.resolve(); }, {lang:info.userPrefUILang, dicoSuffix:'js',dictionary:info.userPrefDictionary});

		defer.pipe(_LoadTemplates) .pipe(AddEvents);

		return defer.promise();
	};

	this.InitialAuth = function(){
		$.when(request.AuthenticateWithToken())
			.pipe(null,startup.PrepareAuthWithLogin) // only call PrepareAuthWithLogin if the AuthenticateWithToken fails
			.done(startup.InitialGetSettings);
	};

	this.PrepareAuthWithLogin = function(){
		// The authDefer is used to prevent futher execution of the code until there is
		// a successful authentication via the login page. This defer object is resolved
		// by response.Authenticate.

		var authDefer = $("#loginButton").data("defer")?$("#loginButton").data("defer"):$.Deferred();


		startup.LoadLoginTab(null);

		// storing the authDefer in the loginButton so that response.Authenticate can resolve it
		$("#loginButton").data("defer",authDefer);

		return authDefer.promise();
	};

	this.InitialGetSettings = function(){
		$.when(UserNotificationConfig.GetUserNotificationConfig(info.userID))
		.done(startup.InitialAuthPost);
	};

	this.InitialAuthPost = function(){
		$('#tempo-main').empty();

		var defer = $.Deferred();

		// calling init again as we may have a new preferred language now that the auth has been completed
		$.jsperanto.init( function(){ defer.resolve(); }, {lang:info.userPrefUILang, dicoSuffix:'js',dictionary:info.userPrefDictionary});

		defer.pipe(_AddInitialTemplates);
		defer.pipe(Dialogs.Initialize);

		defer.pipe(function(){
			$.address.change(hashEventHandler);

			// if the user is going to be redirected to a new url, then do so,
			// otherwise, fire the hashEventHandler for the first time to initialize the view

			if($.address.value() !== info.nexturl){
				$.address.value(info.nexturl);
			}else{
				hashEventHandler();
			}
		});


		return defer.promise();
	}
};

/**
This function will run when the page loads, and is responsible for starting off all inital actions.

*/
$(document).ready( function() {

	var defer = $.when();
	defer.pipe(startup.InitialAuthPre);
	defer.pipe(startup.InitialAuth);
});
