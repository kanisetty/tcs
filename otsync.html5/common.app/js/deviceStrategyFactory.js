var DeviceStrategyFactory = function () {
    var _deviceStrategy = null;

    if (isBlackberry()) {
        _deviceStrategy = new BlackBerryStrategy();
    } else {
        _deviceStrategy = new NonBlackBerryStrategy();
    }

    this.getDeviceStrategy = function () {
        return _deviceStrategy;
    };

    function isBlackberry() {
        return cordova && (cordova.isBB instanceof Function) && cordova.isBB();
    }
};