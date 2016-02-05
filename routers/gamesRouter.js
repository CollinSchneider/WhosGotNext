var express = require('express');
var router = express.Router();
var Game = require('../models/game');

router.get('/', function(req, res){
  Game.find({}, function(err, dbGames){
    res.json({ games: dbGames })
  })
})

router.get('/:id', function(req, res){
  var gameId = req.params.id;
  Game.findById(gameId, function(err, dbGame){
    res.json({game: dbGame})
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
