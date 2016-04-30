var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Service = require('../models/services');
var execPhp = require('exec-php');
var WpGroupPolicy = require('../models/wp_group_policy');
var groupPolicy = require('../policies/policy_group');

/* Member Mgmt */
router.get('/community_refresh', checkLogin, function(req, res, next) {
  User.findOne({name: req.user.name}, function(err, member) {
    execPhp('../services/wp/user.php', '/usr/bin/php', function(err, php, output){
      var wp_name = req.user.name.replace(" ","_");
      var wp_passwd = generatePassword();
      var wp_role = groupPolicy().getAuthGroup(req.user);

      WpGroupPolicy.findOne({authGroup: wp_role}, function(err, group) {
        console.log(group);
        php.refresh_user(wp_name, wp_passwd, req.user.name, req.user.characterID, group.wpGroup, function(error, result, output, printed){
          Service.findOrCreate({user: req.user}, function(err, service, created) {
            service.community.activated = true;
            service.community.id = wp_name;
            service.community.pass = wp_passwd;
            service.save();
          });

          res.redirect('/');
        });
      })
    });
  });
});

function checkLogin(req, res, next) {
  if (req.isAuthenticated())
      return next();

  res.render('movs-error', {
    title:'Authorized Capsuleer Only',
    message:'Authorized Capsuleer Only'
  });
}

function generatePassword() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i<12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = router;
