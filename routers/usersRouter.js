var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res){
  User.find({}, function(err, dbUsers){
    res.json({ users: dbUsers })
  })
})

router.post('/', function(req, res){
  var newUser = new User(req.body.user)
  newUser.save('/', function(err, dbUser){
    console.log('dbUser: ', dbUser);
    res.json(dbUser)
  })
})


router.post('/authenticate', function(req, res){
  User.findOne({username: req.body.username}, function(err, dbUser){
    console.log('username: ', req.body.username);
    if(dbUser){
      dbUser.authenticate(req.body.password, function(err, isMatch){
        console.log('password: ', req.body.password);
        if(isMatch){
          dbUser.setToken(err, function(){
            res.json({description: "success!!", token: dbUser.token})
          })
        }
      })
    } else {
      res.json({ description: "failed login..."})
    }
  })
})

router.get('/authenticate', function(req, res){
  User.find({}, function(err, dbUser){
    res.json({users: dbUser})
  })
})

// router.delete('/authenticate', function(req ,res){
//   User.findOneAndRemove({token: $scope.cookies}, function(err, dbUser){
//     console.log('logging out?');
//   })
// })

module.exports = router;
