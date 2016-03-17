// configure
var mongoose = require('mongoose');
var Heap = require('binaryheap');
var db = mongoose.connection;
var Account = require('./account.js');

// define structure of the Mongo data
var JobSchema = new mongoose.Schema({
    JobTitle: String,
    Company: String,
    Wage: Number,
    Location: String,
    WorkEnvironment: String,
    EmploymentType: String,
    Description: String,
    SkillList: [String],
    SurveyList: [String],
    Marker: Number,
    Root: Boolean
});

module.exports = mongoose.model('Job', JobSchema);