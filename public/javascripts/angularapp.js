
var shed = angular.module('shed', ['restangular', 'ngRoute','angular.filter','angularFileUpload','angular-jwt']).
	config(function ($routeProvider, RestangularProvider) {
		    $routeProvider
        .when('/start',{
            templateUrl:'templates/login.html',
            controller:'LoginCtrl'
        }).
        when('/reg',{
            templateUrl:'templates/register.html',
            controller:'RegCtrl'
        }).
        when('/forgot',{
            templateUrl:'templates/forgot.html',
            controller:'ForgCtrl'
        }).
        
        when('/dashboard', {
        controller: dashCtrl,
        templateUrl: 'templates/users.dashboard.html'
        
      }).
         when('/borrowed', {
         controller:BrwCtrl,
         templateUrl: 'templates/books.borrowed.html'

      }).
       when('/invite', {
         controller: InvCtrl,
         templateUrl: 'templates/users.invite.html'

      }).
      
      when('/registernew/:email/:invite', {
          controller: RegnwCtrl,
        templateUrl: 'templates/users.detail.html'
      


      }).
			when('/addbook', {
				controller: AddBookCtrl,
				templateUrl: 'templates/books.add.html'
			}).
			when('/listbooks', {
				controller: ListBookCtrl,
				templateUrl: 'templates/books.list.html'
			}).
			when('/author/:book.author', {
				controller: AthrBookCtrl,
				templateUrl: 'templates/book.view.html',
         resolve: {
					book: function (Restangular, $route) {
						return Restangular.one('books', $route.current.params.author).get();
					}


				}
			}).
			when('/viewbook/:bookId', {
				controller: ViewBookCtrl,
				templateUrl: 'templates/book.view.html',
       
				resolve: {
					book: function (Restangular, $route) {
						return Restangular.one('books', $route.current.params.bookId).get();
					}

				}
			}).
				when('/listusers', {
				controller: ListCtrl,
				templateUrl: 'templates/users.list.html'

			}).
			when('/edit/:userId', {
				controller: EditCtrl,
				templateUrl: 'templates/users.detail.html',
				resolve: {
					user: function (Restangular, $route) {
						return Restangular.one('users', $route.current.params.userId).get();
					}
				}
			}).
			when('/editbook/:bookId', {
				controller: EditBookCtrl,
				templateUrl: 'templates/books.add.html',
				resolve: {
					book: function (Restangular, $route) {
						return Restangular.one('books', $route.current.params.bookId).get();
					}
				}
			}).
			when('/new', {
				controller: ListBookCtrl,
				templateUrl: 'templates/books.list.html',
				
			}).
       when('/', {
        controller: ListBookCtrl,
        templateUrl: 'templates/books.list.html'
        
      }).
			otherwise({redirectTo: '/'});


		RestangularProvider.setBaseUrl('https://api.mongolab.com/api/1/databases/shed_database/collections');
		RestangularProvider.setDefaultRequestParams({ apiKey: 'Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl' })
		RestangularProvider.setRestangularFields({
			id: '_id.$oid'
		});

		RestangularProvider.setRequestInterceptor(function (elem, operation, what) {

			if (operation === 'put') {
				elem._id = undefined;
				return elem;
			}
			return elem;
		})
	});
  shed.run(function($rootScope, $location,auth) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if (!auth.isLoggedIn()) {
          console.log('login required');
        if ( next.templateUrl === "template/login.html" || next.templateUrl === "template/register.html"|| next.templateUrl === "template/users.detail.html") {
        } else {
          $location.path("/start");
        }
      }
    });
  });
	

  shed.controller('LoginCtrl', [
'$scope',
'$location',
'auth',
function($scope, $location, auth){
 $scope.bdclass="login-content";

  $scope.user = {};



  $scope.login = function(){
    auth.login($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $location.path('/dashboard');
    });
  };
}]);

  shed.controller('RegCtrl', [
'$scope',
'$http',
'$location',
'auth',
function($scope, $http, $location, auth){
 $scope.bdclass="login-content";

  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
   
       }).then(function(){
     
        $http.post('/team',  $scope.user);
               
          $location.path('/start');
         });

  };


}]);



