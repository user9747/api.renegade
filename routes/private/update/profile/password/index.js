var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var bcrypt = require('bcryptjs');

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

        var old_password = req.body.old_password;

        // verify old_password
        models.users.findOne({
          where: { id: userID },
          attributes: ['id', 'first_name', 'second_name', 'username', 'password_hash', 'role_id']
        }).then(function(user)
        {
          if(user != null)
          {
            //verify password here
            bcrypt.compare(old_password, user.password_hash).then((result) => {
              if(result == true)
              {
                // correct password

                var new_password = req.body.new_password;

                // add new_password to user's row
                bcrypt.genSalt(10, function(err, salt) {
                  if(!err)
                  {
                    bcrypt.hash(new_password, salt, function(err, hash) {
                      if(!err)
                      {
                        if(hash)
                        {
                          user.password_hash = hash;

                          // save changes to database
                          user.save().then(function(){
                            res.json({
                              "state": "success",
                              "description_slug": "success-update-profile-password",
                              "description": "Password change request completed successfully."
                            });
                          }).catch(function(err)
                          {
                            // handle error
                            console.log(err);

                            res.status(500).json({
                              "state": "failure",
                              "description_slug": "error-update-profile-password",
                              "description": "Password change request could not be completed."
                            });
                          });
                        }
                        else
                        {
                          res.status(500).json({
                            "state": "failure",
                            "description_slug": "error-update-profile-password",
                            "description": "Password change request could not be completed."
                          });
                        }
                      }
                      else
                      {
                        // handle error
                        console.log(err);

                        res.status(500).json({
                          "state": "failure",
                          "description_slug": "error-update-profile-password",
                          "description": "Password change request could not be completed."
                        });
                      }
                    });
                  }
                  else
                  {
                    // handle error
                    console.log(err);

                    res.status(500).json({
                      "state": "failure",
                      "description_slug": "error-update-profile-password",
                      "description": "Password change request could not be completed."
                    });
                  }
                });
              }
              else
              {
                // incorrect password
                res.status(403).json({
                  "state": "failure",
                  "description_slug": "error-update-profile-password-incorrect-password",
                  "description": "Incorrect old_password. Password change request could not be completed."
                });
              }
            }).catch(function(err)
            {
              // handle error
              console.log(err);

              res.status(500).json({
                "state": "failure",
                "description_slug": "error-update-profile-password",
                "description": "Password change request could not be completed."
              });
            });
          }
          else
          {
            // user not found
            res.status(500).json({"state": "failure",
            "description_slug": "error-update-profile-password",
            "description": "Password change request could not be completed."});
          }
        }).catch(function(err)
        {
          // handle error
          console.log(err);

          res.status(500).json({
            "state": "failure",
            "description_slug": "error-update-profile-password",
            "description": "Password change request could not be completed."
          });
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
