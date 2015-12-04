'use strict';

var host = 'http://localhost:3000';

var app = angular.module('flapperNews', ['ui.router',]);

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
			controller: 'PostsCtrl'
		});

		$urlRouterProvider.otherwise('home');
	}]);

app.factory('postFactory', ['$http', function($http){
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
		return $http.post(host+'/posts', post).success(function(data){
			o.posts.push(data);
		});
	};

	o.upvote = function(post) {
		return $http.put(host+'/posts/' + post._id + '/upvote')
		.success(function(data){
			post.upvotes += 1;
		});
	};

	o.addComment = function(id, comment) {
		return $http.post(host+'/posts/' + id + '/comments', comment);
	};

	o.upvoteComment = function(post, comment) {
		return $http.put(host+'/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
		.success(function(data){
			comment.upvotes += 1;
		});
	};

	return o;
}]);

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

		$scope.incrementUpvotes = function(post) {
			postFactory.upvote(post);
		};

	}]);

app.controller('PostsCtrl', [
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

		$scope.incrementUpvotes = function(comment){
			postFactory.upvoteComment(post, comment);
		};
	}]);



