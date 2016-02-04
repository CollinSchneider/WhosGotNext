var express = require('express');
var router = express.Router();
var Game = require('../models/game');

router.get('/', function(req, res){
  Game.find({}, function(err, dbGames){
    res.json({ games: dbGames })
  })
})

router.post('/', function(req, res){
  var newGame = new Game(req.body.game);
  console.log(newGame);
  newGame.save('/', function(err, dbGame){
    res.json(dbGame)
  })
})

module.exports = router;
