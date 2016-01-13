describe('collaboratorsController tests', function(){
    var $scope, $stateParams, $headerService, $displayMessageService, $sessionService, $collaboratorsResource, $collaboratorMenuService, $navigationService, $controller, $q,
        $dummyCollaboratorService, $ionicPopover, Header, $collaboratorsService;

    beforeEach(module('collaboratorsController', 'dummyCollaboratorService'));


    beforeEach(function() {
        $stateParams = {
            node : {
                sharing: function(){
                    return {
                        isShareable: function(){}
                    }
                }
            }
        };

		$headerService = {};
        $collaboratorMenuService = {};
        $collaboratorsService = {};
        $navigationService = {};
        $ionicPopover = {};

        $collaboratorsResource = {
            removeCollaborator: function(){}
        };

        $sessionService = {
            getGatewayURL: function() {
                return '/someURL';
            }
        };

        $displayMessageService = {
            createConfirmationPopup: function(){},
            hideMessage: function(){},
            showDisplayMessage: function(){},
            showToastMessage: function(){},
            translate: function(inputText){
                return inputText;
            }
        };

        module(function ($provide) {
            $provide.value('$displayMessageService', $displayMessageService);
            $provide.value('$navigationService', $navigationService);
            $provide.value('$sessionService', $sessionService);
            $provide.value('$collaboratorsResource', $collaboratorsResource);
            $provide.value('$ionicPopover', $ionicPopover);
            $provide.value('$collaboratorMenuService', $collaboratorMenuService);
            $provide.value('$stateParams', $stateParams);
            $provide.value('$collaboratorsService', $collaboratorsService);
        });

        inject(function (_$controller_,_$rootScope_, _$q_, _$dummyCollaboratorService_, _Header_) {
            $scope = _$rootScope_.$new();
            $controller = _$controller_;
            $q =_$q_;
            $dummyCollaboratorService = _$dummyCollaboratorService_;
            Header = _Header_;
        });
    });

    it('should not remove the collaborator if cancel was selected', function() {
        var confirmed = false;
        var collaborators = $dummyCollaboratorService.getDummyCollaborators();
        var collaborator = collaborators[1];

        spyOn($displayMessageService, 'createConfirmationPopup').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(confirmed);
            return deferred.promise;
        });

        spyOn($displayMessageService, 'hideMessage');
        spyOn($displayMessageService, 'showToastMessage');

        var collaboratorsController = $controller('collaboratorsController', {$scope:$scope, $stateParams:$stateParams, $headerService:$headerService, $displayMessageService:$displayMessageService,
            $sessionService:$sessionService, $collaboratorsResource:$collaboratorsResource, $collaboratorsService:$collaboratorsService,
            $collaboratorMenuService:$collaboratorMenuService, $navigationService:$navigationService, Header:Header});

        $scope.collaborators = collaborators;
        $scope.removeCollaborator(collaborator);
        $scope.$apply();

        expect($scope.collaborators).toEqual(collaborators);
        expect($displayMessageService.hideMessage).toHaveBeenCalled();
        expect($displayMessageService.showToastMessage).not.toHaveBeenCalled();
    });

    it('should remove the collaborator if ok was selected', function() {
        var confirmed = true;
        var collaborators = $dummyCollaboratorService.getDummyCollaborators();
        var collaborator = collaborators[1];

        spyOn($displayMessageService, 'createConfirmationPopup').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve(confirmed);
            return deferred.promise;
        });
        spyOn($displayMessageService, 'hideMessage');
        spyOn($displayMessageService, 'showToastMessage');

        spyOn($collaboratorsResource, 'removeCollaborator').and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        var collaboratorsController = $controller('collaboratorsController', {$scope:$scope, $stateParams:$stateParams, $headerService:$headerService, $displayMessageService:$displayMessageService,
            $sessionService:$sessionService, $collaboratorsResource:$collaboratorsResource, $collaboratorsService:$collaboratorsService,
            $collaboratorMenuService:$collaboratorMenuService, $navigationService:$navigationService, Header:Header});

        $scope.collaborators = collaborators;
        $scope.removeCollaborator(collaborator);
        $scope.$apply();

        expect($scope.collaborators[0].getCollaboratorName()).toEqual("Admin");
        expect($scope.collaborators[1].getCollaboratorName()).toEqual("test1");
        expect($scope.collaborators[2]).toEqual(undefined);
        expect($displayMessageService.hideMessage).toHaveBeenCalled();
        expect($displayMessageService.showToastMessage).toHaveBeenCalled();
    });
});
