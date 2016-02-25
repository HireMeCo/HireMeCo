var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var path = require("path");
var router = express.Router();


router.get('/', function (req, res) {
    //res.render('index', { user : req.user });
    res.sendFile(path.join(__dirname, '../../public', '/views/index.html'), { user : req.user } );
});

// ================== LOGIN ===============================
router.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '../../public', '/views/modules/login.html'), { user : req.user } );
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


// ================== REGISTRATION ===============================
router.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname, '../../public', '/views/modules/register.html'), { } );
});


router.post('/register', function(req, res) {
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({err: err});
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({status: 'Registration successful!'});
    });
  });
});

router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

module.exports = router;