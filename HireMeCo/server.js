// Jarrett Long
// server.js
console.log("Starting...");
// modules ===========================================
var http          = require('http');
var express       = require('express');
var path          = require("path");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose      = require('mongoose');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;

console.log("Declared all variables.");

// set the port =======================================
var port = process.env.port || 1337;

// configure database ====================================
var database = require('./config/database.js');
mongoose.connect(database.url);

// begin account authentication setup
var Account = require('./app/models/account.js');
// var JobSeeker = require('./app/models/jobseekerModel.js');
// var Company = require('./app/models/companyModel.js');

var app = express();
console.log("Created express app");

var routes = require('./app/index.js');

// set the static files location so users do /img instead of /public/img
app.use(express.static(path.join(__dirname, '/public')));
console.log("server.js: set path to: express.static(" + path.join(__dirname, '/public') + ')');
console.log("server.js: __dirname: ", __dirname);
console.log("server.js: path.dirname(): ", path.dirname());

// parse data ==========================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
//authenticate jobseekers
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//authenticate jobseekers
// passport.use(new LocalStrategy(JobSeeker.authenticate()));
// passport.serializeUser(JobSeeker.serializeUser());
// passport.deserializeUser(JobSeeker.deserializeUser());


// handle routing =======================================
//require('./app/routes.js')(app);
app.use('/api/', routes);
console.log("server.js: using /api/ + routes. (index.js)");

app.get('/', function (req, res) {
    console.log("server.js: req.originalUrl: " + req.originalUrl);
    console.log("server.js: directing app to: " + path.join(__dirname, '/public', '/views/index.html'));
    res.sendFile(path.join(__dirname, '/public', '/views/index.html'));
});


// error hndlers
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     console.log("server.js: 404 error on line 68." );
//     next(err);
// });

// app.use(function (err, req, res) {
//     res.status(err.status || 500);
//     console.log("server.js: 500 error on line 75." );
//     res.end(JSON.stringify({
//         message: err.message,
//         error: {}
//     }));
// });


// start up the server =======================================
app.listen(port);

// console log ===============================================
console.log('server.js: app listening on port: ', port);

//expose the whole damn thing? not sure why just yet...
exports = app;