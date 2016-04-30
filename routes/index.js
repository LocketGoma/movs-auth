var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Service = require('../models/services');

/* GET home page. */
router.get('/', needLogin, function(req, res, next) {
  // Get Activactivated Service List
  Service.findOne({user: req.user}, function(err, service) {
    res.render('index', {
      title: 'Moving Star Manufacturer Portal',
      user: req.user,
      service,
    });
  })
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

function needLogin(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.render('movs-error-login');
}

module.exports = router;
