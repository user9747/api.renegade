var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({"status":"functional"});
});

router.use('/login', require('./login'));
router.use('/signup', require('./signup'));

module.exports = router;
