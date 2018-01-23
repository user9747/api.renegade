var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var bcrypt = require('bcryptjs');

var JWTsecret = require('../../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../../config/config.js').JWTissuer;

var models = require('../../../../../models');

router.get('/', function (req, res, next) {
    res.json({ 'status': 'functional' });

});

router.post('/', bearerToken(), function (req, res, next) {
    jwt.verify(req.token, JWTsecret, { audience: JWTaudience, issuer: JWTissuer }, function (err, decoded) {
        if (!err) {
            var content_type = req.headers['content-type'];
            if (!content_type || content_type.indexOf('application/json') !== 0) {
                return res.send(400);
            }
            else {

                //user id of the logged in user
                var userID = decoded.id;

                models.users.findOne({
                    where: { id: userID },
                    attributes: ['first_name', 'second_name', 'email']
                }).then(function (user) {
                    if (user != null) {
                        res.json({
                            "state": "success",
                            "description_slug": "User data fetched",
                            "description": "The user exist",
                            "data": user
                        });



                    }
                    else {
                        res.json({
                            "state": "failure",
                            "description_slug": "User does not exist",
                            "description": "The entry for the user couldnot be found"

                        });
                    }


                }).catch(function (err) {
                    res.json({
                        "state": "failure",
                        "error": err
                    });

                });



            }
        }
        else {
            res.json({
                "state": "failure",
                "description_slug": "error jwt verification",
                "description": "Error occured during verification of jwt token.Verify token used or obtain new token from Authentication API."

            })



        }

    });


});

module.exports = router;