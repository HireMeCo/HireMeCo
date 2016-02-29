// For creating new jobs

angular.module('JobServiceApp', []).factory('JobService', function ($q, $timeout, $http){
    
    //TODO: everything
    
    // instantiate local variables
    var skills = {};
    var attitudes = {};
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
    
    function postJob(jobtitle, company, attitudes, skills){
        
        var deferred = $q.defer();
        
        $http.post('/api/job', {
            jobtitle: jobtitle,
            company: company,
            attitudes: attitudes,
            skills: skills,
          })
          .success(function(data, status){
              if(status === 200 && data.status){
                  deferred.resolve();
              } else {
                  deferred.reject();
              }
          })
          .error(function (data) {
              deferred.reject();
          });
          
          return deferred.promise;
        
    };
    
    
});