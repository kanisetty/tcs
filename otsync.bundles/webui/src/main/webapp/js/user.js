var user = new function() {
	this.userID = 0;
	this.userName = "";
	this.profilePicUrl = ""
	
	this.init = function() {
		this.userID = info.userID;
		this.userName = info.userName;
		this.fullName = info.fullName;
		this.displayName = info.displayName;
		this.profilePicUrl = user.GetProfilePicUrl();
	}
	
	/**
	 * this function updates the profile pic url by appending a new timestamp
	 *
	 * @returns {String} the profile pic url string
	 * @public
	 */ 
	this.GetProfilePicUrl = function(){
		return ui.GetProfilePicUrl(this.userID);
	}
}
