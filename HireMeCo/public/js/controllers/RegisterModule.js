var RegisterModule = angular.module('RegisterModule', []);

RegisterModule.controller('RegisterCtrl',
  ['$scope', '$rootScope', '$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
        'use strict';
        console.log(AuthService.getUserStatus());

        $scope.skillList = AuthService.baseSkillList();
        $scope.surveyList = AuthService.baseSurveyList();

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
                $scope.skillList,
                $scope.surveyList
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
