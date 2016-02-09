
var app = angular.module('WhosGotNext', ['ngCookies', 'ngRoute']);

app.config(['$routeProvider', function($routerProvider){
  $routerProvider.when('/', {
    templateUrl: './views/templates/createGame.ejs',
    controller: 'GamesController'
  }).when('/today', {
    templateUrl: './views/templates/upcoming.ejs',
    controller: 'TodaysGamesController'
  }).when('/games', {
    templateUrl: './views/templates/games.ejs',
    controller: 'GamesController'
  }).when('/courts', {
    templateUrl: './views/templates/courts.ejs',
    controller: 'CourtsController'
  }).when('/courts/:id', {
    templateUrl: './views/templates/court.ejs',
    controller: 'CourtDetailsController'
  }).when('/yourgames', {
    templateUrl: './views/templates/yourGames.ejs',
    controller: 'GamesController'
  }).otherwise({
    redirectTo: '/'
  })
}])


app.controller('UsersController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies){

  $scope.createUser = function(){
    $http.post('/api/users', {user: $scope.newUser}).then(function(response){
      $scope.newUser = {};
    })
  }

  $scope.loginUser = function(){
    $http.post('/api/users/authenticate', {username: $scope.user.username, password: $scope.user.password}).then(function(response){
      $scope.user = response.data;
      $cookies.put('token', $scope.user.token);
      $cookies.put('user-id', $scope.user.userId);
      $cookies.put('skill_level', $scope.user.skill_level);
      $scope.checkForUser();
    })
  }

  $scope.checkForUser = function(){
    $scope.cookies = $cookies.get('token');
    if($scope.cookies){
      $scope.loggedIn = true;
      $scope.loggedOut = false;
    } else {
      $scope.loggedIn = false;
      $scope.loggedOut = true;
    }
  }

  $scope.logout = function(){
    $cookies.remove('token');
    $cookies.remove('user-id');
    $scope.checkForUser();
  }

  $scope.checkForUser();
}])


/////////////////////////////////

app.controller('CourtsController', ['$scope', '$http', function($scope, $http){

  $scope.getCourts = function(){
    $http.get('/api/courts').then(function(response){
      $scope.courts = response.data.courts

      this.zoom = 11;
      this.currentLatLng = new google.maps.LatLng( 40.7833, -73.9667 );
      this.mapEl = document.querySelector('#map');

      var myMap = {};

      this.map = new google.maps.Map( this.mapEl, {
          center: this.currentLatLng,
          zoom: this.zoom,
          mapTypeId: google.maps.MapTypeId.DROP
      })

      for (var i = 0; i < $scope.courts.length; i++) {
        var court = $scope.courts[i];
        this.courtLatLng = new google.maps.LatLng( court.latitude, court.longitude );
        var contentString = '<h1>'+ court.name +'</h1>'

        this.infoWindow = new google.maps.InfoWindow({
          content: contentString
        })

        this.marker = new google.maps.Marker({
          position: this.courtLatLng,
          map: this.map,
          title: court.name,
          // icon: '../images/noun_300626_cc.png',
          // size: new google.maps.Size(3, 4),
          animation: google.maps.Animation.DROP
        })

        this.marker.addListener('click', function(){
          this.infoWindow.open(this.map, marker);
        })
      }

    })
  }

  $scope.getCourts();
}])

app.controller('CourtDetailsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

  $http.get('/api/courts/' + $routeParams.id).then(function(response){
    $scope.court = response.data;
    $scope.courtGames = $scope.court.games;
    $http.get('/api/games?court_id=' + $scope.court._id).then(function(response){
      $scope.courtsGames = response.data.games;
      // console.log('court games: ', $scope.courtsGames);
    })
    // for (var i = 0; i < $scope.court.games.length; i++) {
    //   $scope.courtGame = $scope.court.games[i]
    // }
  })
}])


////////////////////////////////

