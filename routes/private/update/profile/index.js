var express = require('express');
var router = express.Router();
var app = express();
router.get('/', function(req, res, next) {
  res.json({"status": "functional"});
});
var person = require('./person');
router.use('/fields', require('./fields'));
router.use('/password', require('./password'));
router.use('/ui', require('./ui'));
router.use('/person',require('./person'));

module.exports = router;
