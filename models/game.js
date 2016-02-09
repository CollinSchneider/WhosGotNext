var mongoose = require('mongoose');

var GameSchema = mongoose.Schema({
  date: { type: String },
  time: { type: String },
  court_name: { type: String },
  court_id: { type: String },
  longitude: { type: String },
  latitude: { type: String },
  location: { type: String },
  created_by: { type: String },
  skill_level: { type: Number },
  players: []
  // players: [ { type: Number, unique: true} ]
  // players: {
  //   player1: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player2: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player3: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player4: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player5: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player6: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player7: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player8: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player9: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player10: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player11: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   },
  //   player12: {
  //     username: { type: String },
  //     user_id: { type: String },
  //     skill_level: { type: Number },
  //     user_id: { type: String }
  //   }
  // }
})

var Game = mongoose.model('Game', GameSchema);
module.exports = Game;
