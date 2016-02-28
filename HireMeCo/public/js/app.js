// this is the guy that controller everything on the front end
angular.module('hiremeApp',
     [ // all the dependencies
    'ui.bootstrap',
    'ngAnimate',
    'ngTouch',
    'ngRoute',
    'LoginModule',
    'RegisterModule',
    'AuthServiceApp'
])

// set local routes
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        
        $routeProvider
        .when('/', {
            templateUrl: 'views/pages/home.html'
        })
        .when('/login', {
            templateUrl: 'views/pages/login.html', 
            controller: 'LoginCtrl'
        })
        .when('/logout', {
            controller: 'LogoutCtrl'
        })
        .when('/register', {
            templateUrl: 'views/pages/register.html',
            controller: 'RegisterCtrl'
        })
        .when('/about', {
            templateUrl: 'views/pages/about.html',
            access: {restricted: false}
        })
        .when('/employerDashboard', {
            templateUrl: 'views/pages/employerDashboard.html',
            access: {restricted: true}
        })
        .otherwise({ redirectTo: '/' });
        
        $locationProvider.html5Mode(true);
}])

// set up the navigation (contextual based on if you're logged in and who is logged in) 
.controller('navigationController', ['$scope', '$rootScope',
    function ($scope, $rootScope, $location, AuthService) {
    
    //initialize variables
    $rootScope.isLoggedIn = false;
    $rootScope.firstname = " ";
    
    $scope.updateNav = function() {
        
        if($rootScope.isLoggedIn){
            
            // nav items for an employer
            if($rootScope.accountType == "employer"){
                
                $scope.greeting = "Company: " + $rootScope.firstname;
                $scope.navItems = [
                { name: "View Matched Employees", path: "/employerDashboard" },
                { name: "Edit Profile", path: "/profile" },
                { name: "Post A Job", path: "/postjob"}
                ];
            }
            
            // nav items for a job-seeker
            else{
                $scope.greeting = "Welcome, " + $rootScope.firstname;
                $scope.navItems = [
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Profile", path: "/profile" },
                    { name: "Search For Jobs", path: "/search"}
                ];
            }
            
           
        }
        
        // default nav items
        $scope.globalNav = [
            { name: "About", path: "/about"}, 
            { name: "Contact", path: "/contact"}
        ];
    };
    
    $scope.updateNav();
    
    $scope.navHeadName = "Home";

}])

// redirects to login screen if attempting to access restricted page
.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.access.restricted && AuthService.isLoggedIn() === false) {
      $location.path('/login');
      $route.reload();
    }
  });
})

;
