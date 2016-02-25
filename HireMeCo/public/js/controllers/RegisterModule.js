var RegisterModule = angular.module('RegisterModule', []);

RegisterModule.controller('RegisterCtrl', function ($scope, $uibModal, $log) {
    
    $scope.items = ['reg1', 'reg2', 'reg3'];
    
    $scope.animationsEnabled = true;
    
    $scope.open = function (size) {
        
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'registerModal.html',
            controller: 'RegisterInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});

RegisterModule.controller('RegisterInstanceCtrl', function ($scope, $uibModalInstance, items) {
    
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
