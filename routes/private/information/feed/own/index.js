var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var _ = require('lodash');
var Promise = require("bluebird");



var JWTsecret = require('../../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../../config/config.js').JWTissuer;

var models = require('../../../../../models');

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

        //   res.json({"userID": userID,
        //   "offset": offset,
        //   "required_number": required_number
        // });

        if(offset == null)
        {
          offset = 0;
        }

        // models.post_data.findAll({
        //   offset: offset,
        //   limit: required_number,
        //   order: [['updatedAt', 'DESC']],
        //   include: [{ model: models.post_sub_field_association }]
        //   // where: { ename: req.params.entity },
        //   // attributes: ['data']
        // }).then(function(result) {
        //   if(result == null || result.length == 0)
        //   {
        //     // no result
        //     res.json({"state": "success",
        //     "description_slug": "success-feeds-empty",
        //     "description": "Feeds empty for the current request."});
        //   }
        //   else
        //   {
        //     result = result[0].data;
        //
        //     // return result;
        //     res.json({ "value": result });
        //   }
        // }).catch(function (err) {
        //   console.log(err);
        //   // handle error;
        //   res.status(500).json({ "success": "false" });
        // });

        // return all current posts
        sequelize.query("SELECT * FROM post_data p1 WHERE p1.updatedAt IN (SELECT MAX(updatedAt) FROM post_data p2 GROUP BY post_id) AND author_id ="+userID, { type: sequelize.QueryTypes.SELECT})
        .then(function(result){
          if(result == null || result.length == 0)
          {
            // no result
            res.json({"state": "success",
            "description_slug": "success-feeds-empty",
            "description": "Feeds empty for the current request."});
          }
          else
          {
            var returnObject = [];
            var promises = [];

            function asyncPostElementProcess(post)
            {
              return new Promise(function(resolve, reject){
                models.users.findOne({
                  where: { id: post.author_id },
                  attributes: ['username', 'first_name', 'second_name'],
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
                  // user exists

                  models.post_like_data.count({
                    where: { post_id: post.post_id },
                    raw: true
                  }).then(function(like_count){


                    models.post_like_data.findOne({
                      where: {
                        post_id: post.post_id,
                        user_id: userID
                      }
                    }).then(function(post_like_data_element){

                      models.user_post_follow_request_data.count({
                        where: { post_id: post.post_id },
                        raw: true
                      }).then(function(request_count){


                      var returnElement = post;

                    delete returnElement.author_id;

                    returnElement.author = user;

                    returnElement.like_count = like_count;

                    returnElement.request_count = request_count;

                    if(post_like_data_element == null)
                    {
                      // not liked
                      returnElement.current_user_post_like_state = false;
                    }
                    else
                    {
                      // liked
                      returnElement.current_user_post_like_state = true;
                    }

                    returnObject.push(returnElement);

                    resolve();
                    }).catch(function(err){
                      console.log(err);

                      reject();
                    });
                  }).catch(function(err){
                    console.log(err);

                    reject();
                  });
                  }).catch(function(err){
                    console.log(err);

                    reject();
                  });
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
          "description_slug": "success-feeds",
          "description": "Feeds obtained successfully.",
          "data": returnObject
        });
      });
    }
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
