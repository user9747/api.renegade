var express = require('express');
var router = express.Router();



var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var _ = require('lodash');
var Promise = require("bluebird");

var JWTsecret = require('../../../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../../../config/config.js').JWTissuer;

var models = require('../../../../../../models');

var sequelize = models.sequelize;

router.get('/', function(req, res, next) {
  res.json({"status": "functional"});
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
        // correct content_type in header

        // save userID from decoded data
        var userID = decoded.id;
        var offset = req.body.offset;
        var required_number = req.body.required_number;
        var postID= req.body.post_id;

        //   res.json({"userID": userID,
        //   "offset": offset,
        //   "required_number": required_number
        // });

        if(offset == null)
        {
          offset = 0;
        }

        // return all current posts
        models.user_post_follow_request_data.findAll({
             offset: offset,
             limit: required_number,
             order: [['updatedAt', 'DESC']],

              where: { post_id : postID  },
            attributes: ['user_id']
           }).then(function(result) {
             if(result == null || result.length == 0)
          {
            // no result
            res.json({"state": "success",
            "description_slug": "success-request-empty",
            "description": "request empty for the current post."});
          }
          else
          {
            var returnObject = [];
            var promises = [];

            function asyncPostElementProcess(post)
            {
              return new Promise(function(resolve, reject){
                models.users.findOne({
                  where: { id: post.user_id },
                  attributes: ['id','username', 'first_name', 'second_name'],
                  raw: true
                }).then(function(user){
                  if(user == null || user.length == 0)
                  {
                    // such a user does not exist
                    res.status(500).json({ "state": "failure",
                    "description_slug": "error-unknown",
                    "description": "Unknown error encountered internally."
                  });

                  reject();
                }
                else
                {
                  var returnElement = user;


                  returnObject.push(returnElement);

                  resolve();
                }
              }).catch(function (err) {
                console.log(err);
                // handle error;
                res.status(500).json({ "state": "failure",
                "description_slug": "error-unknown",
                "description": "Unknown error encountered internally."
              });

              reject();
            });
          });
        }

        _.forEach(result, function(post) {
          promises.push(asyncPostElementProcess(post));
        });

        Promise.all(promises).then(function() {
          // return result;
          res.json({ "state": "success",
          "description_slug": "success-acces-request-data",
          "description": "request data obtained successfully.",
          "data": returnObject
        });
      });
    }
    // res.json({"post_ids": post_ids});
  }).catch(function (err) {
    console.log(err);
    // handle error;
    res.status(500).json({ "state": "failure",
    "description_slug": "error-unknown",
    "description": "Unknown error encountered internally."
  });
}).catch(function (err) {
  console.log(err);
  // handle error;
  res.status(500).json({ "state": "failure",
  "description_slug": "error-unknown",
  "description": "Unknown error encountered internally."
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
