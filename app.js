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

var routes = require('./routes/index');

var app = express();

// Configuration DB
mongoose.connect(config.MongoURL);

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
    eveonlinejs.fetch('eve:CharacterInfo', {
      characterID: characterInformation.CharacterID
    }, function (err, result) {
      if (err) return done(err, user);

      User.findOrCreate({
        CharacterID: characterInformation.CharacterID
      }, function (err, user) {
        user.CharacterName = result.characterName;
        user.CorporationID = result.corporationID;
        user.CorporationName = result.corporation;
        user.save();
        return done(err, user);
      });
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
