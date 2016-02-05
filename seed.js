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
    name: 'Other Court',
    location: '5505 Woodside Ave, Woodside, NY',
    longitude: '-73',
    latitude: '40.2479'
  },
  {
    name: 'Test Court',
    location: '10 E 21st St, New York, NY',
    longitude: '-73.8473',
    latitude: '40.8721'
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
