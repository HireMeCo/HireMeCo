// for authetication
//angular.module('EmployeeService', []).factory('employeeCRUD', function ($http, $q) {
angular.module('AuthServiceApp', []).factory('AuthService', function ($q, $timeout, $http) {

    // create user variable
    var user = null;
    var firstname = " ";
    var accountType = "job-seeker";

    // return available functions for use in controllers
    return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        getFirstname: getFirstname,
        getAccountType: getAccountType,
        login: login,
        logout: logout,
        register: register
    });

    function isLoggedIn() {
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    function getUserStatus() {
        return user;
    }

    function getAccountType() {
        return accountType;
    }


    function getFirstname() {
        return firstname;
    }

    function login(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/api/login', { username: username, password: password })
        // handle success
            .success(function (data, status) {
            if (status === 200 && data.status) {
                accountType = data.accountType;
                firstname = data.firstname;
                user = true;
                deferred.resolve();
            } else {
                user = false;
                deferred.reject();
            }
        })
        // handle error
            .error(function (data) {
            user = false;
            deferred.reject();
        });

        // return promise object
        return deferred.promise;

    }

    function logout() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/api/logout')
        // handle success
            .success(function (data) {
            user = false;
            deferred.resolve();
        })
        // handle error
            .error(function (data) {
            user = false;
            deferred.reject();
        });

        // return promise object
        return deferred.promise;

    }

    function register(username, password, firstname, accountType, SkillList, SurveyList ) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/api/register', {
            username: username,
            password: password,
            firstname: firstname,
            accountType: accountType,
            SkillList: SkillList,
            SurveyList: SurveyList
        })
        // handle success
            .success(function (data, status) {
            if (status === 200 && data.status) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        })
        // handle error
            .error(function (data) {
            deferred.reject();
        });

        // return promise object
        return deferred.promise;

    }

});