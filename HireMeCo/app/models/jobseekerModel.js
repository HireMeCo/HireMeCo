var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var JobSeeker = new Schema({
    username: String,
    password: String,

    firstname: String,
    lastname: String,

    SkillList: [String],   // list of the ListItem.Values
    SurveyList: [String],  // list of the ListItem.Values
    MatchedJobs: [String], // list of the ObjectId().valueOf()
    accountType: String
});

JobSeeker.plugin(passportLocalMongoose);

module.exports = mongoose.model('JobSeeker', JobSeeker);