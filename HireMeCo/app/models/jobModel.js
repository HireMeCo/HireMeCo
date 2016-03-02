// initialize the model
var mongoose = require('mongoose');
var db = mongoose.connection;

// define structure of the data
var JobSchema = new mongoose.Schema({
    JobTitle: String,
    Company: String,
    SkillList: [String],
    SurveyList: [String]
});
//    matchedJobs: [jobs] //this needs editing, obviously

var JobModel = mongoose.model('Job', JobSchema);

db.on('error', console.error.bind(console, "connection error in jobModel.js"));
db.once('open', function () {
    console.log("employeesDb is open...");
    
    JobModel.find().exec(function (error, results) {
        if (results.length === 0) {
            console.log("Initial fetch of job seekers (employees)")
            JobModel.create({ name: "This means there was nothing in the db", released: false, watched: true });
        }
    });
});

exports.fetch = function (request, response) {
    JobModel.find().exec(function (err, res) {
        if (err) {
            response.send(500, { error: err });
        }
        else {
            console.log("Fetched Jobs from API call.")
            response.send(res);
        }
    });
};

exports.add = function (request, response) {
    console.log("Entered the job model api.");
    console.log("This is what's getting passed to mongoose: ");
    console.log("This is whats getting sent: ");
    console.log("jobtitle: " + request.body.jobtitle);
    console.log("company: " + request.body.company);
    console.log("skilllist: " + request.body.skilllist);
    console.log("surveylist: " + request.body.surveylist);
    var newjob = {
        JobTitle: request.body.jobtitle,
        Company: request.body.company,
        SkillList: request.body.skilllist,
        SurveyList: request.body.surveylist
    };
    
        
    JobModel.create(newjob, function (addError, addedEmployee) {
        if (addError) {
            console.log("Error adding employee to database.");
            response.status(500).json({ error: addError });
        }
        else {
            response.status(200).json({ status: 'Job Posting Success!' });
        }
    });
};

// exports.modify = function (request, response) {
//     
//     var employeeId = request.params.employeeId;
//     
//     JobModel.update(
//         { _id: employeeId },
//         {
//             firstname: request.body.firstname,
//             lastname: request.body.lastname,
//             age: request.body.age,
//             email: request.body.email
//         },
//         { multi: false },
//         function (error, rowsAffected) {
//             if (error) {
//                 console.log("Error updating employee (job seeker) data")
//                 response.send(500, { error: error });
//             }
//             else if (rowsAffected == 0) {
//                 response.send(500, { error: "No employees match id: " + employeeId });
//             }
//             else {
//                 response.send(200);
//             }
//         }
//     );
// };