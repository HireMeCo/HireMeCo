// configure
var mongoose = require('mongoose');
var Heap = require('binaryheap');
var db = mongoose.connection;
var Account = require('./account.js');
var JobModel = require('./job.js');
var EdgeModel = require('./edge.js');
var Heuristic = require('./CalculateMatch.js')


// Log to the console for sanity
db.on('error', console.error.bind(console, "connection error in jobModel.js"));
db.once('open', function() { console.log("JobDB is open..."); });

var handleError = function(err, response) {
    console.log(err);
    response.status(500).json({ error: 'Trouble in paradise. Check console.' });
}

exports.handleError = handleError;

var returnJob = function(newjob, edge, response) {
    console.log("Inserted new job: " + newjob);
    response.status(200).json({
        status: 'Job Posting Success!',
        job: newjob.JobTitle,
        connectedto: edge
    });
}

//============================= ADD JOB =============================
// adds the job with the appropriate references
exports.add = function (request, response) {

    //add the new job to the database
    var newjob = new JobModel({
        Company: request.user,
        JobTitle: request.body.JobTitle,
        Description: request.body.Description,
        Salary: request.body.Salary,
        Location: request.body.Location,
        EmploymentType: request.body.EmploymentType,
        SkillList: request.body.SkillList,
        SurveyList: request.body.SurveyList
    });

    console.log("Adding new job: " + newjob.JobTitle);
    //TODO: Calculate Marker to index by


    newjob.save(function(err) {
        if (err) handleError(err, response);
        Account.findById(request.user._id, function(err, account) {
            if (err) handleError(err, response);
            account.jobs.push(newjob._id);
            console.log("Updated account: " + account);
            account.save(function(err) {
                if (err) handleError(err, response);
                response.status(200).json({
                    status: 'Job Posting Success!',
                    job: newjob
                });
            });
        });

    });
//     Account.findById(request.user._id) //add it to the Account schema for easy retrieval later
//         .populate('Company')
//         .exec(function(err, company) {
//             if (err) handleError(err);
//             console.log('Adding new job to Company jobs list');
//             company.jobs.push(newjob); //: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
//             company.save(function(err) {
//                 if (err) handleError(err, response);
//                 newjob.save(function(err) {
//                     if (err) handleError(err, response);
//                     response.status(200).json({
//                         status: 'Job Posting Success!',
//                         job: newjob
//                     });
//                 });
//             });
//         });
 };

// Grab ALL jobs (no A Star) worry about this in a sec
exports.getAllJobs = function (request, response) {

    JobModel.find().exec(function (err, res) {
        if (err) {
            console.log(err);
            response.status(500).json({ error: err });
        }
        else {
            console.log("Fetched All Jobs from API call.")
            response.status(200).send(res);
        }
    });
};

var Result = function(job, score) {
    this.job = job;
    this.score = score;
}
exports.ResultItem = Result;

exports.matchSeeker = function(request, response) {
    Account.findOne({ id: request.body.Account.id }, function(err, seeker) {
        if (err) handleError(err, response);
        results = [];
        JobModel.find().exec(function(err, jobs) {
            if (err) handleError(err, response);
            jobs.forEach(function(job) {
                results.push(new Result(job, Heuristic(seeker, job)));
            });
            results.sort(function(a, b) {
                b.score - a.score;
            });
            seeker.MatchedJobs.$set(results);
            response.status(200).json({
                status: "Returning matches :)",
                matches: results
            });
        });
    });
}