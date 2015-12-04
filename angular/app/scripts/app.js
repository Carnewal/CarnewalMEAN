'use strict';

var app = angular.module('flapperNews', [
	'ui.router',
	]);

app.factory('posts', [function(){
	var o = {
		posts: []
	};
	return o;
}]);

app.controller('MainCtrl', [
	'$scope',
	'posts',

	function($scope, posts) {
		$scope.test = 'Hello world!';

		$scope.posts = posts.posts; 


		$scope.addPost = function(){
			if(!$scope.title || $scope.title === '') { return; }
			$scope.posts.push({
				title: $scope.title,
				link: $scope.link,
				upvotes: 0
			});
			$scope.title = '';
			$scope.link = '';
		};

		$scope.upvote = function(post) {
			post.upvotes += 1;
		};
		$scope.downvote = function(post) {
			post.upvotes -= 1;
		};

	}
	]);


app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		});

		$urlRouterProvider.otherwise('home');
	}]);

