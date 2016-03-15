var RegisterModule = angular.module('RegisterModule', []);

RegisterModule.controller('RegisterCtrl',
  ['$scope', '$rootScope', '$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
        'use strict';
        console.log(AuthService.getUserStatus());

//================== SORTABLE LIST ==============================
        // $scope.skillSort = [
        //     { text: "Java", value: "Java" },
        //     { text: "C#",   value: "C#" },
        //     { text: "Python", value: "Python" },
        //     { text: "CSS", value: "CSS" },
        //     { text: "JavaScript", value: "JavaScript" }
        // ];
        // $scope.surveyList = [
        //     { text: "Item 1", value: "1" },
        //     { text: "Item 2", value: "2" },
        //     { text: "Item 3", value: "3" },
        //     { text: "Item 4", value: "4" },
        //     { text: "Item 5", value: "5" }
        // ];

        // =========== REGISTER ====================
        $scope.register = function () {

            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call register from service
            AuthService.register(
                $scope.registerForm.username,
                $scope.registerForm.password,
                $scope.registerForm.firstname,
                $scope.registerForm.accountType,
                [
            { text: "Java", value: "Java" },
            { text: "C#",   value: "C#" },
            { text: "Python", value: "Python" },
            { text: "CSS", value: "CSS" },
            { text: "JavaScript", value: "JavaScript" }
        ],
                [
            { text: "Item 1", value: "1" },
            { text: "Item 2", value: "2" },
            { text: "Item 3", value: "3" },
            { text: "Item 4", value: "4" },
            { text: "Item 5", value: "5" }
        ]
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
                console.log("RegisterModulejs:  ");
                $scope.error = true;
                $scope.errorMessage = "Something went wrong!";
                $scope.disabled = false;
                $scope.registerForm = {};
            });

        };
    }]);