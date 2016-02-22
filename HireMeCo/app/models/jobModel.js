// initialize the model
var mongoose = require('mongoose');
var db = mongoose.connection;

// define structure of the data
var JobSchema = new mongoose.Schema({
    JobTitle: String,
    JobDesc: String,
    EmployerId: String,
    SkillList: [String],
    SurveyList: [String]
});
//    matchedJobs: [jobs] //this needs editing, obviously

var JobModel = mongoose.model('Job', EmployeeSchema);

db.on('error', console.error.bind(console, "connection error in jobModel.js"));
db.once('open', function () {
    console.log("employeesDb is open...");
    
    EmployeeModel.find().exec(function (error, results) {
        if (results.length === 0) {
            console.log("Initial fetch of job seekers (employees)")
            EmployeeModel.create({ name: "This means there was nothing in the db", released: false, watched: true });
        }
    });
});

exports.fetch = function (request, response) {
    JobModel.find().exec(function (err, res) {
        if (err) {
            response.send(500, { error: err });
        }
        else {
            console.log("Fetched Employees (job seekers) from API call.")
            response.send(res);
        }
    });
};

exports.add = function (request, response) {
    
    var newEmployee = {
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        age: request.body.age,
        email: request.body.email
    };
    
    
    
    EmployeeModel.create(newEmployee, function (addError, addedEmployee) {
        if (addError) {
            console.log("Error adding employee to database.")
            response.send(500, { error: addError });
        }
        else {
            response.send({ success: true, employee: addedEmployee });
        }
    });
};

exports.modify = function (request, response) {
    
    var employeeId = request.params.employeeId;
    
    EmployeeModel.update(
        { _id: employeeId },
        {
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            age: request.body.age,
            email: request.body.email
        },
        { multi: false },
        function (error, rowsAffected) {
            if (error) {
                console.log("Error updating employee (job seeker) data")
                response.send(500, { error: error });
            }
            else if (rowsAffected == 0) {
                response.send(500, { error: "No employees match id: " + employeeId });
            }
            else {
                response.send(200);
            }
        }
    );
};