var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport')
var EveOnlineStrategy = require('passport-eveonline');
var eveonlinejs = require('eveonlinejs')

var config = require('./config/global.js');
var User = require('./models/user.js');
var syncdb = require('./controllers/usersync.js');

var routes = require('./routes/index');
var adminRoutes = require('./routes/admin.js');
var servicesRoutes = require('./routes/services.js');
var groupPolicy = require('./policies/policy_group')

var app = express();

// Configuration DB
mongoose.connect(config.MongoURL, function(err) {
  if (err) throw err;

  // Initiate Policy
  // WP Groups
  var groups = new groupPolicy().groups;
  var WpGroupPolicy = require('./models/wp_group_policy');
  WpGroupPolicy.count(function (err, count) {
    if(count === 0) {
      console.log('Need to init wp group policies');
      groups.forEach(function(name) {
        var policy = new WpGroupPolicy();
        policy.authGroup = name;
        policy.save();
      });
    }
  });

  // Sync corp member DB
  syncdb.syncMembers();
  syncdb.startSync();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// EVE Online SSO Auth
passport.use('eveonline', new EveOnlineStrategy({
    clientID: config.EVEclientID,
    clientSecret: config.EVEclientSecret,
    callbackURL: config.EVEcallbackURL,
  },
  function(characterInformation, done) {
    User.findOne({
      characterID: characterInformation.CharacterID
    }, function (err, user) {
      if(err) throw err;

      if(!user) {
        return done(null, false);
      }

      return done(err, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport configurations
app.use(session({
  secret: config.SessionSecret,
  cookie: { domain:'.movingstar.org'},
}));
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/admin', adminRoutes);
app.use('/services', servicesRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
