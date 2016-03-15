var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// okay what wer're doing here is really stupid.
// we should really have two different schemas for two different accounts
// but whatever, this is a school project and right now I don't have
// time to do it the right way... :'( I'm sorry world
var Account = new Schema({
    username: String,
    password: String,
    accountType: String,

// stuff for job-seekers
    firstname: String,
    lastname: String,
    SkillList: [String],   // list of the ListItem.Values
    SurveyList: [String],  // list of the ListItem.Values
    MatchedJobs: [String], // list of the ObjectId().valueOf()

// stuff for employers
    companyname: String,
    jobs: [Schema.Types.ObjectId], // list of id's this account has created
    location: String,
    description: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);