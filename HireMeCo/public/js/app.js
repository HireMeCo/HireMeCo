// this is the module that controlls everything the user can see
angular.module('hiremeApp',
     [
    'ui.bootstrap',
    'ngAnimate',
    'ngTouch',
    'ngRoute',
    'appRoutes',
    'MainModule',
    'PersonModule',
    'PersonService',
    'EmployeeModule',
    'EmployeeService',
    'LoginModule',
    'RegisterModule',
    'AuthServiceApp'
]
)

.controller('navigationController', function ($scope) {
    
    $scope.navHeadName = "Home";

    $scope.navItems = [
        { navName: "Dashboard", navPath: "/dashboard" },
        { navName: "Profile", navPath: "/profile" },
        { navName: "Search Jobs", navPath: "/search"}
    ];

});


//adminModue.config(function($stateProvider, $urlRouterProvider) {

//    $urlRouterProvider.otherwise("/main/tab1");

//    $stateProvider
//        .state("main", { abstract: true, url: "/main", templateUrl: "main.html" })
//            .state("main.tab1", { url: "/tab1", templateUrl: "tab1.html" })
//            .state("main.tab2", { url: "/tab2", templateUrl: "tab2.html" })
//            .state("main.tab3", { url: "/tab3", templateUrl: "tab3.html" });
//});


//adminModule.controller('AdminTabsControl', ['$scope', function ($scope) {
//        $scope.tabs = [
//            {
//                title: 'Job Seekers',
//                url: '/admin/viewEmployees'
//            },
//            {
//                title: 'Employers',
//                url: '/admin/viewEmployers'
//            }
//        ];

//        $scope.currentTab = '/admin/viewEmployees';

//        $scope.onClickTab = function (tab) {
//            $scope.currentTab = tab.url;
//        }

//        $scope.isActiveTab = function (tabUrl) {
//            return tabUrl == $scope.currentTab;

//        }
//    }]);