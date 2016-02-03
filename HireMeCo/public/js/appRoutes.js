// client-side routing goes here
// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        
        $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // movies example
        .when('/movies', {
            templateUrl: 'views/MoviesList.html',
            controller: 'MoviesController'
        })

        // angular test
        .when('/test', {
            templateUrl: 'views/AngularJS.html',
            controller: 'TestController'
        })

        // people page that will use the people
        .when('/person', {
            templateUrl: 'views/person.html',
            controller: 'PersonController'
        });
                
        $locationProvider.html5Mode(true);

    }]);