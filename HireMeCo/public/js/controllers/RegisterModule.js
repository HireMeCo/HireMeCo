var RegisterModule = angular.module('RegisterModule', []);

RegisterModule.controller('RegisterCtrl',
  ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
        
        console.log(AuthService.getUserStatus());
        
        $scope.register = function () {
            
            // initial values
            $scope.error = false;
            $scope.disabled = true;
            
            // call register from service
            AuthService.register(
                $scope.registerForm.username, 
                $scope.registerForm.password, 
                $scope.registerForm.firstname, 
                $scope.registerForm.accountType
                )

        // handle success
        .then(function () {
                console.log("Register success: " + $scope.registerForm.username + " " + $scope.registerForm.password);
                $location.path('/login');
                $scope.disabled = false;
                $scope.registerForm = {};
            })
        // handle error
        .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "Something went wrong!";
                $scope.disabled = false;
                $scope.registerForm = {};
            });

        };

    }]);
