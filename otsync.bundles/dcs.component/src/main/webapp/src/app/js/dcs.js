var DcsView = new function () {
    var deviceStrategy = null;

	this.getURLParameter = function(name) {

	    return decodeURIComponent(
	        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
	    );
	};

    this.setDeviceStrategy = function(){

        try{
            if (cordova.isBB()){
                deviceStrategy = new BlackBerryStrategy();
            }else{
                deviceStrategy = new NonBlackBerryStrategy();
            }
        }catch(error){
            deviceStrategy = new NonBlackBerryStrategy();
        }
    };

	this.showDcsView = function(){
        this.setDeviceStrategy();

		var docId = DcsView.getURLParameter('nodeID');
		var baseUrl = deviceStrategy.getGatewayURL() + '/dcs/v5/nodes/';
		var numPages = 0;
		var url = baseUrl + docId + '?_nocache=' + new Date().getTime();

        deviceStrategy.runRequestWithAuth({url: url})
		    .done(function(data){

                numPages= data;
                var pagesArray = [];

                for (var i = 1; i <= numPages; i++) {

                    pagesArray.push({
                        url : baseUrl + docId + '/pages/' + i,
                        caption : '' + i + ' / ' + numPages
                    });
                }

                var options = {
                    preventHide : true,
                    captionAndToolbarAutoHideDelay : 0,
                    captionAndToolbarOpacity : 1,
                    maxUserZoom: 0,

                    getImageSource : function(obj) {

                        return obj.url;
                    },

                    getImageCaption : function(obj) {

                        return obj.caption;
                    }
                };

                var instance = Code.PhotoSwipe.attach(pagesArray, options);
                instance.show(0);})
            .fail(function(error){
                alert(error);
            });
    };

};



function onAuthFinished(){
	DcsView.showDcsView();
}

// Trigger authentication when appworks is ready
document.addEventListener('appworksjs.auth', onAuthFinished, false);



