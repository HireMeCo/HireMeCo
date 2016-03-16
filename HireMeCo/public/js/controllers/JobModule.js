var JobModule = angular.module('JobModule', []);

JobModule.controller('JobCtrl',
['$scope', '$rootScope', '$location', 'JobService',
    function ($scope, $rootScope, $location, JobService) {

        console.log("Hey, we're in the job posting.");

        $scope.post = function() {

            //initial values
            $scope.error = false;
            $scope.disabled = true;
            var SkillList = [];
            var SurveyList = [];

            //populate list of skills
            $scope.list.forEach(function (skill) {
                SkillList.push(skill.value);
            });

            //populate survey list
            $scope.survey.forEach(function (item) {
                SurveyList.push(item.value);
            });

            $scope.JobForm.SkillList = $scope.list;
            $scope.JobForm.SurveyList = $scope.survey;

            JobService.postJob(
                $scope.JobForm.JobTitle,
                $scope.JobForm.Company,
                $scope.JobForm.Description,
                SkillList,
                SurveyList)
            // on success
            .then(function (){
                console.log("Job Posting Success!");
                $location.path('/viewjobs');
                $scope.JobForm = {};
            })
            .catch(function() {
                console.log("Invalid Job Posting");
                $scope.error = true;
                $scope.errorMessage = "Invalid Content";
                $scope.JobForm = {};
            });
        };

        // SORTABLE LIST!
        $scope.list = [
            { text: "Java", value: "Java" },
            { text: "C#",   value: "C#" },
            { text: "Python", value: "Python" },
            { text: "CSS", value: "CSS" },
            { text: "JavaScript", value: "JavaScript" }
        ];

        $scope.survey = [
            { text: "Item 1", value: "1" },
            { text: "Item 2", value: "2" },
            { text: "Item 3", value: "3" },
            { text: "Item 4", value: "4" },
            { text: "Item 5", value: "5" }
        ];
    }
]);