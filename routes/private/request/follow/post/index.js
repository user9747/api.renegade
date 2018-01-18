var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');


var JWTsecret = require('../../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../../config/config.js').JWTissuer;

var models = require('../../../../../models');


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
        // save userID from decoded data
        var userID = decoded.id;
        var postID = req.body.post_id;

        models.user_post_follow_request_data.findOne({where: { post_id: postID, user_id: userID }})
        .then(function(request_check_element) {
          //console.log(request_element);
          if(request_check_element != null){
            res.json({
              "state": "failure",
              "description_slug": "error-update-post-request",
              "description": "Request already exist.",
              "post_id": postID
            });
          }
          else
          {
            models.user_post_follow_request_data.create({ post_id: postID, user_id: userID })
            .then(function(request_add_element){
              if (request_add_element !=null) {

                res.json({"state": "success",
                "description_slug": "success-post-follow-request",
                "description": "Post follow request successfully created."
              });
              }
              else{
                res.json({
                  "state": "failure",
                  "description_slug": "error-update-post-request",
                  "description": "request could not be completed.",
                  "post_id": value
                });
              }


            }).catch(function(err)
          {
            // handle error
            console.log(err);

            // console.log(subStatusArray);

            res.json({
              "state": "failure",
              "description_slug": "error-update-post-request",
              "description": "request could not be completed.",
              "post_id": value
            });

        });


          }


        }).catch(function(err)
        {
          // handle error
          console.log(err);

          // console.log(subStatusArray);

          res.json({
            "state": "failure",
            "description_slug": "error-post-request-check",
            "description": "request check could not be completed.",
            "post_id": value
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
