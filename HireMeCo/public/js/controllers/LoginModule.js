var LoginModule = angular.module('LoginModule', []);

LoginModule.controller('LoginCtrl',
  ['$scope', '$rootScope', '$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
        
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
                //update important front end stuff
                $rootScope.isLoggedIn = true;
                $rootScope.firstname = AuthService.getFirstname();
                $rootScope.accountType = AuthService.getAccountType();
                angular.element(document.getElementById('navigationElement')).scope().updateNav();
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


LoginModule.controller('LogoutCtrl', ['$scope', '$rootScope', '$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
        
        $scope.logout = function () {
            
            console.log(AuthService.getUserStatus());
            
            // call logout from service
            AuthService.logout()
                .then(function () {
                    $rootScope.isLoggedIn = true;
                    $rootScope.firstname = AuthService.getFirstname();
                    $rootScope.accountType = AuthService.getAccountType();
                    angular.element(document.getElementById('navigationElement')).scope().updateNav();
                    $location.path('/login');
            });
        };
    }]);

