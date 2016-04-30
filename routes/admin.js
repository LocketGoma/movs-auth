var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Service = require('../models/services');

/* Member Mgmt */
router.get('/member_permissions', onlyAdmin, function(req, res, next) {
  User.find({}, function(err, members) {
    res.render('member_permissions', {
      title: 'Member Permission Management',
      user: req.user,
      members,
    });
  });
});

router.get('/member_locations', onlyAdmin, function(req, res, next) {
  User.find({}, function(err, members) {
    res.render('member_locations', {
      title: 'Member Location Tracking',
      user: req.user,
      members,
    });
  });
});

router.get('/member_logins', onlyAdmin, function(req, res, next) {
  User.find({}, function(err, members) {
    res.render('member_logins', {
      title: 'Member Login Tracking',
      user: req.user,
      members,
    });
  });
});

router.get('/member_services', onlyAdmin, function(req, res, next) {
  Service.find({}).populate('user').exec(function(err, services) {
    res.render('member_services', {
      title: 'Connected Services',
      user: req.user,
      services,
    });
  });
});

function onlyAdmin(req, res, next) {
  if (req.user) {
    if (req.user.isAdmin) {
      next();
    } else {
      res.render('movs-error', {
        title:'Authorized Capsuleer Only',
        message:'Authorized Capsuleer Only'
      });
    }
  } else {
    res.render('movs-error', {
      title:'Authorized Capsuleer Only',
      message:'Authorized Capsuleer Only'
    });
  }
}

module.exports = router;
