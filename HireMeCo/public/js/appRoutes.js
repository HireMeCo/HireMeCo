// client-side routing goes here
// public/js/appRoutes.js
angular.module('appRoutes', [])

.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    
    $routeProvider
        .when('/', {
             templateUrl: 'views/home.html' 
             })
        .when('/login', { 
            templateUrl: 'views/modules/login.html', 
            controller: 'LoginCtrl'
            })
        .when('/logout', { 
            controller: 'LogoutCtrl'
            })
        .when('/register', { 
            templateUrl: 'views/modules/register.html',
            controller: 'RegisterCtrl'
            })
        .otherwise({ redirectTo: '/' });
        
    $locationProvider.html5Mode(true);

}]);