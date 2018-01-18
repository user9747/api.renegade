var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var JWTsecret = require('../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../config/config.js').JWTissuer;

var models = require('../../../../models');

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

        // save variables

        var post_id = req.body.post_id;
        var post_content = req.body.post_content;
        var post_text = req.body.post_text;
        var post_image = req.body.post_image;

        function proceedUpdatePost()
        {
          models.post_data.create({
            post_id: post_id,
            author_id: userID,
            post_content: post_content,
            post_element_status: "v",
            post_text: post_text,
            post_image: post_image
          }).then(function(post_data_element){
            // post successfully updated
            res.json({
              "state": "success",
              "description-slug": "success-update-post",
              "description": "Post successfully updated."
            });
          });
        }

        // check if post exists
        models.post_owner_association.findOne({
          where: {
            id: post_id
          }
        }).then(function(post_owner_association){
          if(post_owner_association == null)
          {
            // post does not exist
            res.json({
              "state": "failure",
              "description-slug": "error-update-post-invalid-post_id",
              "description": "Invalid post_id. Could not complete post update request."
            });
          }
          else
          {
            // post exists

            // check if user is owner
            if(post_owner_association.owner_id == userID)
            {
              // user is owner
              proceedUpdatePost();
            }
            else
            {
              // user is not owner

              // check if user is a collaborator of the post
              models.post_collaborator_association.findOne({
                where: {
                  post_id: post_id,
                  collaborator_id: userID
                }
              }).then(function(post_collaborator_association){
                if(post_collaborator_association == null)
                {
                  // neither a collaborator nor an owner
                  res.json({
                    "state": "failure",
                    "description-slug": "error-update-post-permission",
                    "description": "User does not have permission to update the post. Could not complete post update request."
                  });
                }
                else
                {
                  // user is a collaborator of the post
                  proceedUpdatePost();
                }
              });
            }
          }
        }).catch(function(err){
          // log error to the console
          console.log(err);

          // error occurred
          res.json({
            "state": "failure",
            "description-slug": "error-update-post",
            "description": "Error occurred during update of post."
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

router.use('/like', require('./like'));

module.exports = router;
