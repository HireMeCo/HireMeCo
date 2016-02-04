// public/js/services/NerdService.js
angular.module('PersonService', []).factory('Person', ['$http', function ($http) {
        
        return {
            // call to get all nerds
            get : function () {
                return $http.get('/api/people');
            },
            
            
            // these will work when more API routes are defined on the Node side of things
            // call to POST and create a new person
            create : function (nerdData) {
                return $http.post('/api/people', nerdData);
            },
            
            // call to DELETE a person
            delete : function (id) {
                return $http.delete('/api/people/' + id);
            }
        }

    }]);