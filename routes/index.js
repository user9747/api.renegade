var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({"name":"Renegade API", "type":"Private"});
});

//passport local strategy for authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function() {
      if(username == 'username') {
        return done(null, true);
      }
    });
  }));


router.post('/login', function(req, res, next) {
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

    res.send({"message": user.username , success: true})
  })
})(req,res,next)
})
module.exports = router;
