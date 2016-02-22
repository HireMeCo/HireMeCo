// client-side routing goes here
// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        
        $routeProvider

        // ===== MAIN FRONT END ===========================
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/about', {
            templateUrl: 'views/global/about.html'
        })
        .when('/contact', {
            templateUrl: 'views/global/contact.html'
        })
        .when('/login', {
            templateUrl: 'views/modules/login.html'
        })
        .when('/signup', {
            templateUrl: 'views/global/signup.html'
        })
        .when('/profile', {
            templateUrl: 'views/employee/employeeProfile.html',
            controller: 'EmployeeController'
        })
        .when('/search', {
            templateUrl: 'views/global/searchResults.html'
        })
        //.when('/movies', {
        //    templateUrl: 'views/MoviesList.html',
        //    controller: 'MoviesController'
        //})
        //============================================================


        
        // ============ ADMIN BACKEND ================================
        .when('/admin/employees', {
            templateUrl: 'views/admin/viewEmployees.html',
            controller: 'employeeController'
        })
        .when('/admin/employers', {
            templateUrl: 'views/admin/viewEmployers.html',
            controller: 'employerController'
        })
        .when('/admin/jobs', {
            templateUrl: 'views/admin/viewJobs.html',
            controller: 'JobsController'
        });
        //==============================================================
        
        $locationProvider.html5Mode(true);

    }]);