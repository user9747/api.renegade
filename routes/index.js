var express = require('express');
var router = express.Router();

var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var models = require('../models');

var JWTsecret = require('../config/config.js').JWTsecret;

router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({"name":"Renegade API", "type":"Private"});
});

// authentication apis
router.use('/authentication', require('./authentication'));

// public apis
router.use('/public', require('./public'));

var opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = JWTsecret;
opts.audience = 'Renegade-Private-APIs';
opts.issuer = 'Renegade-Authentication-API';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  models.users.findOne({
    where: {id: jwt_payload.id,
      username: jwt_payload.username,
      role_id: jwt_payload.role_id
    },
    attributes: ['id', 'first_name', 'second_name', 'username', 'role_id']
  }).then(function(user) {
    if(user != null)
    {
      // user found
      return done(null, user);
    }
    else
    {
      // null returned
      return done(null, false);
    }
  }).catch(function(err)
  {
    // handle error
    return done(err, false);
  });
}));

// private apis
router.use('/private', passport.authenticate('jwt', { session: false }), require('./private'));

module.exports = router;
