angular.module('PopoverMenu', ['Menu'])

    .factory('PopoverMenu', ['Menu', '$ionicPopover', function(Menu, $ionicPopover) {
        var PopoverMenu = function(menuItems){
            this.menuItems = menuItems;
            this.popoverMenu = null;
        };

        PopoverMenu.prototype = new Menu(this.menuItems);

        PopoverMenu.prototype.showPopoverMenu = function(scope, $event){
            var self = this;

            $ionicPopover.fromTemplateUrl('modules/menu/popoverMenu.html', {
                scope: scope
            }).then(function (popover) {
                self.popoverMenu = popover;
                popover.show($event);
            });
        };

        PopoverMenu.prototype.hide = function(){
            this.popoverMenu.hide();
        };

        PopoverMenu.prototype.remove = function(){
            this.popoverMenu.remove();
        };

        return PopoverMenu;
    }]);