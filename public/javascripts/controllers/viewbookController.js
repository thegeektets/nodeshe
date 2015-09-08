function ViewBookCtrl($rootScope,$scope, $location,$route, $http,auth){
  
  $scope.isLoggedIn = auth.isLoggedIn();
  $scope.currentUser = auth.currentUser();
 
 auth.userProfile().then(function(data) {
    $scope.userProfile = data;

   
});

  $scope.logOut = function(){

  console.log('getting there');

  auth.logOut();

  $location.path('/start');



}
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

    $scope.myborrowed = null;

  
     $http.get('/myborrowedlist/'+auth.currentId()).success(function(data){

          for (var i = data.length - 1; i >= 0; i--) {
                     

            if(data[i]['bookid'] == $route.current.params.bookId && !(data[i]['returndate']) ){

                  $scope.myborrowed = data[i];

                


              
              }
          };          
            

      
       

      });

  

	$scope.borrow = function(user,email){

     $scope.borrowed.borrowdate = new Date();
     $scope.borrowed.bookid  = $route.current.params.bookId;
     $scope.borrowed.userid = auth.currentId();
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
      

      $location.path('/listbooks');
  

	};

	$scope.return = function(){
     $scope.borrowed.returndate = new Date();
     transaction = parseInt(transaction) + 1;
     $scope.book.transaction = transaction ;

    
     $http.put('/updateborrowed/'+$route.current.params.bookId+'/'+auth.currentId() ,$scope.borrowed ).error(function(error){
      $scope.error = error;
      });

     $http.put('/updatetransaction/'+$route.current.params.bookId ,$scope.book ).error(function(error){
      $scope.error = error;
      });


     $scope.myborrowed = null;

     $location.path('/listbooks');



	
	};

	$scope.reviewbook= function(user){
     $scope.review.bookid = $route.current.params.bookId;
     $scope.review.user = user;
     $scope.book.transaction = $scope.book.copies;

      $http.post('/reviewbook', $scope.review).error(function(error){
        $scope.error = error;
      });
      
      //$route.reload();

	
	};
}