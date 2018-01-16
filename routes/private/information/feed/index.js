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
        models.post_data.findAll({
          offset: offset,
          limit: required_number,
          order: [['updatedAt', 'DESC']]
        }).then(function(result){
          if(result == null || result.length == 0)
          {
            // no result
            res.json({"state": "success",
            "description_slug": "success-feeds-empty",
            "description": "Feeds empty for the current request."});
          }
          else
          {
            // result = result[0].data;

            // return result;
            res.json({ "state": "success",
            "description_slug": "success-feeds",
            "description": "Feeds obtained successfully.",
            "data": result });
          }
        }).catch(function (err) {
          console.log(err);
          // handle error;
          res.status(500).json({ "success": "false" });
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
