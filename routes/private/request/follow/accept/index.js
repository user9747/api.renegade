var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');


var JWTsecret = require('../../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../../config/config.js').JWTissuer;

var models = require('../../../../../models');

var sequelize = models.sequelize;

var Promise = require("bluebird");
var _ = require("lodash");



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
        //var userID = decoded.id;
        var userID = req.body.user_id;
        var postID = req.body.post_id;
        // res.json({"userid":userID});


        return sequelize.transaction(function (t) {


          return models.user_post_follow_request_data.find({where: { post_id: postID, user_id: userID }},{transaction: t})
          .then(function(post_follow_check_element) {

            // console.log(post_follow_check_element);
            //
            // res.json({value:post_follow_check_element});
            // console.log(created)
            // console.log(subStatusArray);
            if(post_follow_check_element != null)
            {




              return post_follow_check_element.destroy()
              .then(function(){
                // post_like_element deleted here

                // console.log(subStatusArray);
                return models.user_post_follow_data.create({post_id: postID, user_id: userID}
                  , {transaction: t});


                });


              }
              else
              {
                throw new Error("error on request accept");
              }
            });
          }).then(function (result) {
            // Transaction has been committed
            // result is whatever the result of the promise chain returned to the transaction callback
            res.json({"state": "success",
            "description_slug": "success-post-request-accepted",
            "description": "Post follow request successfully accepted."});
          }).catch(function(err)
          {
            // handle error
            console.log(err);

            // console.log(subStatusArray);

            res.json({
              "state": "failure",
              "description_slug": "error-accept-post-follow-request",
              "description": "post follow request accept request could not be completed.",
              "post_id": postID
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
