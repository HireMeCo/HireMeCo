var RegisterModule = angular.module('RegisterModule', []);

RegisterModule.controller('RegisterCtrl',
  ['$scope', '$rootScope', '$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
        'use strict';
        console.log(AuthService.getUserStatus());

        $scope.skillList = AuthService.baseSkillList();
        $scope.surveyList = AuthService.baseSurveyList();
        $scope.registerForm = {};
        $scope.registerForm.firstname = " ";
        $scope.registerForm.lastname = " ";
        $scope.registerForm.description = " ";
        $scope.registerForm.education = " ";
        $scope.registerForm.major = " ";
        $scope.registerForm.concentration = " ";
        $scope.registerForm.companyName = " ";
        $scope.registerForm.location = " ";
        $scope.registerForm.CompanySize = " ";
        $scope.registerForm.CompanyType = " ";
        $scope.registerForm.WorkEnvironment = " ";

        // =========== REGISTER ====================
        $scope.register = function () {
            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call register from service
            AuthService.register(
                $scope.registerForm.accountType,
                $scope.registerForm.username,
                $scope.registerForm.password,
                $scope.registerForm.firstname,
                $scope.registerForm.lastname,
                $scope.registerForm.description,
                $scope.registerForm.education,
                $scope.registerForm.major,
                $scope.registerForm.concentration,
                $scope.registerForm.companyName,
                $scope.registerForm.location,
                $scope.registerForm.CompanySize,
                $scope.registerForm.CompanyType,
                $scope.registerForm.WorkEnvironment,
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
