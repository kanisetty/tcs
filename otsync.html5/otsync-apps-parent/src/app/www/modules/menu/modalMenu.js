angular.module('ModalMenu', ['Menu'])

    .factory('ModalMenu', ['Menu', '$ionicModal', function(Menu, $ionicModal) {
        var ModalMenu = function(menuItems, menuTitleText, menuCancelText){
            this.menuItems = menuItems;
            this.menuTitleText = menuTitleText;
            this.menuCancelText = menuCancelText;
            this.modalMenu = null;
        };

        ModalMenu.prototype = new Menu(this.menuItems);

        ModalMenu.prototype.showModalMenu = function(scope){
            var self = this;

            $ionicModal.fromTemplateUrl('modules/menu/modalMenu.html', {
                scope: scope,
                animation: 'slide-in-up'
            }).then(function (modalMenu) {
                self.modalMenu = modalMenu;
                modalMenu.show();
            });
        };

        ModalMenu.prototype.getMenuCancelText = function(){
            return this.menuCancelText;
        };

        ModalMenu.prototype.getMenuTitleText = function(){
            return this.menuTitleText;
        };

        ModalMenu.prototype.hide = function(){
            this.modalMenu.hide();
        };

        ModalMenu.prototype.remove = function(){
            this.modalMenu.remove();
        };

        return ModalMenu;
    }]);