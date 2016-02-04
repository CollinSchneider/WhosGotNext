var mongoose = require('mongoose');
var User = require('./models/user');
var Game = require('./models/game');
var Court = require('./models/court');

mongoose.connect('mongodb://localhost/whos_got_next', function(err){
  if(err){
    console.log('connection error');
  } else {
    console.log('successfully connected');
  }
});

var courts = [
  {
    name: 'another court',
    location: '5505 Woodisde Ave, Woodside, NY',
    longitude: '-73.000',
    latitude: '40.234'
  }
];


courts.forEach((court) => {
  var newCourt = new Court(court);
  newCourt.save((error) => {
    if(error) {
      console.log(error);
    } else {
      console.log('added the court');
    }
  })
});
