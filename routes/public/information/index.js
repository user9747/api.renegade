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

router.get('/field/:field_id/sub_fields', function(req, res, next) {

  field_id = parseInt(req.params.field_id);

  if(!field_id)
  {
    // array empty
    res.status(400).json({
      "state": "failure",
      "description-slug": "error-field_id-parameter-invalid-url",
      "description": "field_id parameter missing or invalid in url. check url."
    });
  }
  else
  {
    // check if valid field_id
    models.fields.findOne({
      where: { id: field_id }
    }).then(function(field){
      if(field == null)
      {
        // no field exist with the give field_id
        res.json({
          "state": "failure",
          "description-slug": "error-field_id-invalid",
          "description": "Requested field is not available in the system."
        });
      }
      else
      {
        models.sub_fields.findAll({
          include: [{ model: models.fields, where: { id: field_id }, attributes: []}],
          attributes: ['id', 'sub_field_name']
        }).then(function(sub_fields) {
          // fields will be an array of all fields instances
          if(sub_fields.length == 0)
          {
            // array empty
            res.json({
              "state": "failure",
              "description-slug": "error-sub_fields-empty",
              "description": "sub_fields empty for field_id: "+field_id
            });
          }
          else
          {
            res.json(sub_fields);
          }
        }).catch(function(err){
          // array empty
          res.status(500).json({
            "state": "failure",
            "description-slug": "error-field-sub_fields",
            "description": "Unable to complete request."
          });
        });
      }
    }).catch(function(err){
      // array empty
      res.status(500).json({
        "state": "failure",
        "description-slug": "error-field-sub_fields",
        "description": "Unable to complete request."
      });
    });
  }
});

module.exports = router;
