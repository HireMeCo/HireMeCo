var JobModule = angular.module('JobModule', []);

JobModule.controller('JobCtrl', 
['$scope', '$rootScope', '$location', 'JobService',
    function ($scope, $rootScope, $location, JobService) {
        
        console.log("Hey, we're in the job posting.");
        
        $scope.post = function() {
            
            //initial values
            $scope.error = false;
            $scope.disabled = true;
            var skilllist = [];
            var surveylist = [];
            
            //populate list of strings
            $scope.list.forEach(function (skill) {
                skilllist.push(skill.value);
            });
            $scope.survey.forEach(function (item) {
                surveylist.push(item.value);
            });
            
            $scope.jobForm.skillList = $scope.list;
            $scope.jobForm.surveyList = $scope.survey;
            
            JobService.postJob(
                $scope.jobForm.jobtitle,
                $scope.jobForm.company,
                skilllist,
                surveylist)
            // on success
            .then(function (){
                console.log("Job Posting Success!");
                $location.path('/viewjobs');
                $scope.jobForm = {};
            })
            .catch(function() {
                console.log("Invalid Job Posting");
                $scope.error = true;
                $scope.errorMessage = "Invalid shit";
                $scope.jobForm = {};
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