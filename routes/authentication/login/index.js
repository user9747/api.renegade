var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var models = require('../../../models');

//passport local strategy for authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function() {
      models.users.findOne({
        where: { username: username },
        attributes: ['id', 'first_name', 'second_name', 'username', 'password_hash']
      }).then(function(result)
      {
        if(result != null)
        {
          console.log(result);
          //verify password here
          bcrypt.compare(password, hash).then((res) => {
            if(res == true)
            {
              return done(null, true);
            }
            else
            {
              return done(null, false);
            }
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

  router.post('/login/renegade', function(req, res, next) {
    passport.authenticate('local' ,function(err, user , info){
      if(err)
      return next(err);

      if(!user)
      return res.send({message:"Error authentcating. Username or password is incorrect"})

      req.logIn(user, { session: false }, function(err){
        if(err){
          return next(err);
        }

        //generating JWT
        var tokenData = {
          username:user.username,
          id:user._id,
          role:user.role
        }

        let token = jwt.sign(tokenData , "somesupersecret" , {
          expiresIn:"4h"
        })

        let basicUserDetails = {
          name: user.username,
          role: user.role
        }
        //req.session.accessToken = token;
        // req.session.user = basicUserDetails;
        res.json({"token": token});
      })
    })(req,res,next)
  })
  module.exports = router;
