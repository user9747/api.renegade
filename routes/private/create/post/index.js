var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var JWTsecret = require('../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../config/config.js').JWTissuer;

var models = require('../../../../models');

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
        var userID = decoded.id;

        return sequelize.transaction(function (t) {

          // chain all your queries here. make sure you return them.
          return models.post_owner_association.create({
            owner_id: userID,
            post_status: "v"
          }, {transaction: t}).then(function (post_owner_association) {
            // save in variables
            var post_id = post_owner_association.id;
            var post_content = req.body.post_content;
            var post_text = req.body.post_text;
            var post_image = req.body.post_image;

            return models.post_data.create({
              post_id: post_id,
              author_id: userID,
              post_content: post_content,
              post_element_status: "v",
              post_text: post_text,
              post_image: post_image
            }, {transaction: t}).then(function(post_data_element) {

              var add = req.body.sub_field_add;

              if(!add || add.length == 0)
              {
                throw new Error("sub_field_add missing in request!");
              }
              else
              {
                var promisesAdd = [];

                function asyncAddSubFieldAssociation(sub_field_id)
                {
                  return models.post_sub_field_association.findAndCountAll({
                    where: {
                      post_id: post_id,
                      sub_field_id: sub_field_id,
                      association_status: "v"
                    }
                  }, {transaction: t}).then(function(post_sub_field_association){
                    if(post_sub_field_association.count == 0 || post_sub_field_association.count == 1)
                    {
                      // valid data in database
                      if(post_sub_field_association.count == 0)
                      {
                        // valid association does not exist in database

                        // create valid association
                        return models.post_sub_field_association.create({
                          post_id: post_id,
                          sub_field_id: sub_field_id,
                          association_status: "v"
                        }, {transaction: t});
                      }
                      else
                      {
                        // valid association exist in database
                        throw new Error("Valid association already exists in database. post_id: "+post_id+" sub_field_id: "+sub_field_id+" rows: "+post_sub_field_association.rows);
                      }
                    }
                    else
                    {
                      // invalid data in database
                      throw new Error("Invalid data found in database. Please rectify dataset ASAP. post_id: "+post_id+" sub_field_id: "+sub_field_id+" rows: "+post_sub_field_association.rows);
                    }
                  });
                }

                _.forEach(add, function(value) {
                  // console.log(value);
                  // console.log(addStatusArray);
                  promisesAdd.push(asyncAddSubFieldAssociation(value));
                });

                return Promise.all(promisesAdd);
              }
            });
          });

        }).then(function (result) {
          // Transaction has been committed
          // result is whatever the result of the promise chain returned to the transaction callback
          res.json({"state": "success",
          "description_slug": "success-post-create",
          "description": "Post successfully created."});
        }).catch(function (err) {
          // Transaction has been rolled back
          // err is whatever rejected the promise chain returned to the transaction callback

          console.log(err);

          res.status(500).json({
            "state": "failure",
            "description_slug": "failure-post-create",
            "description": "Post could not be created."
          });
        });
      }
    }
    else
    {
      // log error to the console
      console.log(err);

      // error occurred
      res.json({
        "state": "failure",
        "description-slug": "error-jwt-verification",
        "description": "Error occurred during verification of jwt token. Verify token used or obtain new token from Authentication API."
      });
    }
  });
});

module.exports = router;
