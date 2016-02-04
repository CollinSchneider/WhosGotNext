var express = require('express');
var router = express.Router();
var Court = require('../models/court');

router.get('/', function(req, res){
  Court.find({}, function(err, dbCourts){
    res.json({ courts: dbCourts })
  })
})

router.get('/:id', function(req, res){
  Court.find({court: req.body._id}, function(err, dbCourt){
    res.json(dbCourt)
  })
})

module.exports = router;
