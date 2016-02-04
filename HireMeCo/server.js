// Jarrett Long
// server.js

// modules ===========================================
var http         = require('http');
var express      = require('express');
var app          = express();
var path         = require("path");
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');

// set the port =======================================
var port = process.env.port || 1337;


// configure stuff ====================================
var database = require('./config/database.js');

// connect to database =================================
mongoose.connect(database.url);

// parse data ==========================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set the static files location so users do /img instead of /public/img
app.use(express.static(path.join(__dirname, '/public')));

// handle routing =======================================
require('./app/routes.js')(app);

// start up the server =======================================
app.listen(port);

// console log ===============================================
console.log('App listening on port: ', port);

//expose the whole damn thing? not sure why just yet...
exports = app;