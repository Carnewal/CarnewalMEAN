'use strict';

var host = 'http://localhost:3000';

var app = angular.module('flapperNews', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				postPromise: ['postFactory', function(postFactory){
					return postFactory.getAll();
				}]
			}

		})
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl',
			resolve: {
				post: ['$stateParams', 'postFactory', function($stateParams, postFactory) {
					return postFactory.get($stateParams.id);
				}]
			}

		})
		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('home');
				}
			}]
		})
		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('home');
				}
			}]
		});

		$urlRouterProvider.otherwise('home');
	}]);

app.factory('postFactory', ['$http', 'auth', function($http, auth){
	var o = {
		posts: []
	};

	o.get = function(id) {
		return $http.get(host+'/posts/' + id).then(function(res){
			return res.data;
		});
	};

	o.getAll = function() {
		return $http.get(host+'/posts').success(function(data){
			angular.copy(data, o.posts);
		});
	};

o.create = function(post) {
  return $http.post(host + '/posts', post, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
    o.posts.push(data);
  });
};

o.upvote = function(post) {
  return $http.put(host + '/posts/' + post._id + '/upvote', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
    post.upvotes += 1;
  });
};

o.addComment = function(id, comment) {
  return $http.post(host + '/posts/' + id + '/comments', comment, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  });
};

o.upvoteComment = function(post, comment) {
  return $http.put(host + '/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
    comment.upvotes += 1;
  });
};

	return o;
}])
.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {};
	auth.saveToken = function (token){
		$window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function (){
		return $window.localStorage['flapper-news-token'];
	};
	auth.isLoggedIn = function(){
		var token = auth.getToken();

		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.register = function(user){
		return $http.post(host+'/users/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	};
	auth.logIn = function(user){
		return $http.post(host+'/users/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function(){
		$window.localStorage.removeItem('flapper-news-token');
	};

	return auth;
}])

app.controller('MainCtrl', [
	'$scope',
	'postFactory',
	function($scope, postFactory){
		$scope.test = 'Hello world!';

		$scope.posts = postFactory.posts;

		$scope.addPost = function(){
			if($scope.title === '') { return; }
			postFactory.create({
				title: $scope.title,
				link: $scope.link,
			});
			$scope.title = '';
			$scope.link = '';
		};

		$scope.upvote = function(post) {
			postFactory.upvote(post);
		};

	}]).controller('PostsCtrl', [
	'$scope',
	'postFactory',
	'post',
	function($scope, postFactory, post){

		$scope.post = post;

		$scope.addComment = function(){
			if($scope.body === '') { return; }
			postFactory.addComment(post._id, {
				body: $scope.body,
				author: 'user',
			}).success(function(comment) {
				$scope.post.comments.push(comment);
			});
			$scope.body = '';
		};

		$scope.upvote = function(comment){
			postFactory.upvoteComment(post, comment);
		};
	}]).controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
	function($scope, $state, auth){
		$scope.user = {};

		$scope.register = function(){
			auth.register($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('home');
			});
		};

		$scope.logIn = function(){
			auth.logIn($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('home');
			});
		};
	}]).controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);