shed.controller('ForgCtrl', [
'$scope',
'$location',
'auth',
function($scope, $location, auth){
 $scope.bdclass="login-content";

  $scope.user = {};

}]);



// simple stub that could use a lot of work...
shed.factory('RESTService',
    function ($http) {
        return {
            get:function (url, callback) {
                return $http({method:'GET', url:url}).
                    success(function (data, status, headers, config) {
                        callback(data);
                        //console.log(data.json);
                    }).
                    error(function (data, status, headers, config) {
                        console.log("failed to retrieve data");
                    });
            }
        };
    }
);

shed.factory('auth' , ['$http','$window','jwtHelper','$q',function($http , $window ,jwtHelper,$q){
   var auth = {};




   auth.saveToken = function (token){
      
      $window.sessionStorage['shed-token'] = token;

   };

   auth.getToken = function (){ 
     return $window.sessionStorage['shed-token'];
   };

   auth.userProfile = function(){
    var usertype ='';
      var deferred = $q.defer();

      if(auth.isLoggedIn()){
            var token = auth.getToken();
        var payload = jwtHelper.decodeToken(token);

      $http.get('/profiles/'+payload._id).success(function(data){

              deferred.resolve(data);

        });

        return deferred.promise;
      }
      

   }

   auth.currentInvitedby = function(){
    var usertype ='';
      var deferred = $q.defer();

      if(auth.isLoggedIn()){
            var token = auth.getToken();
        var payload = jwtHelper.decodeToken(token);

      $http.get('/profiles/'+payload._id).success(function(data){

              deferred.resolve(data['0']['invitedby']);

        });

        return deferred.promise;
      }
      

   }

    auth.teamId = function(){
    var usertype ='';
      var deferred = $q.defer();

      if(auth.isLoggedIn()){
            var token = auth.getToken();
        var payload = jwtHelper.decodeToken(token);

      $http.get('/team/'+payload.username).success(function(data){

          deferred.resolve(data);

        });

        return deferred.promise;
      }
      

   }
  auth.userType = function(){
    var usertype ='';
      var deferred = $q.defer();

      if(auth.isLoggedIn()){
            var token = auth.getToken();
        var payload = jwtHelper.decodeToken(token);

      $http.get('/profiles/'+payload._id).success(function(data){

              deferred.resolve(data);

        });

        return deferred.promise;
      }
      

   }

   auth.isLoggedIn = function(){
     var token = auth.getToken();
     
     if(token){
       
      return true;

     }
     else {
       return false;

     }

        };

    auth.currentUser = function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload =jwtHelper.decodeToken(token);

        return payload.username;
      }
    };

     auth.register = function(user){
        return $http.post('/register', user).success(function(data){
          auth.saveToken(data.token);

        });
     };

      auth.login = function(user){

         return $http.post('/login', user).success(function(data){
          auth.saveToken(data.token);

        });
     };

     auth.logOut = function(){
      $window.localStorage.removeItem('shed-token');

     }
      
   return auth;

}]);

var compareTo = function() {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  };

shed.directive("compareTo", compareTo);

FileUploadCtrl.$inject = ['$scope']
function FileUploadCtrl(scope) {
    

    scope.setFiles = function(element) {
    scope.$apply(function(scope) {
      console.log('files:', element.files);
      // Turn the FileList object into an Array
        scope.files = []
        for (var i = 0; i < element.files.length; i++) {
          scope.files.push(element.files[i])
        }
      scope.progressVisible = false
      });
    };

    scope.uploadFile = function() {
        var fd = new FormData()
        for (var i in scope.files) {
            fd.append("uploadedFile", scope.files[i])
        }
        var xhr = new XMLHttpRequest()
        xhr.upload.addEventListener("progress", uploadProgress, false)
        xhr.addEventListener("load", uploadComplete, false)
        xhr.addEventListener("error", uploadFailed, false)
        xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", "upload.php")
        scope.progressVisible = true
        xhr.send(fd)
    }

    function uploadProgress(evt) {
        scope.$apply(function(){
            if (evt.lengthComputable) {
                scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                scope.progress = 'unable to compute'
            }
        })
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        alert(evt.target.responseText)
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
        scope.$apply(function(){
            scope.progressVisible = false
        })
        alert("The upload has been canceled by the user or the browser dropped the connection.")
    }
}



