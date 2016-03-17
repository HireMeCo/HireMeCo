var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var JobModel = require('./job.js');


var Account = new Schema({
    username: String,
    password: String,
    accountType: String,
    location: String,
    description: String,

//====== JOB SEEKERS
    firstname: String,
    lastname: String,
    major: String,
    education: String,
    CompanyTypePref: [String],
    CompanySizePref: [String],
    LocationPref: [String],
    EmploymentTypePref: [String],
    WagePref: String,
    WorkEnvironmentPref: [String],
    SkillList: [String],
    SurveyList: [String],
    MatchedJobs: [{}],

//====== stuff for employers
    companyname: String,
    CompanySize: String,
    WorkEnvironment: String,
    jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);