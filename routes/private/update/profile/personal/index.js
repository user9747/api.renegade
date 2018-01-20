var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

var _ = require('lodash');
var Promise = require("bluebird");

var JWTsecret = require('../../../../config/config.js').JWTsecret;
var JWTaudience = require('../../../../config/config.js').JWTaudience;
var JWTissuer = require('../../../../config/config.js').JWTissuer;

var models = require('../../../../models');

var sequelize = models.sequelize;