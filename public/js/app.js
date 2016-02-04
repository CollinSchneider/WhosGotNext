console.log('loaded');

var app = angular.module('WhosGotNext', ['ngCookies']);


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
      $scope.checkForUser();
    })
  }

  $scope.checkForUser = function(){
    $scope.cookies = $cookies.get('token');
    if($scope.cookies){
      $scope.loggedIn = true;
    } else {
      $scope.loggedIn = false;
    }
  }

  $scope.logout = function(){
    $cookies.remove('token');
    console.log('logging out..?');
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

  $scope.getGames = function(){
    $http.get('/api/games').then(function(response){
      $scope.games = response.data.games;
    })
  }

  $scope.createGame = function(courtId){
    $scope.newGame.court_id = courtId;
    $http.post('/api/games', {game: $scope.newGame}).then(function(response){
      var game = response.data;
    })
    $scope.getGames();
  }
  $scope.getGames();
}])
