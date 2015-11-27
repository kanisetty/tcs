angular.module('tokenService', [])

    .factory('$tokenService', function(){
        return {

            getOTCSTICKET: function () {
                return window.appworks.auth.getAuth().authResponse.addtl.contentServerConnector.otcsticket;
            }
        }
    });
