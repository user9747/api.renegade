var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({"name":"Renegade API", "type":"Private"});
});

router.use('/authentication', require('./authentication'));

module.exports = router;
