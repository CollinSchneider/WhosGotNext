var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res){
  User.find({}, function(err, dbUsers){
    res.json({ users: dbUsers })
  })
})

router.get('/:id', function(req, res){
  var userId = req.params.id
  User.findById(userId, function(err, dbUser){
    res.json({user: dbUser})
  })
})

router.post('/', function(req, res){
  var newUser = new User(req.body.user)
  newUser.save('/', function(err, dbUser){
    console.log('dbUser: ', dbUser);
    res.json(dbUser)
  })
})

router.put('/:id', function(req, res){
  var userId = req.params.id;
  console.log("user Id: ", userId);
  console.log('req: ', req);
  User.findByIdAndUpdate(userId, req.body, function(err, dbUser){
    res.json( dbUser )
  })
})

router.post('/authenticate', function(req, res){
  User.findOne({username: req.body.username}, function(err, dbUser){
    if(dbUser){
      dbUser.authenticate(req.body.password, function(err, isMatch){
        if(isMatch){
          dbUser.setToken(err, function(){
            res.json({description: "success!!", token: dbUser.token, userId: dbUser.id, skill_level: dbUser.skill_level});
            console.log('dbUser: ', dbUser);
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


module.exports = router;
