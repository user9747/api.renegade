var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var JWTsecret = require('../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../config/config.js').JWTissuer;

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

        res.json({"userID": userID,
        "offset": offset,
        "required_number": required_number
      });

      if(offset == null)
      {
        offset = 0;
      }
      
      models.post_data.findAll({
        offset: offset,
        limit: required_number,
        include: [{ model: models.entities, attributes: [`ename`], where: { ename: req.params.entity }}, { model: models.entitySlugs, attributes: [`slugName`], where: { slugName: req.params.slug } }],
        // where: { ename: req.params.entity },
        attributes: ['data']
      }).then(function(result) {
        result = result[0].data;
        res.json({ "value": result });
        // return result;
      }).catch(function (err) {
        // handle error;
        res.json({ "success": "false" });
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
