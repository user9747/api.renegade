var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var JWTsecret = require('../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../config/config.js').JWTissuer;

var models = require('../../../../models');

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

        var post_id = req.body.post_id;

        if(!post_id)
        {
          res.status(400).json({
            "state": "failure",
            "description-slug": "error-delete-post-bad-request-post_id-missing",
            "description": "post_id missing in request. Could not complete delete post request."
          });
        }
        else
        {
          models.post_owner_association.findOne({
            where: {
              id: post_id,
              owner_id: userID
            }
          }).then(function(association){
            if(association == null)
            {
              // association does not exist
              res.status(400).json({
                "state": "failure",
                "description-slug": "error-delete-post-invalid-request",
                "description": "Invalid request. Check if post exist or user has access to delete the post. Could not complete delete post request."
              });
            }
            else
            {
              // delete association
              association.destroy().then(function(){
                // association deleted
                res.json({
                  "state": "success",
                  "description-slug": "success-delete-post",
                  "description": "Request to delete post completed successfully."
                });
              }).catch(function(err){
                //handle error
                console.log(err);

                res.status(500).json({
                  "state": "failure",
                  "description-slug": "error-delete-post-unknown",
                  "description": "Could not complete delete post request."
                });
              });
            }
          }).catch(function(err){
            //handle error
            console.log(err);

            res.status(500).json({
              "state": "failure",
              "description-slug": "error-delete-post-unknown",
              "description": "Could not complete delete post request."
            });
          });
        }
      }
    }
    else
    {
      // log error to the console
      console.log(err);

      // error occurred
      res.status(401).json({
        "state": "failure",
        "description-slug": "error-jwt-verification",
        "description": "Error occurred during verification of jwt token. Verify token used or obtain new token from Authentication API."
      });
    }
  });
});

module.exports = router;
