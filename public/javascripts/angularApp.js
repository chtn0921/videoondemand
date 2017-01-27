var app = angular.module('flapperNews', ['ui.router', 'ngFileUpload', 'ui.bootstrap.datetimepicker']);
// var app = angular.module('flapperNews', ['ui.router', 'ui.bootstrap.datetimepicker']);

app.config(['$stateProvider', '$urlRouterProvider','$qProvider','$locationProvider',
function($stateProvider, $urlRouterProvider, $qProvider,$locationProvider) {

	$stateProvider.state('home', {
		url : '/home',
		templateUrl : '/home.html',
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

/*app.factory('auth', ['$http', '$window',
function($http, $window) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['flapper-news-token'];
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();
		if ( (token != 'undefined') && (token != null) && (token != "")  ) {			
			console.log(" auth.isLoggedIn token : ",token );	
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.register = function(user) {
		return $http.post('/register', user).then(function(data) {
			console.log("data.token saved on register : ",data.data.token);
			auth.saveToken(data.data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post('/login', user).then(function(data) {
			console.log("data.token saved on login : ",data.data.token);
			auth.saveToken(data.data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('flapper-news-token');
	};

	return auth;
}]);
app.factory('posts', ['$http', 'auth',
function($http, auth) {
	var o = {
		posts : []
	};

	o.getAll = function() {
		console.log("callinbg getAll");
		return $http({
	        method : "GET",
	        url : '/posts'
	    }).then(function mySucces(response) {
	       angular.copy(response.data, o.posts);
	       return response;
	    }, function myError(response) {
	       console.log(response)
	       return response;
	    });	    
	};
	//now we'll need to create new posts
	//uses the router.post in index.js to post a new Post mongoose model to mongodb
	//when $http gets a success back, it adds this post to the posts object in
	//this local factory, so the mongodb and angular data is the same
	//sweet!
	o.create = function(post) {
	  return $http.post('/posts', post, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).then(function(data){
	    o.posts.push(data);
	  });
	};
	
	o.upvote = function(post) {
	  return $http.put('/posts/' + post._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).then(function(data){
	    post.upvotes += 1;
	  });
	};
	//downvotes
	o.downvote = function(post) {
	  return $http.put('/posts/' + post._id + '/downvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).then(function(data){
	    post.upvotes -= 1;
	  });
	};
	//grab a single post from the server
	o.get = function(id) {
		//use the express route to grab this post and return the response
		//from that route, which is a json of the post data
		//.then is a promise, a kind of newly native thing in JS that upon cursory research
		//looks friggin sweet; TODO Learn to use them like a boss.  First, this.
		return $http.get('/posts/' + id).then(function(res) {
			return res.data;
		});
	};
	//comments, once again using express
	o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  });
	};
	
	o.upvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).then(function(data){
	    comment.upvotes += 1;
	  });
	};	
	//downvote comments
	//I should really consolidate these into one voteHandler function
	o.downvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/downvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).then(function(data){
	    comment.upvotes -= 1;
	  });
	};	
	return o;
}]);*/


/*app.controller('MainCtrl', ['$scope', '$filter','Upload', 'promiseObj', 'auth','posts',
function($scope, $filter, Upload, promiseObj, auth,posts) {
	
	console.log("promiseObj : ",promiseObj);
	$scope.posts = [];

	$scope.typeOptions = [
	    { name: 'Publish', value: 'publish' }, 
	    { name: 'Draft', value: 'draft' }
    ];
    	
	if(typeof promiseObj.data != "undefined"){
		$scope.posts = promiseObj.data;
	}
	//$scope.posts = posts.posts;	
	$scope.isLoggedIn = auth.isLoggedIn;
	//setting title to blank here to prevent empty posts
	$scope.title = '';

	$scope.created = $filter('date')(Date.now(),'dd-MM-yyyy'); 

	$scope.onTimeSet = function (newDate, oldDate) {
	    console.log("newDate : ",newDate);
	    console.log("oldDate : ",oldDate);
	}

	// upload on file select or drop 
    $scope.upload = function (file) {
        Upload.upload({
            url: '/upload/',
            data: {file: file}
        }).then(function (resp) {
        	console.log("resp : ",resp);
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            if(resp.data.status){
            	//save posts data
            	posts.create({
					title : $scope.title,
					link : $scope.link,
					files : [resp.data.files],
					description : $scope.description
				});
				//clear the values
				$scope.title = '';
				$scope.link = '';
				$scope.description = '';
            }            
        }, function (resp) {
        	console.log("error resp : ",resp);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

	$scope.addPost = function() {
		if ($scope.title === '') {
			return;
		}
		console.log("$scope.picFile	 : ",	$scope.picFile);
		if($scope.picFile){
			$scope.upload($scope.picFile);
		} else {
			posts.create({
				title : $scope.title,
				link : $scope.link,
				description : $scope.description,
				state: $scope.state
			});
			//clear the values
			$scope.title = '';
			$scope.link = '';
			$scope.description = '';
		}
	};

	$scope.upvote = function(post) {
		//our post factory has an upvote() function in it
		//we're just calling this using the post we have
		console.log('Upvoting:' + post.title + "votes before:" + post.upvotes);
		posts.upvote(post);
	};
	$scope.downvote = function(post) {
		posts.downvote(post);
	};	
}]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post', 'auth',
function($scope, posts, post, auth) {
	$scope.post = post;
	$scope.isLoggedIn = auth.isLoggedIn;

	$scope.addComment = function() {
		if ($scope.body === '') {
			return;
		}
		posts.addComment(post._id, {
			body : $scope.body,
			author : 'user'
		}).success(function(comment) {
			$scope.post.comments.push(comment);
		});
		$scope.body = '';
	};
	$scope.upvote = function(comment) {
		posts.upvoteComment(post, comment);
	};

	$scope.downvote = function(comment) {
		posts.downvoteComment(post, comment);
	};

}]);

app.controller('AuthCtrl', ['$scope', '$state', 'auth',
function($scope, $state, auth) {
	$scope.user = {};

	$scope.register = function() {
		auth.register($scope.user).catch(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
		});
	};

	$scope.logIn = function() {
		auth.logIn($scope.user).catch(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
		});
	};
}]);

app.controller('NavCtrl', ['$scope', 'auth',
function($scope, auth) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
}]);*/