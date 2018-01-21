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

router.get('/',function(req,res,next){
    res.json({'status':'functional'});
});

router.post('/', function (req, res, next) {
    jwt.verify(req.token, JWTsecret, { audience: JWTaudience, issuer: JWTissuer }, function (err, decoded) {
        if (err == null) {
            
            return res.json({'success':'false'});


        }
        else{
            return res.json({'success':'true'});
        }
    });


});

module.exports = router;