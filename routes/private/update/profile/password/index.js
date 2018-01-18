var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var JWTsecret = require('../../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../../config/config.js').JWTissuer;

var models = require('../../../../../models');

router.get('/', function(req, res, next) {
  res.json({ "status": "functional" });
});

router.post('/', bearerToken(), function(req, res, next) {
  jwt.verify(req.token, JWTsecret, { audience: JWTaudience, issuer: JWTissuer }, function(err, decoded) {
    if(err == null)
    {
      // no error in jwt verification
      var content_type = req.headers['content-type'];

      if (!content_type || content_type.indexOf('application/json') !== 0)
      {
        return res.send(400);
      }
      else
      {
        // correct content_type

        // save userID from decoded data
        var userID = decoded.id;

        // verify old_password
        models.users.findOne({
          where: { id: userID },
          attributes: ['id', 'first_name', 'second_name', 'username', 'password_hash', 'role_id']
        }).then(function(user)
        {
          if(user != null)
          {
            //verify password here
            bcrypt.compare(password, user.password_hash).then((res) => {
              if(res == true)
              {
                // correct password
                return done(null, user);
              }
              else
              {
                // incorrect password
                return done(null, false);
              }
            });
          }
          else
          {
            // user not found
            return done(null, false);
          }
        }).catch(function(err)
        {
          console.log(err);
          // handle error

        });
      }
    }
    else
    {
      // log error to the console
      console.log(err);

      // error occurred
      res.json({"state": "failure",
      "description-slug": "error-jwt-verification",
      "description": "Error occurred during verification of jwt token. Verify token used or obtain new token from Authentication API."
    });
  }
});
});

module.exports = router;
