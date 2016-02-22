// Angular Side of CRUD for Employees

angular.module('EmployeeService', []).factory('employeeCRUD', function ($http, $q) {
    
    function getAllEmployees() {
        var deferred = $q.defer();
        
        $http.get('/api/employees').then(function (result) {
            deferred.resolve(result.data);
        }, function (error) {
            deferred.reject(error);
        });
        
        return deferred.promise;
    }
    
    function addEmployee(newEmployee) {
        var deferred = $q.defer();
        
        $http.post('/api/employees', newEmployee).then(function (result) {
            deferred.resolve(result.data.employee);
        }, function (error) {
            deferred.reject(error);
        });
        
        return deferred.promise;
    }
    
    function modifyEmployee(updatedEmployee) {
        var deferred = $q.defer();
        
        $http.put('/api/employees/' + updatedEmployee._id, updatedEmployee).then(function (data) {
            deferred.resolve(data);
        }, function (error) {
            deferred.reject(error);
        });
        
        return deferred.promise;
    }
    
    return {
        getAllEmployees: getAllEmployees,
        addEmployee: addEmployee,
        modifyEmployee: modifyEmployee
    };
});