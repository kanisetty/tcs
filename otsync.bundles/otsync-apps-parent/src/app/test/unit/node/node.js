describe('Node tests', function(){
    var Node, $sessionService, $dummyNodeService;
    var _url = 'SomeURL';

    beforeEach(function(){
        module('Node', 'dummyNodeService');

        $sessionService = {
            getGatewayURL: function () {
                return _url;
            }
        };

        module(function ($provide) {
            $provide.value('$sessionService', $sessionService);
        });

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_Node_, _$dummyNodeService_){
            Node = _Node_;
            $dummyNodeService = _$dummyNodeService_;
        });
    });

    it('should return the default folder icon if the server URL is bad and we have a container ', function() {

        var node = $dummyNodeService.getNodeWithIsContainerUpdated(true);
        var expectedIconURL = "img/default_folder.png";

        spyOn($sessionService, 'getGatewayURL').and.returnValue(null);

        expect(node.getIconURL()).toEqual(expectedIconURL);
    });

    it('should return the default file icon if the server URL is bad and we do not have a container ', function() {

        var node = $dummyNodeService.getNodeWithIsContainerUpdated(false);
        var expectedIconURL = "img/default_file.png";

        spyOn($sessionService, 'getGatewayURL').and.returnValue(null);

        expect(node.getIconURL()).toEqual(expectedIconURL);
    });

    it('should return a valid icon URL if the server URL is good', function() {

        var node = $dummyNodeService.getDummyNode();
        var expectedIconURL = _url + "/content/img/browse_folder_icon_large.png";

        expect(node.getIconURL()).toEqual(expectedIconURL);
    });
});

