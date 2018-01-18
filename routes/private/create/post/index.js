var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var JWTsecret = require('../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../config/config.js').JWTissuer;

var models = require('../../../../models');

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
        // save userID from decoded data
        var userID = decoded.id;

        return sequelize.transaction(function (t) {

          // chain all your queries here. make sure you return them.
          return models.post_owner_association.create({
            owner_id: userID
          }, {transaction: t}).then(function (association) {
            return models.post_data.create({
              post_id: association.id,
              author_id: userID,
              post_content: req.body.post_content,
              post_status: "v",
              post_text: req.body.post_text,
              post_image: req.body.post_image
            }, {transaction: t});
          });

        }).then(function (result) {
          // Transaction has been committed
          // result is whatever the result of the promise chain returned to the transaction callback
          res.json({"state": "success",
          "description_slug": "success-post-create",
          "description": "Post successfully created."});
        }).catch(function (err) {
          console.log(err);

          // Transaction has been rolled back
          // err is whatever rejected the promise chain returned to the transaction callback
          res.status(500).json({"state": "failure",
          "description_slug": "failure-post-create",
          "description": "Post could not be created."});
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
