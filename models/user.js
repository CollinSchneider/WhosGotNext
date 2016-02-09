var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var UserSchema = mongoose.Schema({
  username: { type: String },
  password: { type: String },
  token: { type: String },
  games: [],
  skill_level: { type: Number }
})

UserSchema.pre('save', function(next){
  console.log("presaving...");
  if(this.isModified('password')){
    this.password = bcrypt.hashSync(this.password, 10)
  }
  return next();
})

UserSchema.methods.setToken = function(err, done){
  console.log('Setting token...');
  var scope = this;
  crypto.randomBytes(256, function(err, buf){
    if(err) return done(err);
    scope.token = buf;
    scope.save(function(err){
      if(err) return done(err);
      done();
    })
  })
}

UserSchema.methods.authenticate = function(passwordTry, callback){
  console.log('authenticating...');
  bcrypt.compare(passwordTry, this.password, function(err, isMatch){
    if(err) return callback(err);
    callback(null, isMatch)
  })
}

var User = mongoose.model('User', UserSchema);
module.exports = User;
