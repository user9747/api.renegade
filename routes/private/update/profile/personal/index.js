import { read } from 'fs';
import { race } from '../../../../../../../../../.cache/typescript/2.6/node_modules/@types/bluebird';

var express = require('express');
var router = express.Router();

var jwt = require('jwtwebtoken');
var bearerToken = require('express-bearer-token');

var _ = require('lodash');
var Promise = require('bluebird');

var JWTsecret = require('../../../../../config/config.json').JWTsecret;
var JWTaudience = require('../../../../../config/config.json').JWTaudience;
var JWTissuer = require('../../../../../config/config.json').JWTissuer;

var models = require('../../../../../models');

