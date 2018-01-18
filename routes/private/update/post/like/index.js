var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var JWTsecret = require('../../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../../config/config.js').JWTissuer;

var models = require('../../../../../models');

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
        // correct content_type in header

        var addStatusArray = [];
        var promisesAdd = [];

        // save userID from decoded data
        var userID = decoded.id;

        var add = req.body.add;
        var sub = req.body.sub;

        // res.json({"userID": userID,
        // "add": add,
        // "sub": sub});

        function asyncAddUpdate(value)
        {
          return new Promise(function(resolve, reject){
            models.post_like_data.findOrCreate({where: { post_id: value, user_id: userID }}).spread(function(post_like_element, created) {
              // console.log(created)
              if(created)
              {
                // console.log(addStatusArray);
                addStatusArray.push({
                  "state": "success",
                  "description_slug": "success-update-post-like-create",
                  "description": "Like successfully created.",
                  "post_id": value
                });

                resolve();
              }
              else
              {
                // console.log(addStatusArray);
                addStatusArray.push({
                  "state": "success",
                  "description_slug": "success-update-post-like-update",
                  "description": "Like successfully updated.",
                  "post_id": value
                });

                resolve();
              }
            }).catch(function(err)
            {
              // handle error
              console.log(err);

              // console.log(addStatusArray);

              addStatusArray.push({
                "state": "failure",
                "description_slug": "error-update-post-like-update",
                "description": "Like addition request could not be completed.",
                "post_id": value
              });

              resolve();
            });
          });
        }

        // console.log(addStatusArray);
        _.forEach(add, function(value) {
          // console.log(value);
          // console.log(addStatusArray);
          promisesAdd.push(asyncAddUpdate(value));
        });

        Promise.all(promisesAdd).then(function() {
          // console.log("all promisesAdd were pushed");
          // res.json({
          //   "add_returns": addStatusArray
          // });

          var subStatusArray = [];
          var promisesSub = [];

          function asyncSubUpdate(value)
          {
            return new Promise(function(resolve, reject){
              models.post_like_data.find({where: { post_id: value, user_id: userID }}).then(function(post_like_element) {
                // console.log(created)
                // console.log(subStatusArray);
                if(post_like_element != null)
                {
                  function destroyElement(post_like_element)
                  {
                    return post_like_element.destroy();
                  }

                  destroyElement(post_like_element).then(function(){
                    // post_like_element deleted here

                    // console.log(subStatusArray);
                    subStatusArray.push({
                      "state": "success",
                      "description_slug": "success-update-post-like-update",
                      "description": "Like successfully updated.",
                      "post_id": value
                    });
                    resolve();
                  }).catch(function(err)
                  {
                    // handle error
                    console.log(err);

                    // console.log(subStatusArray);

                    subStatusArray.push({
                      "state": "failure",
                      "description_slug": "error-update-post-like-update",
                      "description": "Like subtraction request could not be completed.",
                      "post_id": value
                    });
                    resolve();
                  });
                }
                else
                {
                  console.log("post_like_element = null for post_id = "+value);
                  subStatusArray.push({
                    "state": "failure",
                    "description_slug": "error-update-post-like-update",
                    "description": "Like subtraction request could not be completed.",
                    "post_id": value
                  });
                  resolve();
                }
              }).catch(function(err)
              {
                // handle error
                console.log(err);

                // console.log(subStatusArray);

                subStatusArray.push({
                  "state": "failure",
                  "description_slug": "error-update-post-like-update",
                  "description": "Like subtraction request could not be completed.",
                  "post_id": value
                });
                resolve();
              });
            });
          }

          // console.log(subStatusArray);
          _.forEach(sub, function(value) {
            // console.log(value);
            // console.log(subStatusArray);
            promisesSub.push(asyncSubUpdate(value));
          });

          Promise.all(promisesSub).then(function() {
            // console.log("all promises were pushed");
            res.json({
              "add_returns": addStatusArray,
              "sub_returns": subStatusArray
            });
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
