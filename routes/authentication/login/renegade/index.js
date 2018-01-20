var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var models = require('../../../../models');

var JWTsecret = require('../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../config/config.js').JWTissuer;

router.get('/', function(req, res, next) {
  res.json({"status":"functional"});
})

//passport local strategy for authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function() {
      models.users.findOne({
        where: { username: username },
        attributes: ['id', 'first_name', 'second_name', 'username', 'password_hash', 'role_id']
      }).then(function(user)
      {
        if(user != null)
        {
          //verify password here
          bcrypt.compare(password, user.password_hash).then((result) => {
            if(result == true)
            {
              return done(null, user);
            }
            else
            {
              return done(null, false);
            }
          }).catch(function(err)
          {
            // handle error
            return done(err);
          });
        }
        else
        {
          return done(null, false);
        }
      }).catch(function(err)
      {
        // handle error
        return done(err);
      });
      // if(username == 'username') {
      //   return done(null, true);
      // }
    });
  }));

  router.post('/', function(req, res, next) {
    var content_type = req.headers['content-type'];

    if (!content_type || content_type.indexOf('application/json') !== 0)
    {
      return res.send(400);
    }
    else
    {
      passport.authenticate('local' ,function(err, user , info){
        if(err)
        return next(err);

        if(!user)
        return res.json({"state": "failure",
        "description_slug": "error-login-renegade",
        "description":"Error authenticating. Username or password is incorrect"})

        if(err){
          return next(err);
        }

        var tokenData = {
          id:user.id,
          username:user.username,
          role_id:user.role_id
        }

        // console.log(tokenData);

        let token = jwt.sign(tokenData , JWTsecret , {
          expiresIn: "4h",
          audience: JWTaudience,
          issuer: JWTissuer
        })

        res.json({"state": "success",
        "description_slug": "success-login-renegade",
        "description": "Successful login.",
        "user_name": user.username,
        "token": token});
      })(req,res,next)
    }
  });
  module.exports = router;
