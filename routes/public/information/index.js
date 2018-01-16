var express = require('express');
var router = express.Router();

var models = require('../../../models');

router.get('/', function(req, res, next) {
  res.json({"status":"functional"});
});

router.get('/fields', function(req, res, next) {
  models.fields.findAll({attributes: ['id', 'field_name']}).then(function(fields) {
    // fields will be an array of all fields instances
    if(fields.length == 0)
    {
      // array empty
      res.json({"state": "failure",
      "description-slug": "error-fields-empty",
      "description": "Fields empty."}
    );
  }
  else
  {
    res.json(fields);
  }
})
});


router.get('/occupations', function(req, res, next) {
  models.occupations.findAll({attributes: ['id', 'occupation']}).then(function(occupations) {
    // fields will be an array of all fields instances
    if(occupations.length == 0)
    {
      // array empty
      res.json({"state": "failure",
      "description-slug": "error-occupations-empty",
      "description": "occupations empty."}
    );
  }
  else
  {
    res.json(occupations);
  }
})
});

module.exports = router;