app.controller('GamesController', ['$scope', '$http', '$cookies', '$timeout', '$window',  function($scope, $http, $cookies, $timeout, $window){

  $scope.newGame = {
    date: null,
    time: null,
    court_id: null,
    court_name: null,
    longitude: null,
    latitude: null,
    location: null,
    created_by: null,
    skill_level: null,
    players: []
  }

  $scope.masterGame = angular.copy($scope.newGame);


  $scope.getGames = function(){
    $http.get('/api/games').then(function(response){
      $scope.allYourGames = [];
      $scope.games = response.data.games;
      $scope.getYourGames($cookies.get('user-id'));
      // console.log('yourGames: ', $scope.yourGames);
      for (var i = 0; i < $scope.games.length; i++) {
        var game = $scope.games[i];
        // console.log('game: ', game );
        if($scope.yourGames.indexOf(game._id) != -1){
          $scope.allYourGames.push(game);
          // console.log($scope.allYourGames);
        }
      }
    })
  }

  $scope.getYourGames = function(userId) {
    $http.get('/api/users/' + $cookies.get('user-id')).then(function(response){
      $scope.yourGames = response.data.user.games;
    })
  }


  $scope.todaysGames = function(){
    $http.get('/api/games?date=' + $scope.date).then(function(response){
      $window.location.href = "#/upcoming";
    })
  }

  $scope.getCourt = function(courtId){
    $http.get('/api/courts/' + courtId).then(function(response){
      $scope.court = response.data;
    })
  }

  $scope.getGame = function(gameId){
    $http.get('/api/games/' + gameId).then(function(response){
      var game = response.data.game;
      var players = game.players;
      var userId = $cookies.get('user-id');
      players.push(userId);
    })
  }

  $scope.getPlayersArray = function(gameId){
    $http.get('/api/games/' + gameId).then(function(response){
      var game = response.data.game;
      var players = game.players;
      var userId = $cookies.get('user-id');
      players.push(userId);
      return players;
    });
  };

  $scope.joinGame = function(gameId){
    // console.log('game id: ', gameId);
    $http.get('/api/games/' + gameId).then(function(response){
      // console.log(response);
      var game = response.data;
      var players = game.players;
      var userId = $cookies.get('user-id');
      // var game_skill_level = game.skill_level.to_i;
      // console.log('game skill: ', game_skill_level);
      // var user_skill_level = $cookies.get('skill_level').to_i;
      // console.log('user skill: ', user_skill_level);
      // var skill_level = skill_level + user_skill_level;
      // console.log(players.indexOf(userId));
      if(players.indexOf(userId) === -1){
        players.push(userId);
        // console.log('game players: ', players);
        $http.put('/api/games/' + gameId, { players: players, skill_level: 666 }).then(function(response){
          console.log('after put request: ', response);
        })
      }
    })
  }

  // $scope.leaveGame = function(gameId){
  //   $http.get('/api/games/' + gameId).then(function(response){
  //     var games = response.data.games;
  //     for (var i = 0; i < games.length; i++) {
  //       var game = games[i];
  //       var players = game.players;
  //       for (var j = 0; j < players.length; j++) {
  //         var player = players[j];
  //         console.log(player);
  //         console.log($cookies.get('user-id'));
  //         if(player === $cookies.get('user-id')){
  //           players.splice(j, 1);
  //           console.log('players: ', players);
  //         }
  //       }
  //     }
  //     $scope.getGames();
  //   })
  // }
  //
  // $scope.removeGameFromUser = function(){
  //   $http.get('')
  // }

  $scope.addGameToUser = function(gameId){
    // console.log('game Id: ', gameId);
    $http.get('/api/users/' + $cookies.get('user-id')).then(function(response){
      var user = response.data.user;
      var games = user.games;
      if(games.indexOf(gameId) === -1 ){
        games.push(gameId);
        $http.put('/api/users/' + $cookies.get('user-id'), { games: games });
      } else {
        alert('You are already attending this game!');
        $scope.alreadyPlaying = true;
      }
    })
  }

  $scope.getCourtsGames = function(courtId){
    $http.get('/api/games?court_id=' +courtId).then(function(response){
      $window.location.href = '#/courts/' +courtId;
      var games = response.data.games;
      $scope.courtsGames = games;
    })
  }

  $scope.createGame = function(){
    $http.get('/api/courts/' + $scope.newGame.court_id).then(function(response){
      var court = response.data;
      $scope.newGame.longitude = court.longitude;
      $scope.newGame.latitude = court.latitude;
      $scope.newGame.location = court.location;
      $scope.newGame.court_name = court.name;
      $scope.newGame.players = $cookies.get('user-id');
      $scope.newGame.created_by = $cookies.get('user-id');
      $scope.newGame.date = $scope.newGame.date;
      $scope.newGame.skill_level = $cookies.get('skill_level');
      console.log('scope newgame: ', $scope.newGame);
      $http.post('/api/games', {game: $scope.newGame}).then(function(response){
        $scope.getGames();
        var game = response.data;
        $scope.newGame = $scope.masterGame;
        $scope.addGameToUser(game._id);
      })
    });
  }

  $scope.getDate = function(){
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    $scope.todaysDate = date.toISOString();
    // console.log('todays date: ', $scope.todaysDate);
  }

  $scope.getDate();

  $scope.getYourGames();
  $scope.getGames();
}])

//////////////////////////////////////////

app.controller('TodaysGamesController', ['$scope', '$http', function($scope, $http){

  $http.get('/api/games?date=' + $scope.todaysDate).then(function(response){
    $scope.todaysGames = response.data.games;
    for (var i = 0; i < $scope.todaysGames.length; i++) {
      console.log('game today: ', $scope.todaysGames[i]);
    }
  })
}])
