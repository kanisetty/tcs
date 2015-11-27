angular.module('sessionStrategyFactory', ['DebugSessionStrategy', 'OTAGSessionStrategy'])

    .factory('sessionStrategyFactory', ['DebugSessionStrategy', 'OTAGSessionStrategy',
        function (DebugSessionStrategy, OTAGSessionStrategy) {
            return {

                createSessionStrategy: function(isDegub, appName){
                    var sessionStrategy = null;

                    if ( isDegub === true ){
                        sessionStrategy = new DebugSessionStrategy(appName);
                    }
                    else {
                        sessionStrategy = new OTAGSessionStrategy(appName);
                    }

                    return sessionStrategy;
                }
            }
        }]);
