var mongoose = require('mongoose');

var GameSchema = mongoose.Schema({
  date: { type: String },
  time: { type: String },
  court_id: { type: String },
  longitude: { type: String },
  latitude: { type: String }
  // players: [
  //   player1 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player2 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player3 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player4 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player5 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player6 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player7 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player8 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player9 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player10 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player11 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   },
  //   player12 {
  //     username: { type: String },
  //     skill_level: { type: Number }
  //   }
  // ]
})

var Game = mongoose.model('Game', GameSchema);
module.exports = Game;
