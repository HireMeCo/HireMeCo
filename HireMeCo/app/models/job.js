// configure
var mongoose = require('mongoose');
var Heap = require('binaryheap');
var db = mongoose.connection;
var Account = require('./account.js');

// define structure of the Mongo data
var JobSchema = new mongoose.Schema({
    Applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    Company: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    JobTitle: String,
    Salary: String,
    Location: String,
    EmploymentType: String,
    Description: String,
    SkillList: [{}],
    SurveyList: [{}],
    Marker: Number
});

module.exports = mongoose.model('Job', JobSchema);