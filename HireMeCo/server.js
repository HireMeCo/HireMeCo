// Jarrett Long
// server.js

// modules ===========================================
var http          = require('http');
var express       = require('express');
var app           = express();
var path          = require("path");
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// set the port =======================================
var port = process.env.port || 1337;


// configure stuff ====================================
var database = require('./config/database.js');

// parse data ==========================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up authentication ================================
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// set the static files location so users do /img instead of /public/img
app.use(express.static(path.join(__dirname, '/public')));

// handle routing =======================================
require('./app/routes.js')(app);

// passport config
var Account = require('./app/models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// connect to database =================================
mongoose.connect(database.url);

// start up the server =======================================
app.listen(port);

// console log ===============================================
console.log('App listening on port: ', port);

//expose the whole damn thing? not sure why just yet...
exports = app;