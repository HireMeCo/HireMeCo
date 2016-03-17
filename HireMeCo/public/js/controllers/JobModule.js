var JobModule = angular.module('JobModule', []);

JobModule.controller('JobCtrl',
['$scope', '$rootScope', '$location', 'JobService', 'AuthService',
    function ($scope, $rootScope, $location, JobService, AuthService) {

        console.log("Hey, we're in the job posting.");

        $scope.JobForm = {}

        $scope.JobForm.SkillList = AuthService.baseSkillList();
        $scope.JobForm.SurveyList = AuthService.baseSurveyList();

        $scope.post = function() {

            //initial values
            $scope.error = false;
            $scope.disabled = true;

            JobService.postJob(
                $scope.JobForm.JobTitle,
                $scope.JobForm.Description,
                $scope.JobForm.Salary,
                $scope.JobForm.Location,
                $scope.JobForm.EmploymentType,
                $scope.JobForm.SkillList,
                $scope.JobForm.SurveyList)
            // on success
            .then(function (){
                console.log("Job Posting Success!");
                $rootScope.ViewingJob = JobService.getJob();
                $location.path('/jobdetails');
                $scope.JobForm = {};
            })
            .catch(function() {
                console.log("Invalid Job Posting");
                $scope.error = true;
                $scope.errorMessage = "Invalid Content";
                $scope.JobForm = {};
            });
        };
    }
]);

JobModule.controller('ViewJobsCtrl',
    [
        '$scope',
        '$rootScope',
        '$location',
        'JobService',
        function($scope, $rootScope, $location, JobService)
        {
            //$rootScope.PostedJobs = JobService.getPostedJobs($rootScope.Account._id);
            $scope.GoToJob = function(result){
                $rootScope.ViewingJob = result.job;
                $rootScope.MatchResults = result.score;
                console.log(result);
                $location.path('/jobdetails');
            }

            $scope.GoToCompany = function(company) {
                $rootScope.ViewingCompany = company;
                console.log(company);
                $location.path('/company');
            }

            $scope.GoToPost = function(job) {
                $rootScope.ViewingJob = job;
                $rootScope.MatchResults = " ";
                console.log("Faking the match results");
                $location.path('/jobdetails');
            }
        }
    ]);