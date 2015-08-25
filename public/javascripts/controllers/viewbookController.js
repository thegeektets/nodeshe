function ViewBookCtrl($rootScope,$scope, $location, Restangular,$route, $http,auth){
  
  $scope.isLoggedIn = auth.isLoggedIn();
  $scope.currentUser = auth.currentUser();
 
 auth.userProfile().then(function(data) {
    $scope.userProfile = data;

   
});

  $scope.logOut = auth.logOut();
  $scope.bdclass = "";

  $scope.borrowed = {};
  

    auth.teamId().then(function(data) {
    
    $scope.teamId = data._id;

     $http.get('/librarybooks/'+$scope.teamId).success(function(data){

       $scope.relatedbooks = data;


      });

    });  
    var transaction;

    $http.get('/book/'+$route.current.params.bookId).success(function(data){

       $scope.book = data;
       transaction = $scope.book.transaction;


      });

    $http.get('/reviews/'+$route.current.params.bookId).success(function(data){

     $scope.reviews = data;
         

      });
      $scope.review ={};


	$scope.borrow = function(user,email){

     $scope.borrowed.borrowdate = new Date();
     $scope.borrowed.bookid  = $route.current.params.bookId;
     $scope.borrowed.userid = $scope.userProfile['_id'];
     $scope.borrowed.bookname = $scope.book.title;
     $scope.borrowed.username = user;
     $scope.borrowed.teamid = $scope.book.teamid;
     $scope.borrowed.usermail = email;

     transaction = transaction - 1;
     $scope.book.transaction = transaction ;

    
    
      $http.post('/borrowbook', $scope.borrowed).error(function(error){
      $scope.error = error;
      });

      $http.put('/updatetransaction/'+$route.current.params.bookId ,$scope.book ).error(function(error){
      $scope.error = error;
      });


      
      //$route.reload();


	};

	$scope.return = function(){
     $http.get('https://api.mongolab.com/api/1/databases/shed_database/collections/borrowed/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"bookid":"'+book._id.$oid+'","userid":"'+$rootScope.authService.userId()+'"}')
                .success(function(data){
                 if(data.length > 0){
                 $scope.borrowed = data[data.length-1];
               }
               else{
                  $scope.borrowed = data;
               
               }
                 console.log($scope.borrowed);
               


        $http({
          url :'https://api.mongolab.com/api/1/databases/shed_database/collections/borrowed/?apiKey=Iwy7zOOBBd6lUzN5jBhLNhv68Wv8UfUl&q={"bookid":"'+book._id.$oid+'","userid":"'+$rootScope.authService.userId()+'"}',

          method :"PUT",
          data :{
          "borrowdate":$scope.borrowed.borrowdate ,
          "bookid":$scope.borrowed.bookid,
          "userid":$scope.borrowed.userid,
          "bookname":$scope.borrowed.bookname,
          "username":$scope.borrowed.username,
          "teamid":$scope.borrowed.teamid,
           "usermail":$scope.borrowed.usermail,
          "returndate":new Date()}
        }).success(function(data, status) {
           
   
              
            $scope.book.status = 'available';
             $scope.book.borrowedby = '';
             $scope.book.borrowedbyemail = '';
              $scope.book.transaction = ($scope.book.transaction + 1 );
           

              $scope.book.put().then(function () {
            $location.path('/viewbook/'+book._id.$oid);
    });
              
              })

                });

     

	
	};

	$scope.reviewbook= function(user){
     $scope.review.bookid = $route.current.params.bookId;
     $scope.review.user = user;
     $scope.book.transaction = $scope.book.copies;

      $http.post('/reviewbook', $scope.review).error(function(error){
        $scope.error = error;
      });
      
      $route.reload();

	
	};
}