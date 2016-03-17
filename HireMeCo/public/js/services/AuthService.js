// for authetication
//angular.module('EmployeeService', []).factory('employeeCRUD', function ($http, $q) {
angular.module('AuthServiceApp', []).factory('AuthService', function ($q, $timeout, $http) {

    // create user variable
    var user = null;
    var firstname = " ";
    var accountType = "job-seeker";
    var MatchedJobs = [];
    var account = null;
    var companyName = " ";

    // return available functions for use in controllers
    return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        getFirstname: getFirstname,
        getAccountType: getAccountType,
        getCompanyName: getCompanyName,
        isJobSeeker: isJobSeeker,
        getMatchedJobs: getMatchedJobs,
        getAccount: getAccount,
        baseSkillList: baseSkillList,
        baseSurveyList: baseSurveyList,
        login: login,
        logout: logout,
        register: register
    });

    function baseSkillList() {
        return [
            { text: "Bash", value: 10 },
            { text: "C", value: 20 },
            { text: "C++", value: 30 },
            { text: "C#", value: 40 },
            { text: "HTML", value: 50 },
            { text: "Java", value: 60 },
            { text: "JavaScript", value: 70 },
            { text: "Perl", value: 80 },
            { text: "PHP", value: 90 },
            { text: "Python", value: 100 },
            { text: "Ruby", value: 110 },
            { text: "SQL", value: 120 }

        ];
    }

    function baseSurveyList() {
        return [
            { text: "Good Listener", value: 130 },
            { text: "Strong Public Speaker", value: 140 },
            { text: "Problem Solver", value: 150 },
            { text: "Strong Leadership", value: 160 },
            { text: "Takes Initiative", value: 170 },
            { text: "Team Cooperation", value: 180 },
            { text: "Strong Written Communication", value: 190 },
            { text: "Strong Social Network", value: 200 },
            { text: "Attention to Detail", value: 210 },
            { text: "Strong Multi-Tasker", value: 220 },
            { text: "Punctual", value: 230 },
            { text: "Logical", value: 240 },
            { text: "Analytical", value: 250 },
            { text: "Creative", value: 260 },
            { text: "Ability to Work Under Pressure", value: 270 }
        ];
    }

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

    function isJobSeeker() {
        if (accountType == "job-seeker") return true;
        return false;
    }

    function getAccount() {
        return account;
    }

    function getCompanyName() {
        return companyName;
    }


    function getFirstname() {
        return firstname;
    }

    function getMatchedJobs() {
        return MatchedJobs;
    }

    function login(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/api/login', { username: username, password: password })
        // handle success
            .success(function (data, status) {
            if (status === 200 && data.status) {
                accountType = data.user.accountType;
                firstname = data.user.firstname;
                companyName = data.user.companyName;
                MatchedJobs = data.user.MatchedJobs;
                user = true;
                account = data.user;
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

    function register(accountType, username, password, firstname, lastname, description, education, major, concentration, companyName, location, CompanySize, CompanyType, WorkEnvironment, SkillList, SurveyList) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/api/register', {
            accountType: accountType,
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            description: description,
            education: education,
            major: major,
            concentration: concentration,
            companyName: companyName,
            location: location,
            CompanySize: CompanySize,
            CompanyType: CompanyType,
            WorkEnvironment: WorkEnvironment,
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