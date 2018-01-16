var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({"status": "functional"});
});

router.use('/information', require('./information'));
router.use('/update', require('./update'));

module.exports = router;
