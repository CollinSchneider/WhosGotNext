var express = require('express');
var router = express.Router();
var Game = require('../models/game');

router.get('/', function(req, res){
  if(req.query.court_id){
    Game.find({court_id: req.query.court_id}, function(err, dbGames){
      res.json({ games: dbGames})
    })
  } else if(req.query.date){
    Game.find({date: req.query.date}, function(err, dbGames){
      res.json({ games: dbGames })
    })
  } else if(req.query.created_by){
    Game.find({created_by: req.query.created_by}, function(err, dbGames){
      res.json({ games: dbGames })
    })
  } else {
    Game.find({}, function(err, dbGames){
      res.json({ games: dbGames })
    })
  }
})

router.get('/:id', function(req, res){
  var gameId = req.params.id;
  Game.findById(gameId, function(err, dbGame){
    res.json( dbGame )
  })
})

router.post('/', function(req, res){
  var newGame = new Game(req.body.game);
  console.log('new gameeeee: ', newGame);
  newGame.save('/', function(err, dbGame){
    if(err) {
      console.log("Bad Posttttt")
    } else {
      res.json(dbGame)
      console.log('dbGame: ', dbGame);
    }
  })
})

router.put('/:id', function(req, res){
  var gameId = req.params.id;
  Game.findByIdAndUpdate(gameId, req.body, function(err, dbGame){
    console.log('dbGame: ', dbGame);
    res.json(dbGame)
  })
})

module.exports = router;
