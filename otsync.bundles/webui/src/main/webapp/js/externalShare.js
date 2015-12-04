"use strict";
var externalShare = new function(){

	this.SearchUserCallback=function(callback, textID){
		return function(data){
			if (data === null){

				data = [];
			}
			if (data.length == 0 && externalShare.ShareWithExternal()){
				
				var email = $(textID).val();

				//validate if the value in the box is a valid email address
				if(externalShare.IsValidEmail(email)){

					//valid email, create a record to allow sharing with this user
					//most of this data is used by the ui, and all that is needed by the API
					//at this point is the Name field

					data.push( {
						FirstName:email,
						ID:-5, // dummy id used, this user hasn't been created yet, so has no userID
						LastName:"("+T("LABEL.ExternalUser")+")",
						Name:email,
						PhotoURL: "",
						isFollowing: 0,
						label: T("LABEL.InviteExternalUser",{"email":email}),
						IsExternalUser:true,
						value:"",
						DisplayName: email
					});
				}
			}
			callback(data);
		}
	}

	this.ShareWithExternal=function(){
		// return if the user is allowed to share with external users
		// 
		return info.canInvite; 
	}

	var regexValidEmail;

	this.IsValidEmail=function(email){
	
		if( typeof regexValidEmail === "undefined")
			regexValidEmail = initializeEmailRegex();
			
		return regexValidEmail.test(email);
	}
	
	var initializeEmailRegex = function(){
	
		// allow few special characters in email address: +-._'`
		var emailValidationStr = /^([\w]+(?:[\w`'\.\+-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

		return new RegExp( emailValidationStr );
	};
	
};
