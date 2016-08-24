var appSettings = new function() {
    var _isDebug = false;
    var _gatewayUrl = "<your_gateway_url>";
    var _csUrl = '<your_csurl>';
    var _username = '<your_username>';
    var _password = '<your_password>';
    var _defaultLanguage = 'en';
    var _appName = "pws";


    /**
     * Within the return are all of the public functions that can be accessed outside this object. Note: if you run into this error: 'No 'Access-Control-Allow-Origin' header is
     * present on the requested resource.' while debugging in the browser please install the chrome plugin for this and allow xdomain requests. There is no way at present to get around
     * this on the bb10 clients so we are using android to bebug.
     */
    return {
        isDebug: function() {
            return _isDebug;
        },

        /**
         * You will need to update _baseUrl above to point at your server
         */
        getGatewayUrl: function () {
            return _gatewayUrl;
        },

        getContentServerURL: function () {
            return _csUrl;
        },

        getUserName: function(){
            return _username;
        },

        getPassword: function(){
            return _password;
        },

        getDefaultLanguage: function() {
            return _defaultLanguage;
        },
        getAppName: function(){
            return _appName
        }
    }
};
