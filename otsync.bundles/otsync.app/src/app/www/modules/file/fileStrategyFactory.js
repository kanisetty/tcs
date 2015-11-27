angular.module('fileStrategyFactory', ['DebugFileStrategy', 'FileStrategy'])

    .factory('fileStrategyFactory', ['DebugFileStrategy', 'FileStrategy',
        function (DebugFileStrategy, FileStrategy) {
            return {

                createFileStrategy: function(isDegub){
                    var fileStrategy = null;

                    if ( isDegub === true ){
                        fileStrategy = new DebugFileStrategy();
                    }
                    else {
                        fileStrategy = new FileStrategy();
                    }

                    return fileStrategy;
                }
            }
        }]);

