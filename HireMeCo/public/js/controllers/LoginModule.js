var LoginModule = angular.module('LoginModule', []);

LoginModule.controller('LoginCtrl',
  ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
        
        console.log("User Status: " + AuthService.getUserStatus());
        
        $scope.login = function () {
            
            // initial values
            $scope.error = false;
            $scope.disabled = true;
            
            // call login from service
            console.log("Calling Authservice.login(): " + $scope.loginForm.username + " " + $scope.loginForm.password);
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
                console.log("Login SUCCESS! Redirecting to home page");
                $location.path('/');
                $scope.disabled = false;
                $scope.loginForm = {};
            })
        // handle error
        .catch(function () {
                console.log("Invalid Username and Password: " + $scope.loginForm.username + " " + $scope.loginForm.password);
                $scope.error = true;
                $scope.errorMessage = "Invalid username and/or password";
                $scope.disabled = false;
                $scope.loginForm = {};
            });

        };

    }]);


LoginModule.controller('LoginModuleCtrl', function ($scope, $uibModal, $log) {
    
    $scope.items = ['item1', 'item2', 'item3'];
    
    
    
    $scope.open = function (size) {
        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'loginModal.html',
            controller: 'LoginInstanceCtrl',
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

});

LoginModule.controller('LoginInstanceCtrl', function ($scope, $uibModalInstance, items) {
    
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

LoginModule.controller('LogoutCtrl', ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
        
        $scope.logout = function () {
            
            console.log(AuthService.getUserStatus());
            
            // call logout from service
            AuthService.logout()
                .then(function () {
                $location.path('/login');
            });
        };
    }]);

