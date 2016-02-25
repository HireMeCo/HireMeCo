// Jarrett Long
// server.js

// modules ===========================================
var http          = require('http');
var express       = require('express');
var path          = require("path");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose      = require('mongoose');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;



// set the port =======================================
var port = process.env.port || 1337;


// configure stuff ====================================
var database = require('./config/database.js');

// connect to database =================================
mongoose.connect(database.url);

// begin account authentication setup
var Account = require('./app/models/account');

var app = express();

var routes = require('./app/routes/index');

// set the static files location so users do /img instead of /public/img
app.use(express.static(path.join(__dirname, '/public')));

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
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// handle routing =======================================
//require('./app/routes.js')(app);
app.use('/user/', routes);

 app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public', '/views/index.html'));
});


// error hndlers
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
        message: err.message,
        error: {}
    }));
});


// start up the server =======================================
app.listen(port);

// console log ===============================================
console.log('App listening on port: ', port);

//expose the whole damn thing? not sure why just yet...
exports = app;