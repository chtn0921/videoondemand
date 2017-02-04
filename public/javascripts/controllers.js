app.controller('MainCtrl', ['$scope', '$filter', 'promiseObj', 'auth','posts',
function($scope, $filter, promiseObj, auth,posts) {

	//console.log("promiseObj : ",promiseObj);
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
    	
	if(typeof promiseObj != "undefined"){
		$scope.posts = promiseObj;
	}
	//$scope.posts = posts.posts;	
	$scope.isLoggedIn = auth.isLoggedIn;
	//setting title to blank here to prevent empty posts
	$scope.title = 'Home';

	$scope.created = $filter('date')(Date.now(),'dd-MM-yyyy'); 
	
	$scope.current_movie = null;

	$scope.select_movie = function(id) {
								$scope.posts.forEach(function(entry){
									for(var i = 0; i<entry.length; i++) {										
										if(entry[i].hasOwnProperty("id") && entry[i]["id"] === id) {
								            $scope.current_movie = entry[i];	
								            posts.addToUserHistory({"id":entry[i]["id"]});
								        }
								    }
								});
							};

	$scope.onTimeSet = function (newDate, oldDate) {
	    console.log("newDate : ",newDate);
	    console.log("oldDate : ",oldDate);
	}

}]);

app.controller('HistoryCtrl',['$scope', '$filter','moviesObj','historyObj','auth','posts',
function($scope, $filter, moviesObj, historyObj, auth, posts) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.title = "My History";
	$scope.myhistory = [];	
	if(typeof moviesObj != "undefined"){			
		if(typeof historyObj != "undefined" && (historyObj.length > 0)){
			for (var i = 0; i < moviesObj.length; i++) {
				console.log("moviesObj[i] :: ",moviesObj[i]);
				moviesObj[i].find(function(movie){
					console.log("moviesObj.indexOf(movie.id) :: ",movie.id);
					if(historyObj.indexOf(movie.id) >= 0)  {
						$scope.myhistory.push(movie);
					}
				});
			}		
		}
	}
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
			if(!$scope.error){
				$state.go('home');	
			}			
		});
	};
}]);

app.controller('NavCtrl', ['$scope', 'auth',
function($scope, auth) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
}]);