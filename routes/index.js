var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Moving Star Manufacturer Portal',
    user: req.user,
  });
});

router.get('/login', function check_login(req, res, next) {
  if(req.isAuthenticated()) {
    // Already logged in.
    if(req.query.callback) {
      res.redirect(req.query.callback);
    } else {
      res.redirect('/');
    }
  } else {
    // Process EVE Online SSO Login
    next();
  }
}, passport.authenticate('eveonline', { successRedirect: '/',
                                        failureRedirect: '/' }));

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
