var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({"status": "functional"});
});

router.use('/post', require('./post'));

module.exports = router;
