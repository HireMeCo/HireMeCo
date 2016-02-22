var path = require("path");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
module.exports = function (app) {
    
    app.use(function (req, res, next) {
        console.log("Using the API... not sure what this little snippet is for, honestly.");
        next();
    });

    //=========================================================
    //      PERSON CRUD (in case we need to consolidate employee/employer)
    //=========================================================
    //var Person = require('./models/personModel.js');
    //app.get('/api/people', Person.fetch);
    //app.post('/api/people', Person.add);
    //app.put('/api/epeople/:people', Person.modify);
    
    //=========================================================
    //      EMPLOYEE CRUD
    //=========================================================
    var Employee = require('./models/employeeModel.js');
    app.get('/api/employees', Employee.fetch);
    app.post('/api/employees', Employee.add);
    app.put('/api/employees/:employeeId', Employee.modify);
    
    //=========================================================
    //      EMPLOYER CRUD
    //=========================================================
    //var Employer= require('./models/employerModel.js');
    //app.get('/api/employers', Employer.fetch);
    //app.post('/api/employers', Employer.add);
    //app.put('/api/employers/:employerId', Employer.modify);
    
    //=========================================================
    //      JOB CRUD (?) or should this be a part of the employer schema?
    //=========================================================
    
    //=========================================================
    //      ADDITUDINAL SURVEY CRUD (?) or should this be a part of the employee schema?
    //=========================================================
    
    //=========================================================
    //      JOB CRUD (?) or should this be a part of the employer schema?
    //=========================================================



    //=========================================================
    //      MOVIE CRUD (test stuff)
    //=========================================================
    var Movie = require('./models/movieModel.js');
    app.get('/api/movies', Movie.fetch);
    app.post('/api/movies', Movie.add);
    app.put('/api/movies/:movieId', Movie.modify);
    

    //=========================================================
    //      ADMIN SECTION
    //=========================================================

    app.get("/admin/*", function (request, response) {
        response.sendFile(path.join(__dirname, '../public', '/views/admin/adminDashboard.html'));
    });
    
    //=========================================================
    //      MAIN USER SPA CATCH-ALL FOR ANGULAR ROUTES
    //=========================================================
    // frontend routes (this is for a single page application,
    // so everything routes to the main page)
    app.get('/', function (request, response) {
        response.sendFile(path.join(__dirname, '../public', '/views/index.html'));
        //these two do the same thing
        //response.sendFile('index1.html', { root: path.join(__dirname, '../public') });
        // ^^ this one is more secure, apparently
    });

};
