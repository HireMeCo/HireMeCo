// public/js/controllers/MainCtrl.js
var mainModule = angular.module('MainModule', []);

mainModule.controller('MainController', function ($scope) {
    
    $scope.tagline = 'To the moon and back!';

});

mainModule.controller('navigationController', function ($scope, $location, AuthService) {
    
    $scope.navHeadName = "Home";
    
    if(AuthService.isLoggedIn() == true){
        $scope.navItems = [
                { name: "Dashboard", path: "/dashboard" },
                { name: "Profile", path: "/profile" },
                { name: "Search Jobs", path: "/search"}
                ];
    }
    else{
        $scope.navItems = [
            { name: "Hello", path: "/home"}, 
            { name: "Goodbye", path: "/bye"}
        ];
    }

});