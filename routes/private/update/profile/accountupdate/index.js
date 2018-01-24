var express = require("express");
var router = express.Router();

var jwt = require("jsonwebtoken");
var bearerToken = require("express-bearer-token");

var bcrypt = require("bcryptjs");

var JWTsecret = require("../../../../../config/config.js").JWTsecret;
var JWTaudience = require("../../../../../config/config.js").JWTaudience;
var JWTissuer = require("../../../../../config/config.js").JWTissuer;

var models = require("../../../../../models");

router.get("/", function(req, res) {
  res.json({ state: "functional" });
});

router.post("/", bearerToken(), function(req, res) {
  jwt.verify(req.token,JWTsecret,{ audience: JWTaudience, issuer: JWTissuer },function(err, decoded) {
      if (!err) {
        var content_type = req.headers["content-type"];
        if (!content_type || content_type.indexOf("application/json") !== 0) {
          res.send(400);
        } else {
          var userID = decoded.id;
          models.users.findOne({
              where: { id: userID },
              attributes: ['id','first_name', 'second_name','email']
            }).then(function(user) {
                if (user != null) {
                  user.first_name = req.body.first_name;
                  user.second_name = req.body.second_name;
                  user.save().then(function() {
                      res.json({
                        state: "success",
                        description_slug: "Updation success",
                        description:
                          "User details succesfully updated"
                      });
                    }).catch(function(err) {
                      res.json({
                        state: "failure",
                        description_slug: "Updation failure",
                        description:"Updation failure.Please review the details",
                        error:err
                    });
                    });
                }
               else{
                res.json({
                    state: "failure",
                    description_slug: "User not found",
                    description: "The user with the given id was not found",
                  });
               } 
            }).catch(function(err) {
              res.json({
                state: "failure",
                description_slug: "User not found",
                description: "The user with the given id was not found",
              });
            });
        }
      } else {
        res.json({
          state: "failure",
          description_slug: "jwt verification error",
          description:
            "Error occured during verification of jwt token.Verify token used or obtain new token from Authentication API."
        });
      }
    }
  );
});
module.exports = router;
