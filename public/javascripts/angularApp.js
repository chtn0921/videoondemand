var app = angular.module('flapperNews', ['ui.router', 'ngFileUpload', 'ui.bootstrap.datetimepicker']);
// var app = angular.module('flapperNews', ['ui.router', 'ui.bootstrap.datetimepicker']);

app.config(['$stateProvider', '$urlRouterProvider','$qProvider','$locationProvider',
function($stateProvider, $urlRouterProvider, $qProvider,$locationProvider) {

	$stateProvider.state('home', {
		url : '/home',
		templateUrl : '/javascripts/template/home.html',
		controller : 'MainCtrl',
		resolve : {
			promiseObj : ['posts',
			function(posts) {
				return posts.getAll();
			}]
		}
	}).state('posts', {
		url : '/posts/:id',
		templateUrl : '/posts.html',
		controller : 'PostsCtrl',
		resolve : {
			post : ['$stateParams', 'posts',
			function($stateParams, posts) {
				return posts.get($stateParams.id);
			}]
		}
	}).state('login', {
		url : '/login',
		templateUrl : '/javascripts/template/login.html',
		controller : 'AuthCtrl',
		onEnter : ['$state', 'auth',
		function($state, auth) {
			if (auth.isLoggedIn()) {
				$state.go('home');
			}
		}]
	}).state('register', {
		url : '/register',
		templateUrl : '/register.html',
		controller : 'AuthCtrl',
		onEnter : ['$state', 'auth',
		function($state, auth) {
			if (auth.isLoggedIn()) {
				$state.go('home');
			}
		}]

	});
	$urlRouterProvider.otherwise('home');
	//for setting url without #
	$locationProvider.html5Mode(true);
	$qProvider.errorOnUnhandledRejections(false);
}]);