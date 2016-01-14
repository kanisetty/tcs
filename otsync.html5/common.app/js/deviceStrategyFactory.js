var DeviceStrategyFactory = function() {
    var _deviceStrategy = null;

    try{
        if (cordova.isBB()){
            _deviceStrategy = new BlackBerryStrategy();
        }else{
            _deviceStrategy = new NonBlackBerryStrategy();
        }
    }catch(error){
        _deviceStrategy = new NonBlackBerryStrategy();
    }

    this.getDeviceStrategy = function(){
        return _deviceStrategy;
    };
};