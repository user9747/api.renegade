var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({"status":"functional"});
});

router.use('/renegade', require('./renegade'));

module.exports = router;
