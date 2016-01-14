angular.module('browseStrategyFactory', ['NodeBrowseStrategy', 'FavoritesBrowseStrategy', 'feedBrowseStrategyFactory'])
    .factory('browseStrategyFactory', ['NodeBrowseStrategy', 'FavoritesBrowseStrategy', 'feedBrowseStrategyFactory',
        function (NodeBrowseStrategy, FavoritesBrowseStrategy, feedBrowseStrategyFactory) {

            return {

                getBrowseStrategy: function(strategyName, stateParams){
                    var browseStrategy = null;

					if (strategyName === 'feeds' || stateParams.id == "PulseContent") {
						browseStrategy = feedBrowseStrategyFactory.getFeedBrowseStrategy(stateParams);
					} else if (stateParams == null || stateParams.id == null  || stateParams.id.length == 0) {
						browseStrategy = new NodeBrowseStrategy('');

						if ( strategyName === 'ews'){
							browseStrategy = new NodeBrowseStrategy('enterpriseWorkspaceRoot');
						} else if (strategyName === 'pws'){
							browseStrategy = new NodeBrowseStrategy('personalWorkspaceRoot');
						} else if (strategyName === 'tempo') {
							browseStrategy = new NodeBrowseStrategy('tempoBoxRoot');
						} else if (strategyName === 'favorites') {
							browseStrategy = new FavoritesBrowseStrategy('favorites');
						}
					} else {
						browseStrategy = new NodeBrowseStrategy('');
					}

					return browseStrategy;
				}
			}
    }]);
