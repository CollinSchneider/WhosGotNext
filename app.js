var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var crypto = require('crypto');


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json() );

app.set('view-engine', 'ejs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/whos_got_next');

app.use(express.static('./public'));

var morgan = require('morgan');
app.use(morgan('dev'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/', function(req, res){
  res.render(__dirname + '/public/views/index.ejs')
})

var gamesRouter = require('./routers/gamesRouter');
app.use('/api/games', gamesRouter);

var usersRouter = require('./routers/usersRouter');
app.use('/api/users', usersRouter);

var courtsRouter = require('./routers/courtsRouter');
app.use('/api/courts', courtsRouter);

var port = 'mongodb://heroku_m6qsgdw7:gapbeiegbpvmh24at9fdj2iek7@ds011218.mongolab.com:11218/heroku_m6qsgdw7' || 8080;
app.listen(port, function(){
  console.log('listening on port ', port);
})
