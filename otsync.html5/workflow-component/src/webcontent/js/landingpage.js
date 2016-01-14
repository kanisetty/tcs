(function(){
	// load the version of cordova for the client os
	var os = window.location.search.split('=')[1];
	var cordovaPath = 'js/vendor/' + (os == "iOS" ? "cordova.ios.js" : "cordova.android.js");
	$("head").append($('<script type="text/javascript" src="' + cordovaPath + '"></script>'));
}).call();

function closeMe(){
	var successFn = function (session) {
	};
	var errorFn = function (data) {
		  alert(data);
	};
	  
	cordova.exec(successFn, errorFn, "Application", "closeme", []);	
}
