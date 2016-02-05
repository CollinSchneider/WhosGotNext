console.log('loaded');

var app = angular.module('WhosGotNext', ['ngCookies', 'ngRoute']);

// app.config(['$routeProvider', function($routerProvider){
//   $routerProvider.when('/', {
//     templateUrl: './views/templates/games.ejs',
//     controller: 'GamesController'
//   }).otherwise({
//     redirectTo: '/'
//   })
// }])


app.controller('UsersController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies){

  $scope.createUser = function(){
    $http.post('/api/users', {user: $scope.newUser}).then(function(response){
      $scope.user = response.data;
    })
    $scope.getUsers();
  }

  $scope.loginUser = function(){
    console.log('login click');
    $http.post('/api/users/authenticate', {username: $scope.user.username, password: $scope.user.password}).then(function(response){
      $scope.user = response.data;
      $cookies.put('token', $scope.user.token);
      console.log($scope.user);
      $cookies.put('user-id', $scope.user.userId);
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


  $scope.getUsers = function(){
    $http.get('/api/users').then(function(response){
      $scope.users = response.data.users;
    })
  }
  $scope.getUsers();
  $scope.checkForUser();
}])


/////////////////////////////////

app.controller('CourtsController', ['$scope', '$http', function($scope, $http){
  $scope.getCourts = function(){
    $http.get('/api/courts').then(function(response){
      $scope.courts = response.data.courts
    })
  }
  $scope.getCourts();
}])


////////////////////////////////

app.controller('GamesController', ['$scope', '$http', function($scope, $http){

  var myMap = {};

  myMap.init = function(){
  this.zoom;
  this.currentLatLng;
  this.mapEl;
  this.map;

  this.zoom = 11;
  this.currentLatLng = new google.maps.LatLng( 40.7833, -73.9667 );
  this.mapEl = document.querySelector('#map');

  this.map = new google.maps.Map( this.mapEl, {
      center: this.currentLatLng,
      zoom: this.zoom,
      mapTypeId: google.maps.MapTypeId.BOUNCE
  })

  // this.marker = new google.maps.Marker({
  //   position: this.currentLatLng,
  //   map: this.map,
  //   title: "Check me out!",
  //   animation: google.maps.Animation.BOUNCE
  // })
}

myMap.init();


  $scope.newGame = {
    date: null,
    time: null,
    court_id: null,
    court_name: null,
    longitude: null,
    latitude: null,
    location: null
  }

  $scope.masterGame = angular.copy($scope.newGame);

  $scope.getGames = function(){
    $http.get('/api/games').then(function(response){
      $scope.games = response.data.games;
    })
  }

  $scope.getCourt = function(courtId){
    $http.get('/api/courts/' + courtId).then(function(response){
      $scope.court = response.data;
    })
  }

  $scope.getGame = function(gameId){
    $http.get('/api/games/' + gameId).then(function(response){
      console.log(response.data.game.players);
    })
  }

  $scope.joinGame = function(gameId){
    $http.patch('/api/games/' + gameId).then(function(response){

    })
  }

  $scope.createGame = function(){
    $http.get('/api/courts/' + $scope.newGame.court_id).then(function(response){
      var court = response.data;
      $scope.newGame.longitude = court.longitude;
      $scope.newGame.latitude = court.latitude;
      $scope.newGame.location = court.location;
      $scope.newGame.court_name = court.name;
      $http.post('/api/games', {game: $scope.newGame}).then(function(response){
        $scope.getGames();
        var game = response.data;
        this.currentLatLng = new google.maps.LatLng( game.latitude, game.longitude )
        // new google.maps.Marker({
        //   position: this.currentLatLng,
        //   map: myMap,
        //   title: "Check me out!",
        //   animation: google.maps.Animation.BOUNCE
        // })
      })
    });
  }
  $scope.getGames();
}])
