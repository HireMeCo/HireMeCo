var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Company = new Schema({
    username: String,
    password: String,

    companyName: String,

    jobs: [String],    // list of the ObjectId().valueOf() jobs related to
    accountType: String
});

Company.plugin(passportLocalMongoose);

module.exports = mongoose.model('Company', Company);