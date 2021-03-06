var express = require('express');
var router = express.Router();

var bcrypt = require('bcryptjs');

var models = require('../../../../models');

router.get('/', function(req, res, next) {
  res.json({"status":"functional"});
})

router.post('/', function(req, res, next) {
  //   res.json({"status": "functional",
  //   "username": req.body.username,
  //   "password": req.body.password
  // });
  var content_type = req.headers['content-type'];

  if (!content_type || content_type.indexOf('application/json') !== 0)
  {
    return res.send(400);
  }
  else
  {
    bcrypt.genSalt(10, function(err, salt) {
      if(!err)
      {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          if(!err)
          {
            // Store hash in your password DB.
            models.users.findOne({where: {
              username: req.body.username
            }}).then(function(user) {
              if(user == null)
              {
                // no such user exists
                models.users.findOne({where: {
                  email: req.body.email
                }}).then(function(user) {
                  if(user == null)
                  {
                    // no such user with email exists
                    models.users.create({ first_name: req.body.first_name,
                      second_name: req.body.second_name,
                      date_of_birth: req.body.date_of_birth,
                      gender: req.body.gender,
                      email: req.body.email,
                      profile_picture: "default.jpeg",
                      username: req.body.username,
                      password_hash: hash,
                      occupation_id: req.body.occupation_id,
                      role_id: 1
                    }).then(function(user){
                      res.json({"state": "success",
                      "description_slug": "success-signup-renegade",
                      "description": "User has been successfully signed up with the system."
                    });
                  }).catch(function(err)
                  {
                    // handle error
                    console.log("Error:"+err);
                    res.status(500).json({"state": "failure",
                    "description_slug": "error-unknown",
                    "description": "Error occurred during signup. Verify methods and post data."});
                  });
                }
                else
                {
                  // email already exists
                  res.status(409).json({"state": "failure",
                  "description_slug": "error-email-exists",
                  "description": "email already exists. Cannot proceed with signup."
                });
              }
            }).catch(function(err)
            {
              // handle error
              console.log("Error:"+err);
              res.status(500).json({"state": "failure",
              "description_slug": "error-unknown",
              "description": "Error occurred during signup. Verify methods and post data."});
            });
          }
          else
          {
            // username already exists
            res.status(409).json({"state": "failure",
            "description_slug": "error-username-exists",
            "description": "username already exists. Cannot proceed with signup."
          });
        }
      }).catch(function(err)
      {
        // handle error
        console.log("Error:"+err);
        res.status(500).json({"state": "failure",
        "description_slug": "error-unknown",
        "description": "Error occurred during signup. Verify methods and post data."});
      });
    }
    else
    {
      console.log(err);
      res.status(500).json({"status": 500,
      "state": "failure"});
    }
  });
}
else
{
  console.log(err);
  res.status(500).json({"status": 500,
  "state": "failure"});
}
});
}
})

module.exports = router;
