var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({"status": "functional"});
});

router.use('/fields', require('./fields'));
router.use('/ui', require('./ui'));

module.exports = router;
