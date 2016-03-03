var RegisterModule = angular.module('RegisterModule', []);

RegisterModule.controller('RegisterCtrl',
  ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
        'use strict';
        console.log(AuthService.getUserStatus());

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
                $scope.registerForm.accountType
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
                console.log("RegisterModulejs:  ")
                $scope.error = true;
                $scope.errorMessage = "Something went wrong!";
                $scope.disabled = false;
                $scope.registerForm = {};
            });

        };

        //================== SORTABLE LIST ==============================



        $scope.list = [
            { text: "hello", value: "world" },
            { text: "hello", value: "world" },
            { text: "hello", value: "world" },
            { text: "hello", value: "world" },
            { text: "hello", value: "world" }
        ];//myapp.buildArray('Item', 5);

        $scope.sortingLog = [];

        $scope.sortableOptions = {
            // called after a node is dropped
            stop: function (e, ui) {
                var logEntry = {
                    ID: $scope.sortingLog.length + 1,
                    Text: 'Moved element: ' + ui.item.scope().item.text
                };
                $scope.sortingLog.push(logEntry);
            }
        };


        $scope.sortSkills = function () {
            var sortableEle;

            $scope.sortableArray = [
                'One', 'Two', 'Three'
            ];

            $scope.add = function () {
                $scope.sortableArray.push('Item: ' + $scope.sortableArray.length);

                sortableEle.refresh();
            }

            $scope.dragStart = function (e, ui) {
                ui.item.data('start', ui.item.index());
            }
            $scope.dragEnd = function (e, ui) {
                var start = ui.item.data('start'),
                    end = ui.item.index();

                $scope.sortableArray.splice(end, 0,
            $scope.sortableArray.splice(start, 1)[0]);

                $scope.$apply();
            }

            sortableEle = $('#sortable').sortable({
                start: $scope.dragStart,
                update: $scope.dragEndw
            });
        }
    }]);