angular.module('browseService', [])

    .factory('$browseService', function(){
        var _browseStrategy;

        return{
            initialize: function(){
                _browseStrategy.initialize();
            },

            canMoreBeLoaded: function(){
                return _browseStrategy.canMoreBeLoaded();
            },

			clickBrowseDecorator: function(root, browseDecorator) {
				return _browseStrategy.clickBrowseDecorator(root, browseDecorator);
			},

            getBrowseDecorators: function(root, filter) {
            	return _browseStrategy.getBrowseDecorators(root, filter);
            },

            getRoot: function(stateParams){
                return _browseStrategy.getRoot(stateParams);
            },

            getRootID: function(stateParams){
                return _browseStrategy.getRootID(stateParams);
            },

			initializeHeader: function(root) {
				return _browseStrategy.initializeHeader(root);
			},

			longPressBrowseDecorator: function(scope, browseDecorator){
				return _browseStrategy.longPressBrowseDecorator(scope, browseDecorator);
			},

            setBrowseStrategy: function (strategy) {
                _browseStrategy =  strategy;
            }
        }
    });
