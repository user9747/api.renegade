var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({"status": "functional"});
});

router.use('/post', require('./post'));
router.use('/accept', require('./accept'));

module.exports = router;
