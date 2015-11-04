var setup = new function(){

	this.setupFadeTime = 100;
	
	this.cstoken = "";
	
	this.setEngineUrl = function(trackerUrl, engineUrl, key){
		$.post(trackerUrl + "/v1/instances/default/", {msgUrl: engineUrl, key: key })
		.success(function(data){
			$("#engine-to-tracker").show();
			setup.setTrackerUrl(trackerUrl);
		})
		.error(function(err, textStatus){
			setup.error(err);
		});
	};
	
	this.setTrackerUrl = function(trackerUrl){
		$.ajax({
			url: "v4/settings?tracker_url=" + encodeURIComponent(trackerUrl) + "&cstoken=" + encodeURIComponent(setup.cstoken),
			type: "PUT",
			success: function(data){
				$("#randomize-keys").show();
				setup.randomizeKeys(trackerUrl, $("#username").val(), $("#password").val());
			},
			error: function(err, textStatus){
				setup.error(err);
			}
		});
	};
	
	this.randomizeKeys = function(trackerUrl, username, password){
		var key = setup.generateRandomKey();
		$.post(trackerUrl + "/v1/auth", {username: username, password: password})
		.success(function(){
			$.ajax({ url: trackerUrl + "/v1/instances/default?key=" + encodeURIComponent(key), type: "PUT" })
			.success(function(){ setup.setEngineAndModuleKey(key); } )
			.error(function(err, textStatus){
				setup.error(err);
			});
		})
		.error(function(err, textStatus){
			setup.error(err);
		});
	};
	
	this.generateRandomKey = function(){
		
		var key = [];
		
		for (var i = 0; i < 48; i++){
			key[i] = (Math.random()*16|0).toString(16);	
		}
		
		return key.join("");
	};
	
	this.error = function(err){
		 var msg = "Error: " + err.status + " " + err.statusText;
		 $("#error").text(msg).show();
		 $("#error-page").html(err.responseText).show();
	};
	
	this.setEngineAndModuleKey = function(key){
		$.ajax({ url: "v4/settings?sharedKey=" + encodeURIComponent(key) + "&cstoken=" + encodeURIComponent(setup.cstoken),	type: "PUT"})
		.success(function(data){
				$("#success").fadeIn(setup.setupFadeTime);
			})
		.error(function(err, textStatus){
				setup.error(err);
			});
	};
	
	this.getCookie = function(cookieName){
		
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
};

$(document).ready(function(){
	
	$("#setup").hide();
	$("#username").focus();
	$("#error, #error-page, #tracker-to-engine, #engine-to-tracker, #randomize-keys, #success").hide();
	
	$("#username,#password").keypress(function(e){
		if(e.which == 13){
			$("#loginButton").click();
		}
	});
	
	$("#loginButton").button().click(function(){
		$.post("v4/auth", { admin: "true", username: $("#username").val(), password: $("#password").val()}, 
			function(data){
				setup.cstoken = data;
				$("#login").fadeOut(setup.setupFadeTime);
				var hostpath = window.location.protocol + "//" + window.location.host;
				$("#engine-url").val(hostpath + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")));
				$("#tracker-url").val(hostpath + "/tracker");
				$("#tracker-key").val("default");
				setTimeout(function(){
					$("#setup").fadeIn();
					$("#tracker-url").focus();
				}, setup.setupFadeTime);
			}, 
			"text" )
		.error(function(err){
			if(err.status == 404 || err.status == 401){
				alert("Credentials are not correct");
			}
			else {
				alert("Server is down or misconfigured");
			}
		});
	});
	
	$("#setup-button").button().click(function(){
		$("#error, #error-page, #tracker-to-engine, #engine-to-tracker, #randomize-keys, #success").hide();
		$("#tracker-to-engine").show();
		setup.setEngineUrl($("#tracker-url").val(), $("#engine-url").val(), $("#tracker-key").val());
	});
	
	$("#logoutButton").button().click(function(){
		setup.cstoken = "";
		$("#tracker-url, #engine-url, #username, #password").val("");
		$("#setup").fadeOut(setup.setupFadeTime);
		setTimeout(function(){
			$("#login").fadeIn();
			$("#username").focus();
		}, setup.setupFadeTime);
	});
});