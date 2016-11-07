angular.module('FavoritesHeader', ['Header', 'Menu', 'menuItemFactory', 'favoritesService', 'nodeBrowseDecoratingService'])

    .factory('FavoritesHeader', ['Header', 'Menu', '$displayMessageService', 'menuItemFactory', '$favoritesService', '$nodeBrowseDecoratingService',
			function (Header, Menu, $displayMessageService, menuItemFactory, $favoritesService, $nodeBrowseDecoratingService) {
				var _refresh = true;
				var _hasModal = true;

				var FavoritesHeader = function(title, showButton) {
					this.filesToSyncSize = 0;
					this.numberOfFilesToSync = 0;

					this.title = title;
					// TODO JI, DG Aug 10, 2016 removing sync.
					// it does not provide any utility to the user once files have been downloaded.
					// removing for the 16 release of OTE. may be looked at at a later date.
					//this.showButton = false;
					this.showButton = showButton;
					this.showButtonCSS  = 'ion-ios-download-outline';

					this.getFilesToSyncSize = function(){
						return this.filesToSyncSize;
					};

					this.getNumberOfFilesToSync = function(){
						return this.numberOfFilesToSync;
					};

					this.setFilesToSyncSize = function(filesToSyncSize){
						this.filesToSyncSize = filesToSyncSize;
					};

					this.setNumberOfFilesToSync = function(numberOfFilesToSync){
						this.numberOfFilesToSync = numberOfFilesToSync;
					};
				};

				FavoritesHeader.prototype = new Header(this.title, this.showButton);

				FavoritesHeader.prototype.doButtonAction = function(scope){
					var menu = new Menu();
					menu.menuItemClicked(this.getHeaderMenuItems(this.numberOfFilesToSync, this.filesToSyncSize));
				};

				FavoritesHeader.prototype.getHeaderMenuItems = function(numberOfFilesToSync, filesToSyncSize) {

					var syncActionMenuItem;

					if(numberOfFilesToSync == null || numberOfFilesToSync == 0) {

						syncActionMenuItem = menuItemFactory.createMenuItem("", !_refresh, !_hasModal,
								function () {
									$displayMessageService.showErrorMessage($displayMessageService.translate("NO FILES TO SYNC"), $displayMessageService.translate("SYNC ALL"));
								});
					} else {

						var confirmationKey = numberOfFilesToSync == 1 ? "SYNC ALL CONFIRMATION 1 FILE" : "SYNC ALL CONFIRMATION MANY FILES";
						var confirmationText = $displayMessageService.translate(confirmationKey, {files: numberOfFilesToSync, size: $nodeBrowseDecoratingService.getDisplayFileSize(filesToSyncSize)});

						syncActionMenuItem = menuItemFactory.createMenuItemWithConfirmation("", _refresh, !_hasModal,
								function () {
									return $favoritesService.doSync();
								},
								confirmationText);
					}

					return syncActionMenuItem;
				};

				return FavoritesHeader;
			}]);
