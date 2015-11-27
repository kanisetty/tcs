describe('FavoritesHeader getHeaderMenuItems tests', function(){
    var FavoritesHeader, $displayMessageService, $favoritesService, $nodeBrowseDecoratingService, $sessionService, $cacheService, $navigationService, $actionService,
        $fileService, $ionicModal;

    beforeEach(module('FavoritesHeader', 'Header', 'Menu', 'favoritesService', 'nodeBrowseDecoratingService'));

    beforeEach(function(){
        $sessionService = {};
        $cacheService = {};
        $navigationService = {};
        $actionService = {};
        $fileService = {};
        $ionicModal = {};

        $favoritesService = {
            doSync: function () {}
        };

        $displayMessageService = {
            translate: function (inputString) {
                return inputString;
            },

            showErrorMessage: function(message, title){}
        };

        $nodeBrowseDecoratingService = {
            getDisplayFileSize: function(fileSize){
                return fileSize;
            }
        };

        module(function ($provide) {
            $provide.value('$favoritesService', $favoritesService);
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$sessionService', $sessionService);
            $provide.value('$cacheService', $cacheService);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$actionService', $actionService);
            $provide.value('$fileService', $fileService);
            $provide.value('$ionicModal', $ionicModal);
            $provide.value('$nodeBrowseDecoratingService', $nodeBrowseDecoratingService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_FavoritesHeader_){
            FavoritesHeader = _FavoritesHeader_
        });
    });

    it('should show "SYNC ALL" title with "NO FILES TO SYNC" message if numberOfFilesToSync is null', function() {
        var menuItem;

        var numberOfFilesToSync = null;
        var filesToSyncSize = 10;

        spyOn($displayMessageService, 'showErrorMessage');

        var favoritesHeader = new  FavoritesHeader('', false);
        menuItem = favoritesHeader.getHeaderMenuItems(numberOfFilesToSync, filesToSyncSize);
        menuItem.action();

        expect($displayMessageService.showErrorMessage).toHaveBeenCalledWith("NO FILES TO SYNC", "SYNC ALL");
    });

    it('should show "SYNC ALL" title with "NO FILES TO SYNC" message if numberOfFilesToSync is 0', function() {
        var menuItem;

        var numberOfFilesToSync = 0;
        var filesToSyncSize = 10;

        spyOn($displayMessageService, 'showErrorMessage');

        var favoritesHeader = new  FavoritesHeader('', false);
        menuItem = favoritesHeader.getHeaderMenuItems(numberOfFilesToSync, filesToSyncSize);
        menuItem.action();

        expect($displayMessageService.showErrorMessage).toHaveBeenCalledWith("NO FILES TO SYNC", "SYNC ALL");
    });

    it('should show have a confirmation text of stating one file to sync if numberOfFilesToSync is one', function() {
        var menuItem;

        var numberOfFilesToSync = 1;
        var filesToSyncSize = 10;

        spyOn($displayMessageService, 'translate');

        var favoritesHeader = new  FavoritesHeader('', false);
        menuItem = favoritesHeader.getHeaderMenuItems(numberOfFilesToSync, filesToSyncSize);

        expect($displayMessageService.translate).toHaveBeenCalledWith("SYNC ALL CONFIRMATION 1 FILE", {files: numberOfFilesToSync, size: filesToSyncSize});
    });

    it('should show have a confirmation text of stating multiple files to sync if numberOfFilesToSync is more than one', function() {
        var menuItem;

        var numberOfFilesToSync = 11;
        var filesToSyncSize = 10;

        spyOn($displayMessageService, 'translate');

        var favoritesHeader = new  FavoritesHeader('', false);
        menuItem = favoritesHeader.getHeaderMenuItems(numberOfFilesToSync, filesToSyncSize);

        expect($displayMessageService.translate).toHaveBeenCalledWith("SYNC ALL CONFIRMATION MANY FILES", {files: numberOfFilesToSync, size: filesToSyncSize});
    });
});
