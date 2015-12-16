angular.module('sessionService', [])

.factory('$sessionService', function(){
    var _sessionStrategy;

    return {

        init: function(){
            return _sessionStrategy.init();
        },

        canInviteExternalUsers: function(){
            return _sessionStrategy.canInviteExternalUsers();
        },

		getAppName:function(){
			return _sessionStrategy.getAppName();
		},

        getClientType: function(){
            return _sessionStrategy.getClientType();
        },

		getContentServerURL: function(){
			return _sessionStrategy.getContentServerURL();
		},

		getDefaultLanguage: function(){
			return _sessionStrategy.getDefaultLanguage();
		},

		getGatewayURL: function(){
			return _sessionStrategy.getGatewayURL();
		},

        getOTCSTICKET: function(){
            return _sessionStrategy.getOTCSTICKET();
        },

        getRootID: function(rootName){
            return _sessionStrategy.getRootID(rootName);
        },

        getUsername: function(){
            return _sessionStrategy.getUsername();
        },

        isOnline: function(){
            return _sessionStrategy.isOnline();
        },

        runRequest: function(request){
            return _sessionStrategy.runRequest(request);
        },

		setSessionStrategy: function(sessionStrategy) {
			_sessionStrategy = sessionStrategy;
		}
    }
});
