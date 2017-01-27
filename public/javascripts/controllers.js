app.controller('MainCtrl', ['$scope', '$filter','Upload', 'promiseObj', 'auth','posts',
function($scope, $filter, Upload, promiseObj, auth,posts) {
	/*console.log("Test");*/
	console.log("promiseObj : ",promiseObj);
	$scope.posts = [];

	$scope.typeOptions = [
	    { name: 'Publish', value: 'publish' }, 
	    { name: 'Draft', value: 'draft' }
    ];
    $scope.status = 'publish';


    $scope.categories = [];
    $scope.category = $scope.categories['0']  || "";
    $scope.addCategory = function(){
    	console.log("Add category initialize");
    };
    	
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
        	//console.log("resp : ",resp);
            //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            if(resp.data.status){
            	//save posts data
            	posts.create({
					title : $scope.title,
					link : $scope.link,
					files : [resp.data.files],
					description : $scope.description,
					status : $scope.status
				});
				//clear the values
				/*$scope.title = '';
				$scope.link = '';
				$scope.description = '';
				$scope.created = '';*/
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
		//console.log("$scope.picFile	 : ",	$scope.picFile);
		if($scope.picFile){
			$scope.upload($scope.picFile);
		} else {
			posts.create({
				title : $scope.title,
				link : $scope.link,
				description : $scope.description,
				status: $scope.status
			});			
		}
		//clear the values
		$scope.title = '';
		$scope.link = '';
		$scope.description = '';
		$scope.posts = posts.posts;	
		$scope.status = 'publish';	
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

	/*$scope.$watch('created',function(newValue,OldValue,scope){
		console.log("watch : ",typeof newValue);
		//var mydate = new Date(newValue);
   		//$scope.created = mydate.toString("MMMM yyyy");
	})*/
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
}]);