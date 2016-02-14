
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
      $scope.signedup = true;
      $scope.newUser = {};
    })
  }

  $scope.loginUser = function(){
    $http.post('/api/users/authenticate', {username: $scope.user.username, password: $scope.user.password}).then(function(response){
      $scope.user = response.data;
      $cookies.put('token', $scope.user.token);
      $cookies.put('user-id', $scope.user.userId);
      $cookies.put('skill_level', $scope.user.skill_level);
      $scope.dropped = false;
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
    $scope.dropped = false;
    $cookies.remove('token');
    $cookies.remove('user-id');
    $cookies.remove('skill_level');
    $scope.checkForUser();
  }

  $scope.checkForUser();
}])


/////////////////////////////////

app.controller('CourtsController', ['$scope', '$http', function($scope, $http){

  $scope.getCourts = function(){
    $http.get('/api/courts').then(function(response){
      $scope.courts = response.data.courts
      console.log('courts: ', $scope.courts);

      this.zoom = 12;
      this.currentLatLng = new google.maps.LatLng( 40.7833, -73.9667 );
      this.mapEl = document.querySelector('#map');

      var myMap = {};

      var map = new google.maps.Map( this.mapEl, {
          center: this.currentLatLng,
          zoom: this.zoom,
          mapTypeId: google.maps.MapTypeId.DROP
      })

      var markers = [];
      for (var i = 0; i < $scope.courts.length; i++) {
        var court = $scope.courts[i];
        this.courtLatLng = new google.maps.LatLng( court.lat, court.lon );

        var icon = {
          url: "../images/basketball.png",
          scaledSize: new google.maps.Size(40, 40)
        }

        this.marker = new google.maps.Marker({
          position: this.courtLatLng,
          map: map,
          title: court.Name,
          court_id: court._id,
          icon: icon,
          animation: google.maps.Animation.DROP
        });

        markers.push(marker);

        this.marker.addListener('click', function(){
          var courtId = this.court_id;
          window.location.href = "#/courts/" + courtId;
        })
      }
      var markerCluster = new MarkerClusterer(map, markers);

    })
  }

  $scope.getCourts();
}])

app.controller('CourtDetailsController', ['$scope', '$http', '$routeParams', '$cookies', function($scope, $http, $routeParams, $cookies){

  $scope.createGameOnCourt = function(courtId){
    $http.get('/api/courts/' + courtId).then(function(response){
      var court = response.data;
      $scope.newGame.court_id = courtId;
      $scope.newGame.longitude = court.lon;
      $scope.newGame.latitude = court.lat;
      $scope.newGame.location = court.Location;
      $scope.newGame.court_name = court.Name;
      $scope.newGame.players = $cookies.get('user-id');
      $scope.newGame.created_by = $cookies.get('user-id');
      $scope.newGame.date = $scope.newGame.date;
      $scope.newGame.skill_level = $cookies.get('skill_level');
      console.log('scope newgame: ', $scope.newGame);
      $http.post('/api/games', {game: $scope.newGame}).then(function(response){
        $scope.getGames();
        getCourtsGames();
        $scope.makeGame = false;
        var game = response.data;
        $scope.newGame = $scope.masterGame;
        $scope.addGameToUser(game._id);
      })
    });
  }

  getCourtsGames = function(){
    $http.get('/api/courts/' + $routeParams.id).then(function(response){
      $scope.court = response.data;
      $scope.courtGames = $scope.court.games;
      $http.get('/api/games?court_id=' + $scope.court._id).then(function(response){
        $scope.courtsGames = response.data.games;
      })
    })
  }

  getCourtsGames()

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
      for (var i = 0; i < $scope.games.length; i++) {
        var game = $scope.games[i];
        if($scope.yourGames.indexOf(game._id) != -1){
          $scope.allYourGames.push(game);
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

  $scope.joinGame = function(gameId){
    $http.get('/api/games/' + gameId).then(function(response){
      var game = response.data;
      var players = game.players;
      var userId = $cookies.get('user-id');
      var gameSkill = parseInt(game.skill_level);
      var userSkill = parseInt($cookies.get('skill_level'));
      var skillLevel = gameSkill + userSkill;
      if(players.indexOf(userId) === -1){
        players.push(userId);
        $http.put('/api/games/' + gameId, { players: players, skill_level: skillLevel }).then(function(response){
          alert("Joined Game!");
          document.getElementById('join-game-button').className = "btn btn-primary disabled";
          $scope.getGames();
          console.log('after put request: ', response);
        })
      }
    })
  }

  $scope.addGameToUser = function(gameId){
    $http.get('/api/users/' + $cookies.get('user-id')).then(function(response){
      var user = response.data.user;
      var games = user.games;
      if(games.indexOf(gameId) === -1 ){
        games.push(gameId);
        $http.put('/api/users/' + $cookies.get('user-id'), { games: games });
      } else {
        alert('You are already attending this game!');
        document.getElementById('join-game-button').className = "btn btn-primary disabled";
        $scope.alreadyPlaying = true;
      }
    })
  }

  $scope.createGame = function(){
    $http.get('/api/courts/' + $scope.newGame.court_id).then(function(response){
      var court = response.data;
      $scope.newGame.longitude = court.lon;
      $scope.newGame.latitude = court.lat;
      $scope.newGame.location = court.Location;
      $scope.newGame.court_name = court.Name;
      $scope.newGame.players = $cookies.get('user-id');
      $scope.newGame.created_by = $cookies.get('user-id');
      $scope.newGame.date = $scope.newGame.date;
      $scope.newGame.skill_level = $cookies.get('skill_level');
      console.log('scope newgame: ', $scope.newGame);
      $http.post('/api/games', {game: $scope.newGame}).then(function(response){
        $scope.getGames();
        var game = response.data;
        $scope.gameCreated = true;
        $timeout(function(){
          $scope.gameCreated = false
        }, 2000);
        $scope.newGame = $scope.masterGame;
        $scope.addGameToUser(game._id);
      })
    });
  }

  $scope.getDate = function(){
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    $scope.todaysDate = date.toISOString();
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
