var employeeModule = angular.module('EmployeeModule', []);

employeeModule.controller('employeeController', function ($scope, employeeCRUD) {

    $scope.title = "View all employees";
    
    //function init() {
    //    employeeCRUD.getAllEmployees.then(function (employees) {
    //        $scope.employees = employees;
    //    }, function (error) {
    //        console.log(error);
    //    });
    //}
    //init();

});