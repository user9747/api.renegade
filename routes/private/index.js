var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({"status": "functional"});
});

router.use('/create', require('./create'));
router.use('/delete', require('./delete'));
router.use('/information', require('./information'));
router.use('/update', require('./update'));
router.use('/follow', require('./follow'));

module.exports = router;
