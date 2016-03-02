// For creating new jobs

angular.module('JobServiceApp', []).factory('JobService', function ($q, $timeout, $http){
    
    //TODO: everything
    
    // instantiate local variables
    var skills = [];
    var attitudes = [];
    var company = " ";
    var jobtitle = "";
    
    // return available functions for use in controllers
    return ({
        postJob: postJob,
        getSkills: getSkills,
        getAttitudes: getAttitudes,
        getCompany: getCompany,
        getJobTitle: getJobTitle
    });
    
    function getSkills(){
        return skills;
    }
    
    function getAttitudes() {
        return attitudes;
    }
    
    function getCompany(){
        return company;
    }
    
    function getJobTitle(){
        return jobtitle;
    }
    
    function postJob(jobtitle, company, skilllist, surveylist){
        
        var deferred = $q.defer();
        console.log("Entered the job service");
        console.log("This is whats getting sent: ");
        console.log("jobtitle: " + jobtitle);
        console.log("company: " + company);
        console.log("skilllist: " + skilllist);
        console.log("surveylist: " + surveylist);

        $http.post('/api/job', {
            jobtitle: jobtitle,
            company: company,
            skilllist: skilllist,
            surveylist: surveylist
            
          })
            .success(function (data, status) {
                console.log("Successful service post to api/job");
              if(status === 200 && data.status){
                  deferred.resolve();
              } else {
                  deferred.reject();
              }
          })
            .error(function (data) {
                console.log("Unsuccessful service post to api/job");
              deferred.reject();
          });
          
          return deferred.promise;
        
    };
    
    
});