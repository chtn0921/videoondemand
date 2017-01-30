app.factory('auth', ['$http', '$window',
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
			//console.log(" auth.isLoggedIn token : ",token );	
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
		/*return $http.get('/posts').success(function(data) {
			alert(555)
			angular.copy(data, o.posts);
			return data;
		});*/
		var movies = [];
		
		return $http({
	        method : "GET",
	        url : 'https://demo2697834.mockable.io/movies'
	    }).then(function mySucces(response) {	       
	       //console.log("Start Getting movies :: ",(response.data.entries && ( response.data.entries.length > 0 ) ));
	       if(response.data.entries && ( response.data.entries.length > 0 ) ){
	       		var start = 0;
	       		var i = 0;
	       		response.data.entries.forEach( function(entry){
	       			if((i!= 0) && (i%4 == 0)){
				    	start++;
				    }
				    if(movies[start]){
			//	    	console.log("push entries in array: ",start);
				    	movies[start].push(entry);	
				    } else {
			//	    	console.log("start create array: ",start);
				    	movies[start] = new Array(entry);
				    }					
					i++;
				});
	       }
	       //console.log("Getting movies :: ",movies);
	       angular.copy(movies, o.posts);
	       //angular.copy(response.data, o.posts);	       
	       //return response;
	       return o.posts;
	    }, function myError(response) {
	       console.log("Error Response :: ",response);
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
	  }).then(function(response){
	  	console.log("after create post data : ",response.data);
	    o.posts.push(response.data);
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
}]);